const dbConnection = require('../../database/connection')
const logger = require('../../utils/logger')
const constants = require('../../config/constants')

/**
 * Orders Service
 */
class OrdersService {
  /**
   * Create order
   */
  async create({ userId = null, email, phone, name, items, shipping, paymentMethod, comment }) {
    const db = dbConnection.getDb()

    try {
      // Validate items
      if (!items || items.length === 0) {
        throw { statusCode: 400, message: 'Order must contain at least one item' }
      }

      // Calculate totals
      let subtotal = 0
      const orderItems = []

      for (const item of items) {
        // Get quote or calculate on the fly
        const { model_id, material_id, profile_id, quantity, params } = item

        // For simplicity, assume price is already calculated and passed
        const unitPrice = item.unit_price || 0
        const totalPrice = unitPrice * quantity

        subtotal += totalPrice

        orderItems.push({
          model_id,
          material_id,
          profile_id,
          quantity,
          params,
          unit_price: unitPrice,
          total_price: totalPrice,
        })
      }

      // Get shipping cost
      let shippingCost = 0
      if (shipping && shipping.method_id) {
        const shippingMethod = db.prepare('SELECT * FROM shipping_methods WHERE id = ?').get(shipping.method_id)
        if (shippingMethod) {
          shippingCost = shippingMethod.base_price
        }
      }

      // Calculate total
      const discount = 0 // TODO: apply discounts/coupons
      const total = subtotal + shippingCost - discount

      // Generate order number
      const orderNumber = this.generateOrderNumber()

      // Insert order
      const orderResult = db
        .prepare(
          `
        INSERT INTO orders (
          order_number, user_id, email, phone, name,
          status, subtotal, shipping_cost, discount, total,
          shipping_method_id, shipping_address_json,
          payment_method, payment_status, comment
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          orderNumber,
          userId,
          email,
          phone || null,
          name || null,
          constants.ORDER_STATUSES.PENDING,
          subtotal,
          shippingCost,
          discount,
          total,
          shipping?.method_id || null,
          shipping ? JSON.stringify(shipping.address || {}) : null,
          paymentMethod || 'cash',
          constants.PAYMENT_STATUSES.PENDING,
          comment || null
        )

      const orderId = orderResult.lastInsertRowid

      // Insert order items
      for (const item of orderItems) {
        // Get model snapshot
        const model = db.prepare('SELECT * FROM models WHERE id = ?').get(item.model_id)
        const modelSnapshot = {
          bbox: { x: model.bbox_x, y: model.bbox_y, z: model.bbox_z },
          volume: model.volume,
          format: model.format,
        }

        db.prepare(
          `
          INSERT INTO order_items (
            order_id, model_id, model_snapshot_json,
            material_id, profile_id, quantity,
            params_json, unit_price, total_price
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
        ).run(
          orderId,
          item.model_id,
          JSON.stringify(modelSnapshot),
          item.material_id,
          item.profile_id,
          item.quantity,
          JSON.stringify(item.params || {}),
          item.unit_price,
          item.total_price
        )
      }

      // Insert initial status history
      db.prepare(
        `
        INSERT INTO order_status_history (order_id, status, comment)
        VALUES (?, ?, ?)
      `
      ).run(orderId, constants.ORDER_STATUSES.PENDING, 'Order created')

      // TODO: Send email notification
      // TODO: Create production queue items

      logger.info('Order created', { orderId, orderNumber, total, userId })

      return this.getById(orderId)
    } catch (error) {
      logger.error('Order creation failed', { error: error.message })
      throw error
    }
  }

  /**
   * Get order by ID
   */
  getById(orderId) {
    const db = dbConnection.getDb()

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId)
    if (!order) {
      throw { statusCode: 404, message: 'Order not found' }
    }

    // Parse JSON fields
    order.shipping_address = order.shipping_address_json ? JSON.parse(order.shipping_address_json) : null
    order.payment_data = order.payment_data_json ? JSON.parse(order.payment_data_json) : null
    delete order.shipping_address_json
    delete order.payment_data_json

    // Get items
    order.items = db
      .prepare(
        `
      SELECT oi.*, m.format, m.file_id, f.original_name
      FROM order_items oi
      LEFT JOIN models m ON oi.model_id = m.id
      LEFT JOIN files f ON m.file_id = f.id
      WHERE oi.order_id = ?
    `
      )
      .all(orderId)

    order.items.forEach((item) => {
      item.model_snapshot = item.model_snapshot_json ? JSON.parse(item.model_snapshot_json) : null
      item.params = item.params_json ? JSON.parse(item.params_json) : {}
      delete item.model_snapshot_json
      delete item.params_json
    })

    // Get status history
    order.status_history = db
      .prepare(
        `
      SELECT h.*, u.name as changed_by_name
      FROM order_status_history h
      LEFT JOIN users u ON h.changed_by = u.id
      WHERE h.order_id = ?
      ORDER BY h.created_at DESC
    `
      )
      .all(orderId)

    return order
  }

  /**
   * Get orders by user
   */
  getByUser(userId, { status, limit = 20, offset = 0 }) {
    const db = dbConnection.getDb()

    let query = 'SELECT * FROM orders WHERE user_id = ?'
    const params = [userId]

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const orders = db.prepare(query).all(...params)

    // Count total
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE user_id = ?'
    const countParams = [userId]
    if (status) {
      countQuery += ' AND status = ?'
      countParams.push(status)
    }
    const { total } = db.prepare(countQuery).get(...countParams)

    return { orders, total }
  }

  /**
   * Update order status
   */
  async updateStatus(orderId, newStatus, comment = null, changedBy = null) {
    const db = dbConnection.getDb()

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId)
    if (!order) {
      throw { statusCode: 404, message: 'Order not found' }
    }

    // Update order
    db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, orderId)

    // Insert history
    db.prepare(
      `
      INSERT INTO order_status_history (order_id, status, comment, changed_by)
      VALUES (?, ?, ?, ?)
    `
    ).run(orderId, newStatus, comment, changedBy)

    // TODO: Send email notification

    logger.info('Order status updated', { orderId, oldStatus: order.status, newStatus, changedBy })

    return this.getById(orderId)
  }

  /**
   * Generate unique order number
   */
  generateOrderNumber() {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    const db = dbConnection.getDb()
    const todayStart = `${year}-${month}-${day} 00:00:00`
    const { count } = db.prepare('SELECT COUNT(*) as count FROM orders WHERE created_at >= ?').get(todayStart)

    const sequence = String(count + 1).padStart(4, '0')

    return `OP-${year}${month}${day}-${sequence}`
  }

  /**
   * Get order messages
   */
  getMessages(orderId) {
    const db = dbConnection.getDb()

    return db
      .prepare(
        `
      SELECT m.*, u.name as author_name
      FROM order_messages m
      LEFT JOIN users u ON m.author_user_id = u.id
      WHERE m.order_id = ?
      ORDER BY m.created_at ASC
    `
      )
      .all(orderId)
  }

  /**
   * Add message to order
   */
  async addMessage(orderId, { authorType, authorUserId, message, attachments = [] }) {
    const db = dbConnection.getDb()

    const result = db
      .prepare(
        `
      INSERT INTO order_messages (order_id, author_type, author_user_id, message, attachments_json)
      VALUES (?, ?, ?, ?, ?)
    `
      )
      .run(orderId, authorType, authorUserId, message, JSON.stringify(attachments))

    const messageId = result.lastInsertRowid

    logger.info('Order message added', { orderId, messageId, authorType })

    return db.prepare('SELECT * FROM order_messages WHERE id = ?').get(messageId)
  }
}

module.exports = new OrdersService()
