const dbConnection = require('../../database/connection')
const ordersService = require('../orders/service')
const queueService = require('../queue/service')
const { invalidateCache } = require('../../middleware/featureFlag')
const { success, created } = require('../../utils/response')
const logger = require('../../utils/logger')

/**
 * Admin Controller
 * Централизованное управление всеми настройками
 */
class AdminController {
  // ========================================
  // DASHBOARD & STATS
  // ========================================

  /**
   * GET /admin/dashboard
   */
  async getDashboard(req, res, next) {
    try {
      const db = dbConnection.getDb()

      // KPIs
      const today = new Date().toISOString().split('T')[0]
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      // Orders stats
      const { orders_today } = db.prepare('SELECT COUNT(*) as orders_today FROM orders WHERE DATE(created_at) = ?').get(today)
      const { orders_week } = db.prepare('SELECT COUNT(*) as orders_week FROM orders WHERE DATE(created_at) >= ?').get(weekAgo)
      const { revenue_week } = db.prepare('SELECT COALESCE(SUM(total), 0) as revenue_week FROM orders WHERE DATE(created_at) >= ? AND status != "cancelled"').get(weekAgo)
      const { avg_order } = db.prepare('SELECT COALESCE(AVG(total), 0) as avg_order FROM orders WHERE DATE(created_at) >= ?').get(weekAgo)

      // Queue stats
      const { queue_pending } = db.prepare('SELECT COUNT(*) as queue_pending FROM production_queue WHERE status IN ("queued", "assigned")').get()
      const { queue_printing } = db.prepare('SELECT COUNT(*) as queue_printing FROM production_queue WHERE status = "printing"').get()

      // Materials usage (top 5)
      const topMaterials = db
        .prepare(
          `
        SELECT m.name, COUNT(oi.id) as usage_count
        FROM order_items oi
        JOIN materials m ON oi.material_id = m.id
        JOIN orders o ON oi.order_id = o.id
        WHERE DATE(o.created_at) >= ?
        GROUP BY m.id
        ORDER BY usage_count DESC
        LIMIT 5
      `
        )
        .all(weekAgo)

      return success(res, {
        kpis: {
          orders_today,
          orders_week,
          revenue_week: parseFloat(revenue_week.toFixed(2)),
          avg_order: parseFloat(avg_order.toFixed(2)),
          queue_pending,
          queue_printing,
        },
        top_materials: topMaterials,
      })
    } catch (error) {
      next(error)
    }
  }

  // ========================================
  // ORDERS MANAGEMENT
  // ========================================

  /**
   * GET /admin/orders
   */
  async getOrders(req, res, next) {
    try {
      const db = dbConnection.getDb()
      const { status, search, date_from, date_to, limit = 50, offset = 0 } = req.query

      let query = 'SELECT * FROM orders WHERE 1=1'
      const params = []

      if (status) {
        query += ' AND status = ?'
        params.push(status)
      }

      if (search) {
        query += ' AND (order_number LIKE ? OR email LIKE ? OR name LIKE ?)'
        params.push(`%${search}%`, `%${search}%`, `%${search}%`)
      }

      if (date_from) {
        query += ' AND DATE(created_at) >= ?'
        params.push(date_from)
      }

      if (date_to) {
        query += ' AND DATE(created_at) <= ?'
        params.push(date_to)
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
      params.push(parseInt(limit), parseInt(offset))

      const orders = db.prepare(query).all(...params)

      // Count total
      let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE 1=1'
      const countParams = []
      if (status) {
        countQuery += ' AND status = ?'
        countParams.push(status)
      }
      if (search) {
        countQuery += ' AND (order_number LIKE ? OR email LIKE ? OR name LIKE ?)'
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
      }
      if (date_from) {
        countQuery += ' AND DATE(created_at) >= ?'
        countParams.push(date_from)
      }
      if (date_to) {
        countQuery += ' AND DATE(created_at) <= ?'
        countParams.push(date_to)
      }
      const { total } = db.prepare(countQuery).get(...countParams)

      return success(res, { orders, total })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /admin/orders/:id
   */
  async updateOrder(req, res, next) {
    try {
      const { id } = req.params
      const { status, tracking_number, internal_notes, manual_price } = req.body

      const db = dbConnection.getDb()
      const updates = []
      const params = []

      if (status !== undefined) {
        // Use ordersService to update status (handles history)
        await ordersService.updateStatus(id, status, req.body.comment, req.user.id)
      }

      if (tracking_number !== undefined) {
        updates.push('tracking_number = ?')
        params.push(tracking_number)
      }

      if (internal_notes !== undefined) {
        updates.push('internal_notes = ?')
        params.push(internal_notes)
      }

      if (manual_price !== undefined) {
        updates.push('total = ?')
        params.push(manual_price)
      }

      if (updates.length > 0) {
        updates.push('updated_at = CURRENT_TIMESTAMP')
        params.push(id)
        db.prepare(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`).run(...params)
      }

      const updated = ordersService.getById(id)

      logger.info('Order updated by admin', { orderId: id, adminId: req.user.id })

      return success(res, updated, 'Order updated')
    } catch (error) {
      next(error)
    }
  }

  // ========================================
  // MATERIALS CRUD
  // ========================================

  /**
   * GET /admin/materials
   */
  async getMaterials(req, res, next) {
    try {
      const db = dbConnection.getDb()
      const materials = db.prepare('SELECT * FROM materials ORDER BY name').all()

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
   * POST /admin/materials
   */
  async createMaterial(req, res, next) {
    try {
      const { name, type, density, price_per_gram, available_colors, slicer_settings } = req.body

      if (!name || !type || !density || !price_per_gram) {
        return res.status(400).json({ error: 'name, type, density, and price_per_gram are required' })
      }

      const db = dbConnection.getDb()

      const result = db
        .prepare(
          `
        INSERT INTO materials (name, type, density, price_per_gram, available_colors_json, slicer_settings_json)
        VALUES (?, ?, ?, ?, ?, ?)
      `
        )
        .run(name, type, density, price_per_gram, JSON.stringify(available_colors || []), JSON.stringify(slicer_settings || {}))

      const material = db.prepare('SELECT * FROM materials WHERE id = ?').get(result.lastInsertRowid)

      logger.info('Material created', { materialId: material.id, name, adminId: req.user.id })

      return created(res, material, 'Material created')
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /admin/materials/:id
   */
  async updateMaterial(req, res, next) {
    try {
      const { id } = req.params
      const { name, type, density, price_per_gram, available_colors, slicer_settings, is_active } = req.body

      const db = dbConnection.getDb()
      const updates = []
      const params = []

      if (name) {
        updates.push('name = ?')
        params.push(name)
      }
      if (type) {
        updates.push('type = ?')
        params.push(type)
      }
      if (density !== undefined) {
        updates.push('density = ?')
        params.push(density)
      }
      if (price_per_gram !== undefined) {
        updates.push('price_per_gram = ?')
        params.push(price_per_gram)
      }
      if (available_colors) {
        updates.push('available_colors_json = ?')
        params.push(JSON.stringify(available_colors))
      }
      if (slicer_settings) {
        updates.push('slicer_settings_json = ?')
        params.push(JSON.stringify(slicer_settings))
      }
      if (is_active !== undefined) {
        updates.push('is_active = ?')
        params.push(is_active ? 1 : 0)
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' })
      }

      updates.push('updated_at = CURRENT_TIMESTAMP')
      params.push(id)

      db.prepare(`UPDATE materials SET ${updates.join(', ')} WHERE id = ?`).run(...params)

      const material = db.prepare('SELECT * FROM materials WHERE id = ?').get(id)

      logger.info('Material updated', { materialId: id, adminId: req.user.id })

      return success(res, material, 'Material updated')
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /admin/materials/:id
   */
  async deleteMaterial(req, res, next) {
    try {
      const { id } = req.params
      const db = dbConnection.getDb()

      // Check if used in orders
      const { count } = db.prepare('SELECT COUNT(*) as count FROM order_items WHERE material_id = ?').get(id)
      if (count > 0) {
        return res.status(400).json({ error: 'Cannot delete material that is used in orders. Deactivate instead.' })
      }

      db.prepare('DELETE FROM materials WHERE id = ?').run(id)

      logger.info('Material deleted', { materialId: id, adminId: req.user.id })

      return success(res, null, 'Material deleted')
    } catch (error) {
      next(error)
    }
  }

  // ========================================
  // PRINTERS CRUD (similar to materials)
  // ========================================

  async getPrinters(req, res, next) {
    try {
      const db = dbConnection.getDb()
      const printers = db.prepare('SELECT * FROM printers ORDER BY name').all()

      printers.forEach((p) => {
        p.supported_materials = p.supported_materials_json ? JSON.parse(p.supported_materials_json) : []
        p.metadata = p.metadata_json ? JSON.parse(p.metadata_json) : {}
        delete p.supported_materials_json
        delete p.metadata_json
      })

      return success(res, { printers })
    } catch (error) {
      next(error)
    }
  }

  async createPrinter(req, res, next) {
    try {
      const { name, type, bed_x, bed_y, bed_z, nozzle_size, price_per_hour, max_speed, supported_materials, status, metadata } = req.body

      if (!name || !type || !bed_x || !bed_y || !bed_z || !price_per_hour) {
        return res.status(400).json({ error: 'Required fields missing' })
      }

      const db = dbConnection.getDb()

      const result = db
        .prepare(
          `
        INSERT INTO printers (name, type, bed_x, bed_y, bed_z, nozzle_size, price_per_hour, max_speed, supported_materials_json, status, metadata_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          name,
          type,
          bed_x,
          bed_y,
          bed_z,
          nozzle_size || null,
          price_per_hour,
          max_speed || null,
          JSON.stringify(supported_materials || []),
          status || 'available',
          JSON.stringify(metadata || {})
        )

      const printer = db.prepare('SELECT * FROM printers WHERE id = ?').get(result.lastInsertRowid)

      logger.info('Printer created', { printerId: printer.id, name, adminId: req.user.id })

      return created(res, printer, 'Printer created')
    } catch (error) {
      next(error)
    }
  }

  // ... PUT/DELETE для printers аналогично materials

  // ========================================
  // PRICING RULES
  // ========================================

  async getPricingRules(req, res, next) {
    try {
      const db = dbConnection.getDb()
      const rules = db.prepare('SELECT * FROM pricing_rules ORDER BY id DESC LIMIT 1').get()

      if (!rules) {
        return res.status(404).json({ error: 'Pricing rules not found' })
      }

      rules.bulk_discount_rules = rules.bulk_discount_rules_json ? JSON.parse(rules.bulk_discount_rules_json) : []
      rules.postprocess_options = rules.postprocess_options_json ? JSON.parse(rules.postprocess_options_json) : []
      delete rules.bulk_discount_rules_json
      delete rules.postprocess_options_json

      return success(res, rules)
    } catch (error) {
      next(error)
    }
  }

  async updatePricingRules(req, res, next) {
    try {
      const { setup_fee, labor_rate_per_hour, labor_fixed, margin_percent, min_order_price, bulk_discount_rules, postprocess_options } = req.body

      const db = dbConnection.getDb()

      // Get current rules
      const current = db.prepare('SELECT * FROM pricing_rules ORDER BY id DESC LIMIT 1').get()

      if (!current) {
        // Create if not exists
        db.prepare(
          `
          INSERT INTO pricing_rules (setup_fee, labor_rate_per_hour, labor_fixed, margin_percent, min_order_price, bulk_discount_rules_json, postprocess_options_json)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `
        ).run(
          setup_fee || 0,
          labor_rate_per_hour || 0,
          labor_fixed || 0,
          margin_percent || 20,
          min_order_price || 500,
          JSON.stringify(bulk_discount_rules || []),
          JSON.stringify(postprocess_options || [])
        )
      } else {
        // Update
        const updates = []
        const params = []

        if (setup_fee !== undefined) {
          updates.push('setup_fee = ?')
          params.push(setup_fee)
        }
        if (labor_rate_per_hour !== undefined) {
          updates.push('labor_rate_per_hour = ?')
          params.push(labor_rate_per_hour)
        }
        if (labor_fixed !== undefined) {
          updates.push('labor_fixed = ?')
          params.push(labor_fixed)
        }
        if (margin_percent !== undefined) {
          updates.push('margin_percent = ?')
          params.push(margin_percent)
        }
        if (min_order_price !== undefined) {
          updates.push('min_order_price = ?')
          params.push(min_order_price)
        }
        if (bulk_discount_rules) {
          updates.push('bulk_discount_rules_json = ?')
          params.push(JSON.stringify(bulk_discount_rules))
        }
        if (postprocess_options) {
          updates.push('postprocess_options_json = ?')
          params.push(JSON.stringify(postprocess_options))
        }

        updates.push('updated_at = CURRENT_TIMESTAMP')
        params.push(current.id)

        db.prepare(`UPDATE pricing_rules SET ${updates.join(', ')} WHERE id = ?`).run(...params)
      }

      const updated = db.prepare('SELECT * FROM pricing_rules ORDER BY id DESC LIMIT 1').get()

      logger.info('Pricing rules updated', { adminId: req.user.id })

      return success(res, updated, 'Pricing rules updated')
    } catch (error) {
      next(error)
    }
  }

  // ========================================
  // FEATURE FLAGS
  // ========================================

  async updateFeatureFlag(req, res, next) {
    try {
      const { key } = req.params
      const { enabled } = req.body

      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ error: 'enabled must be a boolean' })
      }

      const db = dbConnection.getDb()

      db.prepare('UPDATE feature_flags SET enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?').run(enabled ? 1 : 0, key)

      invalidateCache()

      const updated = db.prepare('SELECT * FROM feature_flags WHERE key = ?').get(key)

      logger.info('Feature flag updated', { key, enabled, adminId: req.user.id })

      return success(res, updated, 'Feature flag updated')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AdminController()
