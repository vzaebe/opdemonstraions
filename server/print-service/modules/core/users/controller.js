const dbConnection = require('../../../database/connection')
const { success, created } = require('../../../utils/response')
const logger = require('../../../utils/logger')

/**
 * Users Controller
 */
class UsersController {
  /**
   * GET /users (Admin only)
   */
  async getAll(req, res, next) {
    try {
      const db = dbConnection.getDb()
      const { role, search, limit = 20, offset = 0 } = req.query

      let query = 'SELECT id, email, name, phone, role, created_at FROM users WHERE 1=1'
      const params = []

      if (role) {
        query += ' AND role = ?'
        params.push(role)
      }

      if (search) {
        query += ' AND (email LIKE ? OR name LIKE ?)'
        params.push(`%${search}%`, `%${search}%`)
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
      params.push(parseInt(limit), parseInt(offset))

      const users = db.prepare(query).all(...params)

      // Count total
      let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1'
      const countParams = []

      if (role) {
        countQuery += ' AND role = ?'
        countParams.push(role)
      }

      if (search) {
        countQuery += ' AND (email LIKE ? OR name LIKE ?)'
        countParams.push(`%${search}%`, `%${search}%`)
      }

      const { total } = db.prepare(countQuery).get(...countParams)

      return success(res, { users, total })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /users/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params
      const db = dbConnection.getDb()

      // Check permissions: user can only get their own data, admin can get anyone
      if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      const user = db.prepare('SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?').get(id)

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return success(res, user)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /users/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params
      const { name, phone } = req.body
      const db = dbConnection.getDb()

      // Check permissions
      if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      const updates = []
      const params = []

      if (name !== undefined) {
        updates.push('name = ?')
        params.push(name)
      }

      if (phone !== undefined) {
        updates.push('phone = ?')
        params.push(phone)
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' })
      }

      updates.push('updated_at = CURRENT_TIMESTAMP')
      params.push(id)

      const result = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params)

      if (result.changes === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      const updated = db.prepare('SELECT id, email, name, phone, role, created_at, updated_at FROM users WHERE id = ?').get(id)

      logger.info('User updated', { userId: id, updatedBy: req.user.id })

      return success(res, updated, 'User updated')
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /users/:id (Admin only)
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params
      const db = dbConnection.getDb()

      // Prevent deleting self
      if (req.user.id === parseInt(id)) {
        return res.status(400).json({ error: 'Cannot delete yourself' })
      }

      const result = db.prepare('DELETE FROM users WHERE id = ?').run(id)

      if (result.changes === 0) {
        return res.status(404).json({ error: 'User not found' })
      }

      logger.info('User deleted', { userId: id, deletedBy: req.user.id })

      return success(res, null, 'User deleted')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UsersController()
