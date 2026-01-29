const queueService = require('./service')
const { success } = require('../../utils/response')

/**
 * Queue Controller
 */
class QueueController {
  /**
   * GET /queue
   */
  async getAll(req, res, next) {
    try {
      const { status, printer_id, limit, offset } = req.query

      const result = queueService.getAll({
        status,
        printerId: printer_id,
        limit,
        offset,
      })

      return success(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /queue/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params

      const item = queueService.getById(id)

      return success(res, item)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /queue/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params
      const { printer_id, status, priority, notes, scheduled_at } = req.body

      const updated = await queueService.update(id, {
        printerId: printer_id,
        status,
        priority,
        notes,
        scheduledAt: scheduled_at,
      })

      return success(res, updated, 'Queue item updated')
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /queue/:id/history
   */
  async getHistory(req, res, next) {
    try {
      const { id } = req.params

      const history = queueService.getHistory(id)

      return success(res, { history })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new QueueController()
