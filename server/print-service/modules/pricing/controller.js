const pricingCalculator = require('./calculator')
const dbConnection = require('../../database/connection')
const { created, success } = require('../../utils/response')

/**
 * Pricing Controller
 */
class PricingController {
  /**
   * GET /materials
   */
  async getMaterials(req, res, next) {
    try {
      const db = dbConnection.getDb()
      const { type, active_only = 'true' } = req.query

      let query = 'SELECT * FROM materials WHERE 1=1'
      const params = []

      if (type) {
        query += ' AND type = ?'
        params.push(type)
      }

      if (active_only === 'true') {
        query += ' AND is_active = 1'
      }

      query += ' ORDER BY name'

      const materials = db.prepare(query).all(...params)

      // Parse JSON fields
      materials.forEach((m) => {
        m.available_colors = m.available_colors_json ? JSON.parse(m.available_colors_json) : []
        m.slicer_settings = m.slicer_settings_json ? JSON.parse(m.slicer_settings_json) : {}
        delete m.available_colors_json
        delete m.slicer_settings_json
      })

      return success(res, { materials })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /profiles
   */
  async getProfiles(req, res, next) {
    try {
      const db = dbConnection.getDb()

      const profiles = db.prepare('SELECT * FROM print_profiles ORDER BY time_multiplier').all()

      return success(res, { profiles })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /pricing/quote
   * Instant estimate
   */
  async quote(req, res, next) {
    try {
      const { model_id, material_id, profile_id, quantity = 1, params = {} } = req.body

      if (!model_id || !material_id || !profile_id) {
        return res.status(400).json({ error: 'model_id, material_id, and profile_id are required' })
      }

      const estimate = await pricingCalculator.calculateInstant({
        modelId: model_id,
        materialId: material_id,
        profileId: profile_id,
        quantity,
        params,
      })

      // Save quote (optional)
      const db = dbConnection.getDb()
      const userId = req.user ? req.user.id : null

      const quoteResult = db
        .prepare(
          `
        INSERT INTO quotes (user_id, model_id, material_id, profile_id, quantity, params_json, instant_result_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(userId, model_id, material_id, profile_id, quantity, JSON.stringify(params), JSON.stringify(estimate))

      const quoteId = quoteResult.lastInsertRowid

      return success(res, {
        quote_id: quoteId,
        instant_estimate: estimate,
        accurate_available: false, // TODO: check if slicing feature is enabled
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new PricingController()
