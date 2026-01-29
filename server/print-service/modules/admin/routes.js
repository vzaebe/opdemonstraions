const express = require('express')
const router = express.Router()
const adminController = require('./controller')
const { authenticate } = require('../../middleware/auth')
const { requireAdmin } = require('../../middleware/rbac')

/**
 * Admin Routes (все требуют admin роль)
 */

// Apply auth & admin check to all routes
router.use(authenticate, requireAdmin)

// Dashboard & Stats
router.get('/dashboard', adminController.getDashboard.bind(adminController))

// Orders Management
router.get('/orders', adminController.getOrders.bind(adminController))
router.put('/orders/:id', adminController.updateOrder.bind(adminController))

// Materials CRUD
router.get('/materials', adminController.getMaterials.bind(adminController))
router.post('/materials', adminController.createMaterial.bind(adminController))
router.put('/materials/:id', adminController.updateMaterial.bind(adminController))
router.delete('/materials/:id', adminController.deleteMaterial.bind(adminController))

// Printers CRUD
router.get('/printers', adminController.getPrinters.bind(adminController))
router.post('/printers', adminController.createPrinter.bind(adminController))
// router.put('/printers/:id', adminController.updatePrinter.bind(adminController))
// router.delete('/printers/:id', adminController.deletePrinter.bind(adminController))

// Pricing Rules
router.get('/pricing-rules', adminController.getPricingRules.bind(adminController))
router.put('/pricing-rules', adminController.updatePricingRules.bind(adminController))

// Feature Flags
router.put('/feature-flags/:key', adminController.updateFeatureFlag.bind(adminController))

module.exports = router
