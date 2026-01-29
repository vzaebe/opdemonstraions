const express = require('express')
const router = express.Router()
const modelsController = require('./controller')
const { optionalAuth, authenticate } = require('../../middleware/auth')
const { requireFeature } = require('../../middleware/featureFlag')
const upload = require('./upload/multer')

/**
 * Models Routes
 */

// Upload (guest or authenticated)
router.post('/upload', requireFeature('models'), optionalAuth, upload.multiple, modelsController.upload.bind(modelsController))

// Upload from URL
router.post('/upload-url', requireFeature('models'), optionalAuth, modelsController.uploadUrl.bind(modelsController))

// Get model by ID (owner or admin)
router.get('/:id', requireFeature('models'), optionalAuth, modelsController.getById.bind(modelsController))

// Delete model (owner or admin)
router.delete('/:id', requireFeature('models'), authenticate, modelsController.delete.bind(modelsController))

module.exports = router
