const ordersService = require('./service')
const { created, success } = require('../../utils/response')

/**
 * Orders Controller
 */
class OrdersController {
  /**
   * POST /orders/create
   */
  async create(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null
      const { items, contacts, shipping, payment_method, comment } = req.body

      // Validation
      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Items are required' })
      }

      if (!contacts || !contacts.email) {
        return res.status(400).json({ error: 'Email is required' })
      }

      const order = await ordersService.create({
        userId,
        email: contacts.email,
        phone: contacts.phone,
        name: contacts.name,
        items,
        shipping,
        paymentMethod: payment_method,
        comment,
      })

      return created(res, { order }, 'Order created successfully')
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /orders
   * Get current user's orders
   */
  async getMyOrders(req, res, next) {
    try {
      const userId = req.user.id
      const { status, limit, offset } = req.query

      const result = await ordersService.getByUser(userId, { status, limit, offset })

      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /orders/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params

      const order = ordersService.getById(id)

      // Check access
      if (
        req.user &&
        order.user_id &&
        order.user_id !== req.user.id &&
        req.user.role !== 'admin' &&
        req.user.role !== 'superadmin'
      ) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      return success(res, order)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /orders/:id/messages
   */
  async getMessages(req, res, next) {
    try {
      const { id } = req.params

      // Check access
      const order = ordersService.getById(id)
      if (
        req.user &&
        order.user_id &&
        order.user_id !== req.user.id &&
        req.user.role !== 'admin' &&
        req.user.role !== 'superadmin'
      ) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      const messages = ordersService.getMessages(id)

      return success(res, { messages })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /orders/:id/messages
   */
  async addMessage(req, res, next) {
    try {
      const { id } = req.params
      const { message } = req.body

      if (!message) {
        return res.status(400).json({ error: 'Message is required' })
      }

      // Check access
      const order = ordersService.getById(id)
      if (
        req.user &&
        order.user_id &&
        order.user_id !== req.user.id &&
        req.user.role !== 'admin' &&
        req.user.role !== 'superadmin'
      ) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      const authorType = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin') ? 'admin' : 'client'

      const newMessage = await ordersService.addMessage(id, {
        authorType,
        authorUserId: req.user ? req.user.id : null,
        message,
      })

      return created(res, newMessage, 'Message sent')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new OrdersController()
