const aiService = require('./service')
const { success, created } = require('../../utils/response')

/**
 * AI Controller
 */
class AIController {
  /**
   * POST /ai/chat
   */
  async chat(req, res, next) {
    try {
      const { message, context } = req.body

      if (!message) {
        return res.status(400).json({ error: 'Message is required' })
      }

      const response = await aiService.chat(message, context || {})

      return success(res, response)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /ai/analyze-model
   */
  async analyzeModel(req, res, next) {
    try {
      const { model_id } = req.body

      if (!model_id) {
        return res.status(400).json({ error: 'model_id is required' })
      }

      const analysis = await aiService.analyzeModel(model_id)

      return success(res, analysis)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /ai/generate-3d-request
   */
  async generate3DRequest(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null
      const { image, description } = req.body

      if (!image || !description) {
        return res.status(400).json({ error: 'image and description are required' })
      }

      const result = await aiService.create2DTo3DRequest(userId, image, description)

      return created(res, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /ai/requests/:id
   */
  async getRequest(req, res, next) {
    try {
      const { id } = req.params

      const request = aiService.getRequest(id)

      // Check access
      if (req.user && request.user_id && request.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' })
      }

      return success(res, request)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AIController()
