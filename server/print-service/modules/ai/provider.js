/**
 * AI Provider Interface
 * Абстракция для разных AI провайдеров (OpenAI, Local, Ollama)
 */

class AIProvider {
  /**
   * Chat completion
   */
  async chat(messages, options = {}) {
    throw new Error('Method not implemented')
  }

  /**
   * Analyze 3D model
   */
  async analyzeModel(modelMetadata, context = {}) {
    throw new Error('Method not implemented')
  }

  /**
   * Generate 3D from 2D
   */
  async generate3DFrom2D(imageData, description, options = {}) {
    throw new Error('Method not implemented')
  }
}

/**
 * Mock/Disabled Provider
 */
class DisabledProvider extends AIProvider {
  async chat() {
    throw { statusCode: 403, message: 'AI feature is disabled' }
  }

  async analyzeModel() {
    throw { statusCode: 403, message: 'AI feature is disabled' }
  }

  async generate3DFrom2D() {
    throw { statusCode: 403, message: 'AI feature is disabled' }
  }
}

/**
 * OpenAI Provider (stub)
 */
class OpenAIProvider extends AIProvider {
  constructor(apiKey, model = 'gpt-4') {
    super()
    this.apiKey = apiKey
    this.model = model
  }

  async chat(messages, options = {}) {
    // TODO: Implement OpenAI API integration
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {...})
    throw new Error('OpenAI integration not implemented yet')
  }

  async analyzeModel(modelMetadata) {
    // TODO: Send model metadata to GPT for analysis
    throw new Error('OpenAI integration not implemented yet')
  }

  async generate3DFrom2D(imageData, description) {
    // TODO: This would require specialized 3D generation model
    throw new Error('3D generation not implemented yet')
  }
}

/**
 * Factory to create AI provider based on config
 */
function createAIProvider(config) {
  const type = config.type || 'disabled'

  switch (type) {
    case 'openai':
      return new OpenAIProvider(config.apiKey, config.model)
    case 'disabled':
    default:
      return new DisabledProvider()
  }
}

module.exports = {
  AIProvider,
  DisabledProvider,
  OpenAIProvider,
  createAIProvider,
}
