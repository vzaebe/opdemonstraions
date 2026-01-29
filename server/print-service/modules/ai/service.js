const { createAIProvider } = require('./provider')
const dbConnection = require('../../database/connection')
const config = require('../../config')
const logger = require('../../utils/logger')

/**
 * AI Service
 */
class AIService {
  constructor() {
    this.provider = null
    this.initProvider()
  }

  initProvider() {
    // Check if AI is enabled
    const db = dbConnection.getDb()
    const flag = db.prepare('SELECT enabled FROM feature_flags WHERE key = "ai"').get()

    if (!flag || !flag.enabled) {
      this.provider = createAIProvider({ type: 'disabled' })
      return
    }

    // Create provider based on config
    this.provider = createAIProvider({
      type: config.ai.openaiApiKey ? 'openai' : 'disabled',
      apiKey: config.ai.openaiApiKey,
      model: config.ai.openaiModel,
    })
  }

  /**
   * Chat assistant
   */
  async chat(message, context = {}) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'Вы - помощник по 3D-печати. Помогаете пользователям с выбором параметров печати, материалов, и даете советы по оптимизации моделей.',
        },
      ]

      // Add context if provided
      if (context.model_id) {
        const db = dbConnection.getDb()
        const model = db.prepare('SELECT * FROM models WHERE id = ?').get(context.model_id)
        if (model) {
          messages.push({
            role: 'system',
            content: `Контекст: пользователь работает с моделью размером ${model.bbox_x}×${model.bbox_y}×${model.bbox_z} мм, объем ${(model.volume / 1000).toFixed(2)} см³.`,
          })
        }
      }

      messages.push({
        role: 'user',
        content: message,
      })

      const response = await this.provider.chat(messages)

      logger.info('AI chat request', { message: message.substring(0, 50) })

      return response
    } catch (error) {
      logger.error('AI chat error', { error: error.message })
      throw error
    }
  }

  /**
   * Analyze 3D model
   */
  async analyzeModel(modelId) {
    try {
      const db = dbConnection.getDb()
      const model = db.prepare('SELECT * FROM models WHERE id = ?').get(modelId)

      if (!model) {
        throw { statusCode: 404, message: 'Model not found' }
      }

      const metadata = {
        bbox: { x: model.bbox_x, y: model.bbox_y, z: model.bbox_z },
        volume: model.volume,
        surface_area: model.surface_area,
        triangle_count: model.triangle_count,
        warnings: model.warnings_json ? JSON.parse(model.warnings_json) : [],
      }

      const analysis = await this.provider.analyzeModel(metadata)

      logger.info('AI model analysis', { modelId })

      return analysis
    } catch (error) {
      logger.error('AI model analysis error', { error: error.message })
      throw error
    }
  }

  /**
   * Create 2D→3D generation request
   */
  async create2DTo3DRequest(userId, imageData, description) {
    try {
      const db = dbConnection.getDb()

      // Create request in DB
      const result = db
        .prepare(
          `
        INSERT INTO ai_requests (user_id, type, input_data_json, status)
        VALUES (?, '2d_to_3d', ?, 'pending')
      `
        )
        .run(userId, JSON.stringify({ image: imageData, description }))

      const requestId = result.lastInsertRowid

      logger.info('2D→3D request created', { requestId, userId })

      // TODO: Notify admin
      // TODO: Or call AI provider if automatic generation is enabled

      return {
        request_id: requestId,
        status: 'pending',
        message: 'Ваша заявка принята. Менеджер свяжется с вами в течение 24 часов.',
      }
    } catch (error) {
      logger.error('2D→3D request error', { error: error.message })
      throw error
    }
  }

  /**
   * Get AI request by ID
   */
  getRequest(requestId) {
    const db = dbConnection.getDb()

    const request = db.prepare('SELECT * FROM ai_requests WHERE id = ?').get(requestId)

    if (!request) {
      throw { statusCode: 404, message: 'Request not found' }
    }

    request.input_data = request.input_data_json ? JSON.parse(request.input_data_json) : {}
    request.result_data = request.result_data_json ? JSON.parse(request.result_data_json) : {}
    delete request.input_data_json
    delete request.result_data_json

    return request
  }
}

module.exports = new AIService()
