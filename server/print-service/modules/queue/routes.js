const express = require('express')
const router = express.Router()
const queueController = require('./controller')
const { authenticate } = require('../../middleware/auth')
const { requireAdmin } = require('../../middleware/rbac')
const { requireFeature } = require('../../middleware/featureFlag')

/**
 * Queue Routes (Admin only)
 */

// Get all queue items
router.get('/', requireFeature('queue'), authenticate, requireAdmin, queueController.getAll.bind(queueController))

// Get queue item by ID
router.get('/:id', requireFeature('queue'), authenticate, requireAdmin, queueController.getById.bind(queueController))

// Update queue item
router.put('/:id', requireFeature('queue'), authenticate, requireAdmin, queueController.update.bind(queueController))

// Get queue item history
router.get('/:id/history', requireFeature('queue'), authenticate, requireAdmin, queueController.getHistory.bind(queueController))

module.exports = router
