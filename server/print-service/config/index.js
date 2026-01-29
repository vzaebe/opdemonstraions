require('dotenv').config()

const path = require('path')

const config = {
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  server: {
    port: parseInt(process.env.PORT, 10) || 3100,
    apiBasePath: process.env.API_BASE_PATH || '/api/v1',
  },

  database: {
    path: process.env.DATABASE_PATH || path.join(__dirname, '../storage/database/print-service.db'),
  },

  storage: {
    root: process.env.STORAGE_PATH || path.join(__dirname, '../storage'),
    uploads: process.env.UPLOADS_PATH || path.join(__dirname, '../storage/uploads'),
    thumbnails: process.env.THUMBNAILS_PATH || path.join(__dirname, '../storage/thumbnails'),
    cache: process.env.CACHE_PATH || path.join(__dirname, '../storage/cache'),
    logs: process.env.LOGS_PATH || path.join(__dirname, '../storage/logs'),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  cors: {
    origin: process.env.CORS_ORIGIN 
      ? (process.env.CORS_ORIGIN.includes(',') 
          ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
          : process.env.CORS_ORIGIN)
      : true, // Allow all origins in development
    credentials: true,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 100,
    maxFileSizeBytes: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 100) * 1024 * 1024,
    maxFilesPerUpload: parseInt(process.env.MAX_FILES_PER_UPLOAD, 10) || 10,
    allowedExtensions: (process.env.ALLOWED_EXTENSIONS || '.stl,.3mf,.obj').split(','),
  },

  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  },

  featureFlags: {
    models: process.env.FEATURE_MODELS === 'true',
    pricing: process.env.FEATURE_PRICING === 'true',
    slicing: process.env.FEATURE_SLICING === 'true',
    orders: process.env.FEATURE_ORDERS === 'true',
    queue: process.env.FEATURE_QUEUE === 'true',
    shipping: process.env.FEATURE_SHIPPING === 'true',
    payment: process.env.FEATURE_PAYMENT === 'true',
    ai: process.env.FEATURE_AI === 'true',
    admin: process.env.FEATURE_ADMIN === 'true',
  },

  slicing: {
    curaEnginePath: process.env.CURAENGINE_PATH || '/usr/bin/CuraEngine',
    timeoutMs: parseInt(process.env.SLICING_TIMEOUT_MS, 10) || 60000,
    maxConcurrency: parseInt(process.env.SLICING_MAX_CONCURRENCY, 10) || 2,
  },

  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4',
    openaiTemperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },

  // Pricing defaults (fallback если нет в БД)
  pricingDefaults: {
    materialDensity: parseFloat(process.env.DEFAULT_MATERIAL_DENSITY) || 1.24,
    materialPricePerGram: parseFloat(process.env.DEFAULT_MATERIAL_PRICE_PER_GRAM) || 0.05,
    printerRatePerHour: parseFloat(process.env.DEFAULT_PRINTER_RATE_PER_HOUR) || 50,
    laborFixed: parseFloat(process.env.DEFAULT_LABOR_FIXED) || 50,
    marginPercent: parseFloat(process.env.DEFAULT_MARGIN_PERCENT) || 15,
    minOrderPrice: parseFloat(process.env.DEFAULT_MIN_ORDER_PRICE) || 500,
  },
}

// Validation
if (config.isProduction && config.jwt.secret === 'your-super-secret-jwt-key') {
  console.error('FATAL: JWT_SECRET must be set in production!')
  process.exit(1)
}

module.exports = config
