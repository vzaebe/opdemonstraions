const dbConnection = require('../../database/connection')
const logger = require('../../utils/logger')
const constants = require('../../config/constants')

/**
 * Production Queue Service
 */
class QueueService {
  /**
   * Create queue items from order
   */
  async createFromOrder(orderId) {
    const db = dbConnection.getDb()

    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId)

    for (const item of orderItems) {
      // Create queue item for each order item
      db.prepare(
        `
        INSERT INTO production_queue (order_item_id, status, priority)
        VALUES (?, ?, ?)
      `
      ).run(item.id, constants.QUEUE_STATUSES.QUEUED, 0)
    }

    logger.info('Queue items created from order', { orderId, count: orderItems.length })
  }

  /**
   * Get queue items
   */
  getAll({ status, printerId, limit = 50, offset = 0 }) {
    const db = dbConnection.getDb()

    let query = `
      SELECT
        q.*,
        oi.model_id, oi.quantity, oi.params_json,
        o.order_number, o.email,
        p.name as printer_name
      FROM production_queue q
      JOIN order_items oi ON q.order_item_id = oi.id
      JOIN orders o ON oi.order_id = o.id
      LEFT JOIN printers p ON q.printer_id = p.id
      WHERE 1=1
    `
    const params = []

    if (status) {
      query += ' AND q.status = ?'
      params.push(status)
    }

    if (printerId) {
      query += ' AND q.printer_id = ?'
      params.push(printerId)
    }

    query += ' ORDER BY q.priority DESC, q.created_at ASC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const items = db.prepare(query).all(...params)

    // Parse JSON
    items.forEach((item) => {
      item.params = item.params_json ? JSON.parse(item.params_json) : {}
      delete item.params_json
    })

    // Count total
    let countQuery = 'SELECT COUNT(*) as total FROM production_queue WHERE 1=1'
    const countParams = []
    if (status) {
      countQuery += ' AND status = ?'
      countParams.push(status)
    }
    if (printerId) {
      countQuery += ' AND printer_id = ?'
      countParams.push(printerId)
    }
    const { total } = db.prepare(countQuery).get(...countParams)

    return { items, total }
  }

  /**
   * Get queue item by ID
   */
  getById(id) {
    const db = dbConnection.getDb()

    const item = db
      .prepare(
        `
      SELECT
        q.*,
        oi.model_id, oi.quantity, oi.params_json, oi.unit_price,
        o.order_number, o.email, o.status as order_status,
        p.name as printer_name,
        m.format, m.file_id
      FROM production_queue q
      JOIN order_items oi ON q.order_item_id = oi.id
      JOIN orders o ON oi.order_id = o.id
      LEFT JOIN printers p ON q.printer_id = p.id
      LEFT JOIN models m ON oi.model_id = m.id
      WHERE q.id = ?
    `
      )
      .get(id)

    if (!item) {
      throw { statusCode: 404, message: 'Queue item not found' }
    }

    item.params = item.params_json ? JSON.parse(item.params_json) : {}
    delete item.params_json

    return item
  }

  /**
   * Update queue item
   */
  async update(id, { printerId, status, priority, notes, scheduledAt }) {
    const db = dbConnection.getDb()

    const item = this.getById(id)
    const oldStatus = item.status
    const oldPrinterId = item.printer_id

    const updates = []
    const params = []

    if (printerId !== undefined) {
      updates.push('printer_id = ?')
      params.push(printerId)
    }

    if (status !== undefined) {
      updates.push('status = ?')
      params.push(status)

      // Set timestamps based on status
      if (status === constants.QUEUE_STATUSES.PRINTING && !item.started_at) {
        updates.push('started_at = CURRENT_TIMESTAMP')
      }
      if (status === constants.QUEUE_STATUSES.COMPLETED && !item.completed_at) {
        updates.push('completed_at = CURRENT_TIMESTAMP')
      }
      if (status === constants.QUEUE_STATUSES.PAUSED) {
        updates.push('paused_at = CURRENT_TIMESTAMP')
      }
    }

    if (priority !== undefined) {
      updates.push('priority = ?')
      params.push(priority)
    }

    if (notes !== undefined) {
      updates.push('notes = ?')
      params.push(notes)
    }

    if (scheduledAt !== undefined) {
      updates.push('scheduled_at = ?')
      params.push(scheduledAt)
    }

    if (updates.length === 0) {
      return item
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    params.push(id)

    db.prepare(`UPDATE production_queue SET ${updates.join(', ')} WHERE id = ?`).run(...params)

    // Insert history
    db.prepare(
      `
      INSERT INTO production_queue_history (
        queue_item_id, event_type, old_status, new_status,
        old_printer_id, new_printer_id, comment
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
      id,
      status ? 'status_change' : 'update',
      oldStatus,
      status || oldStatus,
      oldPrinterId,
      printerId || oldPrinterId,
      notes || null
    )

    logger.info('Queue item updated', { id, status, printerId })

    return this.getById(id)
  }

  /**
   * Get queue history
   */
  getHistory(itemId) {
    const db = dbConnection.getDb()

    return db
      .prepare(
        `
      SELECT h.*, u.name as changed_by_name
      FROM production_queue_history h
      LEFT JOIN users u ON h.changed_by = u.id
      WHERE h.queue_item_id = ?
      ORDER BY h.created_at DESC
    `
      )
      .all(itemId)
  }
}

module.exports = new QueueService()
