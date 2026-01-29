const jwt = require('jsonwebtoken')
const config = require('../config')
const { unauthorized } = require('../utils/response')
const dbConnection = require('../database/connection')

/**
 * Middleware to verify JWT token and attach user to request
 */
function authenticate(req, res, next) {
  const token = extractToken(req)

  if (!token) {
    return unauthorized(res, 'Authentication required')
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded // { id, email, role }

    // Optional: Check if user still exists in DB (for revoked tokens)
    const db = dbConnection.getDb()
    const user = db.prepare('SELECT id, email, role FROM users WHERE id = ?').get(decoded.id)

    if (!user) {
      return unauthorized(res, 'Invalid token')
    }

    req.user = user
    next()
  } catch (error) {
    return unauthorized(res, 'Invalid or expired token')
  }
}

/**
 * Optional authentication (guest allowed)
 */
function optionalAuth(req, res, next) {
  const token = extractToken(req)

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded
    next()
  } catch (error) {
    req.user = null
    next()
  }
}

/**
 * Extract token from Authorization header or cookie
 */
function extractToken(req) {
  // From Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.slice(7)
  }

  // From cookie
  if (req.cookies && req.cookies.token) {
    return req.cookies.token
  }

  return null
}

module.exports = {
  authenticate,
  optionalAuth,
}
