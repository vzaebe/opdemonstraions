const express = require('express')
const router = express.Router()

/**
 * Shipping Routes
 * TODO: Implement Russian Post API integration
 */

// Get shipping methods
router.get('/methods', (req, res) => {
  // TODO: Implement
  res.status(501).json({ error: 'Not implemented yet' })
})

module.exports = router
