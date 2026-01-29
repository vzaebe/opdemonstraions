const winston = require('winston')
const path = require('path')
const fs = require('fs')
const config = require('../config')

// Ensure logs directory exists
if (!fs.existsSync(config.storage.logs)) {
  fs.mkdirSync(config.storage.logs, { recursive: true })
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  config.logging.format === 'json'
    ? winston.format.json()
    : winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaStr}`
      })
)

const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),

    // Error log file
    new winston.transports.File({
      filename: path.join(config.storage.logs, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),

    // Combined log file
    new winston.transports.File({
      filename: path.join(config.storage.logs, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(config.storage.logs, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(config.storage.logs, 'rejections.log'),
    }),
  ],
})

module.exports = logger
