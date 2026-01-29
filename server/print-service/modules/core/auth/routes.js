const express = require('express')
const router = express.Router()
const authController = require('./controller')
const { authenticate } = require('../../../middleware/auth')

/**
 * Auth Routes
 */

// Public routes
router.post('/register', authController.register.bind(authController))
router.post('/login', authController.login.bind(authController))
router.post('/guest', authController.createGuest.bind(authController))
router.post('/logout', authController.logout.bind(authController))

// Protected routes
router.get('/me', authenticate, authController.me.bind(authController))

module.exports = router
