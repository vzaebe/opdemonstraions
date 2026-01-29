// Global error handler for uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

console.log('Loading modules...')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
console.log('Loading config...')
const config = require('./config')
console.log('Loading logger...')
const logger = require('./utils/logger')
console.log('Loading database connection...')
const dbConnection = require('./database/connection')
console.log('Loading error handler...')
const errorHandler = require('./middleware/errorHandler')
console.log('All modules loaded')

// Import routes
const authRoutes = require('./modules/core/auth/routes')
const usersRoutes = require('./modules/core/users/routes')
const featureFlagsRoutes = require('./modules/core/feature-flags/routes')
const modelsRoutes = require('./modules/models/routes')
const pricingRoutes = require('./modules/pricing/routes')
const ordersRoutes = require('./modules/orders/routes')
const queueRoutes = require('./modules/queue/routes')
const shippingRoutes = require('./modules/shipping/routes')
const adminRoutes = require('./modules/admin/routes')

const app = express()

// Middleware
try {
  console.log('Setting up middleware...')
  app.use(helmet())
  app.use(cors(config.cors))
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(cookieParser())
  console.log('Middleware setup complete')
} catch (error) {
  console.error('Middleware setup error:', error)
  throw error
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api', limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
try {
  console.log('Setting up routes...')
  const apiRouter = express.Router()

  apiRouter.use('/auth', authRoutes)
  apiRouter.use('/users', usersRoutes)
  apiRouter.use('/feature-flags', featureFlagsRoutes)
  apiRouter.use('/models', modelsRoutes)
  apiRouter.use('/materials', pricingRoutes) // Sub-routes handled internally
  apiRouter.use('/pricing', pricingRoutes)
  apiRouter.use('/orders', ordersRoutes)
  apiRouter.use('/queue', queueRoutes)
  apiRouter.use('/shipping', shippingRoutes)
  apiRouter.use('/admin', adminRoutes)

  app.use(config.server.apiBasePath, apiRouter)
  console.log('Routes setup complete')
} catch (error) {
  console.error('Routes setup error:', error)
  throw error
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl })
})

// Error handler (must be last)
app.use(errorHandler)

// Start server
async function start() {
  try {
    console.log('Starting server...')
    console.log('Initializing database...')
    // Initialize database
    await dbConnection.init()
    console.log('Database initialized')

    // Start Express server
    console.log(`Starting Express server on port ${config.server.port}...`)
    app.listen(config.server.port, () => {
      logger.info(`🚀 Print Service API running on port ${config.server.port}`)
      logger.info(`📁 Environment: ${config.env}`)
      logger.info(`🔗 API Base: ${config.server.apiBasePath}`)
      console.log(`✅ Server is running on http://localhost:${config.server.port}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...')
  dbConnection.close()
  process.exit(0)
})

process.on('SIGTERM', () => {
  logger.info('Shutting down gracefully...')
  dbConnection.close()
  process.exit(0)
})

start()

module.exports = app
