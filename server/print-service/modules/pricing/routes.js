const express = require('express')
const router = express.Router()
const pricingController = require('./controller')
const { optionalAuth } = require('../../middleware/auth')
const { requireFeature } = require('../../middleware/featureFlag')

/**
 * Pricing Routes
 */

// Get materials
router.get('/materials', requireFeature('pricing'), pricingController.getMaterials.bind(pricingController))

// Get profiles
router.get('/profiles', requireFeature('pricing'), pricingController.getProfiles.bind(pricingController))

// Calculate quote
router.post('/quote', requireFeature('pricing'), optionalAuth, pricingController.quote.bind(pricingController))

module.exports = router
