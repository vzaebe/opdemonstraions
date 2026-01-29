const jwt = require('jsonwebtoken')
const dbConnection = require('../../../database/connection')
const { hashPassword, comparePassword } = require('../../../utils/hash')
const config = require('../../../config')
const logger = require('../../../utils/logger')
const { badRequest, unauthorized, created, success } = require('../../../utils/response')

/**
 * Auth Service
 */
class AuthService {
  /**
   * Register new user
   */
  async register({ email, password, name, phone }) {
    const db = dbConnection.getDb()

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existingUser) {
      throw { statusCode: 400, message: 'Email already registered' }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Insert user
    const result = db
      .prepare(
        `
      INSERT INTO users (email, password_hash, name, phone, role)
      VALUES (?, ?, ?, ?, 'user')
    `
      )
      .run(email, passwordHash, name || null, phone || null)

    const userId = result.lastInsertRowid

    // Get user
    const user = db.prepare('SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?').get(userId)

    // Generate token
    const token = this.generateToken(user)

    logger.info('User registered', { userId, email })

    return { user, token }
  }

  /**
   * Login user
   */
  async login({ email, password }) {
    const db = dbConnection.getDb()

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password' }
    }

    // Check password
    const isValid = await comparePassword(password, user.password_hash)
    if (!isValid) {
      throw { statusCode: 401, message: 'Invalid email or password' }
    }

    // Generate token
    const token = this.generateToken(user)

    logger.info('User logged in', { userId: user.id, email })

    // Remove password_hash from response
    delete user.password_hash

    return { user, token }
  }

  /**
   * Create guest session
   */
  async createGuest(email = null) {
    const db = dbConnection.getDb()

    // Generate guest email if not provided
    const guestEmail = email || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@temp.com`

    // Insert guest user
    const result = db
      .prepare(
        `
      INSERT INTO users (email, password_hash, role)
      VALUES (?, NULL, 'guest')
    `
      )
      .run(guestEmail)

    const userId = result.lastInsertRowid

    // Get user
    const user = db.prepare('SELECT id, email, role, created_at FROM users WHERE id = ?').get(userId)

    // Generate token
    const token = this.generateToken(user)

    logger.info('Guest user created', { userId, email: guestEmail })

    return { user, token }
  }

  /**
   * Get current user by token
   */
  async me(userId) {
    const db = dbConnection.getDb()

    const user = db.prepare('SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?').get(userId)

    if (!user) {
      throw { statusCode: 404, message: 'User not found' }
    }

    return user
  }

  /**
   * Generate JWT token
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
  }

  /**
   * Verify token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret)
    } catch (error) {
      throw { statusCode: 401, message: 'Invalid or expired token' }
    }
  }
}

module.exports = new AuthService()
