const dbConnection = require('../database/connection')
const { forbidden } = require('../utils/response')
const logger = require('../utils/logger')

/**
 * Feature Flag Middleware
 * Проверяет, включен ли модуль перед выполнением запроса
 */

/**
 * Require feature to be enabled
 */
function requireFeature(featureKey) {
  return async (req, res, next) => {
    try {
      const db = dbConnection.getDb()

      const flag = db.prepare('SELECT enabled FROM feature_flags WHERE key = ?').get(featureKey)

      if (!flag || !flag.enabled) {
        logger.warn('Feature disabled', { feature: featureKey, url: req.originalUrl })
        return forbidden(res, `Feature "${featureKey}" is disabled`, { feature: featureKey })
      }

      next()
    } catch (error) {
      logger.error('Feature flag check error', { error: error.message, feature: featureKey })
      next(error)
    }
  }
}

/**
 * Get all feature flags (cached for performance)
 */
let featuresCache = null
let cacheTime = 0
const CACHE_TTL = 60000 // 1 minute

function getFeatures() {
  const now = Date.now()

  if (featuresCache && now - cacheTime < CACHE_TTL) {
    return featuresCache
  }

  const db = dbConnection.getDb()
  const flags = db.prepare('SELECT key, enabled FROM feature_flags').all()

  featuresCache = flags.reduce((acc, flag) => {
    acc[flag.key] = flag.enabled === 1
    return acc
  }, {})

  cacheTime = now

  return featuresCache
}

/**
 * Invalidate cache (call when flags are updated)
 */
function invalidateCache() {
  featuresCache = null
  cacheTime = 0
}

module.exports = {
  requireFeature,
  getFeatures,
  invalidateCache,
}
