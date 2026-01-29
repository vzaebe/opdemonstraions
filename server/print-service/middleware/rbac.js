const { forbidden } = require('../utils/response')
const constants = require('../config/constants')

/**
 * Role-Based Access Control Middleware
 */

/**
 * Require specific role(s)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return forbidden(res, 'Authentication required')
    }

    if (!allowedRoles.includes(req.user.role)) {
      return forbidden(res, 'Insufficient permissions', {
        required: allowedRoles,
        current: req.user.role,
      })
    }

    next()
  }
}

/**
 * Require admin role
 */
function requireAdmin(req, res, next) {
  return requireRole(constants.ROLES.ADMIN, constants.ROLES.SUPERADMIN)(req, res, next)
}

/**
 * Require superadmin role
 */
function requireSuperadmin(req, res, next) {
  return requireRole(constants.ROLES.SUPERADMIN)(req, res, next)
}

module.exports = {
  requireRole,
  requireAdmin,
  requireSuperadmin,
}
