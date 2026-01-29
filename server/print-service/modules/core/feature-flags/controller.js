const dbConnection = require('../../../database/connection')
const { success } = require('../../../utils/response')
const { invalidateCache } = require('../../../middleware/featureFlag')

/**
 * Feature Flags Controller
 */
class FeatureFlagsController {
  /**
   * GET /feature-flags
   * Публичный endpoint для получения всех feature flags
   */
  async getAll(req, res, next) {
    try {
      const db = dbConnection.getDb()

      const flags = db.prepare('SELECT key, enabled FROM feature_flags').all()

      const result = flags.reduce((acc, flag) => {
        acc[flag.key] = flag.enabled === 1
        return acc
      }, {})

      return success(res, { flags: result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /admin/feature-flags
   * Полная информация (только для админов)
   */
  async getAllAdmin(req, res, next) {
    try {
      const db = dbConnection.getDb()

      const flags = db.prepare('SELECT * FROM feature_flags ORDER BY key').all()

      return success(res, { flags })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /admin/feature-flags/:key
   * Обновить feature flag
   */
  async update(req, res, next) {
    try {
      const { key } = req.params
      const { enabled } = req.body

      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ error: 'enabled must be a boolean' })
      }

      const db = dbConnection.getDb()

      const result = db
        .prepare(
          `
        UPDATE feature_flags
        SET enabled = ?, updated_at = CURRENT_TIMESTAMP
        WHERE key = ?
      `
        )
        .run(enabled ? 1 : 0, key)

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Feature flag not found' })
      }

      // Invalidate cache
      invalidateCache()

      const updated = db.prepare('SELECT * FROM feature_flags WHERE key = ?').get(key)

      return success(res, updated, 'Feature flag updated')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new FeatureFlagsController()
