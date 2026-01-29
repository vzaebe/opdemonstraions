module.exports = {
  // File size limits
  MAX_FILE_SIZE_MB: 100,
  MAX_FILE_SIZE_BYTES: 100 * 1024 * 1024,

  // Model constraints
  MAX_MODEL_VOLUME_CM3: 100000, // 100 литров (гигантские модели)
  MIN_MODEL_VOLUME_CM3: 0.1, // 0.1 см³ (минимальная разумная модель)
  MAX_MODEL_DIMENSION_MM: 500, // 500 мм по одной оси

  // Print constraints
  DEFAULT_PRINTER_BED_X: 220, // mm
  DEFAULT_PRINTER_BED_Y: 220, // mm
  DEFAULT_PRINTER_BED_Z: 250, // mm

  // Roles
  ROLES: {
    GUEST: 'guest',
    USER: 'user',
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin',
  },

  // Order statuses
  ORDER_STATUSES: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PRODUCTION: 'in_production',
    PRINTING: 'printing',
    POST_PROCESSING: 'post_processing',
    READY: 'ready',
    SHIPPED: 'shipped',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },

  // Queue statuses
  QUEUE_STATUSES: {
    QUEUED: 'queued',
    ASSIGNED: 'assigned',
    PRINTING: 'printing',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
  },

  // Payment statuses
  PAYMENT_STATUSES: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },

  // Material types
  MATERIAL_TYPES: {
    FDM: 'FDM',
    SLA: 'SLA',
    SLS: 'SLS',
    MJF: 'MJF',
  },

  // Model formats
  SUPPORTED_FORMATS: ['STL', '3MF', 'OBJ'],

  // Email templates
  EMAIL_TEMPLATES: {
    ORDER_CREATED: 'order_created',
    ORDER_STATUS_CHANGED: 'order_status_changed',
    ORDER_SHIPPED: 'order_shipped',
    PAYMENT_RECEIVED: 'payment_received',
    AI_REQUEST_COMPLETED: 'ai_request_completed',
  },

  // Slicing
  SLICING_JOB_STATUSES: {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
  },

  // Rate limiting
  RATE_LIMITS: {
    GUEST: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
    USER: { windowMs: 15 * 60 * 1000, maxRequests: 1000 },
    ADMIN: { windowMs: 15 * 60 * 1000, maxRequests: 10000 },
  },

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Cache TTL
  CACHE_TTL_SECONDS: 30 * 24 * 60 * 60, // 30 дней

  // Slicing cache key components
  SLICING_CACHE_KEY_PARTS: ['model_hash', 'profile_id', 'material_id', 'infill', 'supports', 'shells'],
}
