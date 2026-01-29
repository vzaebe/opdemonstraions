/**
 * Slicing Routes
 */

const express = require('express')
const router = express.Router()
const slicingController = require('./controller')
const { optionalAuth } = require('../../middleware/auth')
const { requireFeature } = require('../../middleware/featureFlag')

// All slicing routes require the feature to be enabled
router.use(requireFeature('slicing'))

// Create slicing job
router.post('/jobs', optionalAuth, slicingController.createJob.bind(slicingController))

// Get job status
router.get('/jobs/:id', optionalAuth, slicingController.getJob.bind(slicingController))

// Get statistics
router.get('/stats', slicingController.getStats.bind(slicingController))

// Get slicer status
router.get('/status', slicingController.getStatus.bind(slicingController))

module.exports = router
