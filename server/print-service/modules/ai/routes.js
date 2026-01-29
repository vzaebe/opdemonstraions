const express = require('express')
const router = express.Router()
const aiController = require('./controller')
const { optionalAuth, authenticate } = require('../../middleware/auth')
const { requireFeature } = require('../../middleware/featureFlag')

/**
 * AI Routes (все требуют feature flag 'ai' = true)
 */

// Chat assistant
router.post('/chat', requireFeature('ai'), optionalAuth, aiController.chat.bind(aiController))

// Analyze model
router.post('/analyze-model', requireFeature('ai'), optionalAuth, aiController.analyzeModel.bind(aiController))

// 2D→3D generation request
router.post('/generate-3d-request', requireFeature('ai'), authenticate, aiController.generate3DRequest.bind(aiController))

// Get request status
router.get('/requests/:id', requireFeature('ai'), authenticate, aiController.getRequest.bind(aiController))

module.exports = router
