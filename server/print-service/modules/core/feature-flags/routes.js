const express = require('express')
const router = express.Router()
const featureFlagsController = require('./controller')

/**
 * Feature Flags Routes
 */

// Public route
router.get('/', featureFlagsController.getAll.bind(featureFlagsController))

module.exports = router
