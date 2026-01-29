const modelsService = require('./service')
const { created, success } = require('../../utils/response')
const logger = require('../../utils/logger')

/**
 * Models Controller
 */
class ModelsController {
  /**
   * POST /models/upload
   * Upload single or multiple files
   */
  async upload(req, res, next) {
    try {
      const files = req.files || [req.file]
      const userId = req.user ? req.user.id : null

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' })
      }

      // Process all files
      const models = []
      for (const file of files) {
        try {
          const model = await modelsService.createFromFile(file, userId)
          models.push(model)
        } catch (error) {
          logger.error('Error processing file', { filename: file.originalname, error: error.message })
          // Continue with other files
          models.push({
            error: true,
            filename: file.originalname,
            message: error.message,
          })
        }
      }

      return created(res, { models }, 'Models uploaded')
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /models/upload-url
   * Upload from URL
   */
  async uploadUrl(req, res, next) {
    try {
      const { url } = req.body
      const userId = req.user ? req.user.id : null

      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      // TODO: Implement URL download
      // 1. Download file from URL
      // 2. Save temporarily
      // 3. Process like uploaded file
      // 4. Clean up temp file

      return res.status(501).json({ error: 'URL upload not implemented yet' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /models/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params

      const model = modelsService.getById(id)

      // Check access (only owner or admin)
      if (
        req.user &&
        model.user_id &&
        model.user_id !== req.user.id &&
        req.user.role !== 'admin' &&
        req.user.role !== 'superadmin'
      ) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      return success(res, model)
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /models/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params
      const userId = req.user ? req.user.id : null

      // Admin can delete any, user can delete own
      const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')

      await modelsService.delete(id, isAdmin ? null : userId)

      return success(res, null, 'Model deleted')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ModelsController()
