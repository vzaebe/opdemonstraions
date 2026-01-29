const express = require('express')
const router = express.Router()
const ordersController = require('./controller')
const { authenticate, optionalAuth } = require('../../middleware/auth')
const { requireFeature } = require('../../middleware/featureFlag')

/**
 * Orders Routes
 */

// Create order (guest or authenticated)
router.post('/create', requireFeature('orders'), optionalAuth, ordersController.create.bind(ordersController))

// Get my orders (authenticated only)
router.get('/', requireFeature('orders'), authenticate, ordersController.getMyOrders.bind(ordersController))

// Get order by ID (owner or admin)
router.get('/:id', requireFeature('orders'), optionalAuth, ordersController.getById.bind(ordersController))

// Get order messages
router.get('/:id/messages', requireFeature('orders'), authenticate, ordersController.getMessages.bind(ordersController))

// Add message to order
router.post('/:id/messages', requireFeature('orders'), authenticate, ordersController.addMessage.bind(ordersController))

module.exports = router
