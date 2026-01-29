const express = require('express')
const router = express.Router()
const usersController = require('./controller')
const { authenticate } = require('../../../middleware/auth')
const { requireAdmin } = require('../../../middleware/rbac')

/**
 * Users Routes
 */

// Get current user (authenticated)
router.get('/me', authenticate, usersController.getById.bind(usersController))

// Get user by ID (own or admin)
router.get('/:id', authenticate, usersController.getById.bind(usersController))

// Update user (own or admin)
router.put('/:id', authenticate, usersController.update.bind(usersController))

// List all users (admin only)
router.get('/', authenticate, requireAdmin, usersController.getAll.bind(usersController))

// Delete user (admin only)
router.delete('/:id', authenticate, requireAdmin, usersController.delete.bind(usersController))

module.exports = router
