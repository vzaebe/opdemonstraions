import dotenv from 'dotenv'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env vars early (cross-platform, works in npm scripts).
// Order:
// - ENV_FILE (explicit)
// - .env (standard)
// - ENV (project-local alternative, matches ENV.example naming)
const ENV_FILE = process.env.ENV_FILE || ''
if (ENV_FILE && existsSync(ENV_FILE)) {
  dotenv.config({ path: ENV_FILE })
} else if (existsSync('.env')) {
  dotenv.config({ path: '.env' })
} else if (existsSync('ENV')) {
  dotenv.config({ path: 'ENV' })
}

function parseList(value) {
  if (!value) return []
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseNumber(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function parseBoolean(value, fallback) {
  if (value == null || value === '') return fallback
  const v = String(value).trim().toLowerCase()
  if (['1', 'true', 'yes', 'y', 'on'].includes(v)) return true
  if (['0', 'false', 'no', 'n', 'off'].includes(v)) return false
  return fallback
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: parseNumber(process.env.PORT, 3001), // Changed from 3000 to 3001 to avoid conflicts
  // If port is busy, try next ports (dev-friendly).
  portFallback: parseBoolean(process.env.PORT_FALLBACK, process.env.NODE_ENV !== 'production'),
  portMaxAttempts: Math.max(1, parseNumber(process.env.PORT_MAX_ATTEMPTS, 10)),

  // CORS: comma-separated list of allowed origins.
  // Examples:
  // - http://localhost:5173
  // - https://example.com
  corsOrigins: parseList(process.env.CORS_ORIGINS),

  // Auth
  jwtSecret:
    process.env.AUTH_JWT_SECRET ||
    (process.env.NODE_ENV === 'production' ? '' : 'dev-secret-change-me'),
  jwtExpiresIn: process.env.AUTH_JWT_EXPIRES_IN || '7d',

  // Telemetry / stats (privacy-friendly): we store only hash(ip).
  telemetrySalt: process.env.TELEMETRY_SALT || '',

  // SQLite
  dbPath:
    process.env.DB_PATH ||
    path.join(__dirname, 'var', 'app.sqlite')
}

// Ensure db dir exists early (for simple VPS setups)
mkdirSync(path.dirname(config.dbPath), { recursive: true })

