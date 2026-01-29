/**
 * Slicing Controller
 * Handles HTTP requests for slicing operations
 */

const slicingService = require('./service')
const { success, created } = require('../../utils/response')

class SlicingController {
  /**
   * Create slicing job
   * POST /slicing/jobs
   */
  async createJob(req, res, next) {
    try {
      const { model_id, profile_id, material_id, infill, supports } = req.body

      if (!model_id || !profile_id) {
        return res.status(400).json({ error: 'model_id and profile_id are required' })
      }

      const job = await slicingService.createJob({
        modelId: model_id,
        profileId: profile_id,
        materialId: material_id,
        infill: infill || 20,
        supports: supports || false,
      })

      res.status(201).json(created(job))
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get job status
   * GET /slicing/jobs/:id
   */
  async getJob(req, res, next) {
    try {
      const job = slicingService.getJob(parseInt(req.params.id))
      res.json(success(job))
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get slicing statistics
   * GET /slicing/stats
   */
  async getStats(req, res, next) {
    try {
      const stats = slicingService.getStats()
      res.json(success(stats))
    } catch (error) {
      next(error)
    }
  }

  /**
   * Check slicer status
   * GET /slicing/status
   */
  async getStatus(req, res, next) {
    try {
      const status = await slicingService.checkSlicerStatus()
      res.json(success(status))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new SlicingController()
