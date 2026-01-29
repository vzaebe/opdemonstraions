import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { config } from './config.js'
import { getDb } from './db.js'

function getAuthHeader(req) {
  const raw = req.headers?.authorization || req.headers?.Authorization
  return typeof raw === 'string' ? raw : ''
}

function readBearerToken(req) {
  const h = getAuthHeader(req)
  const m = h.match(/^Bearer\s+(.+)$/i)
  return m ? m[1] : null
}

export function signToken(user) {
  return jwt.sign(
    { role: user.role, username: user.username },
    config.jwtSecret,
    { subject: String(user.id), expiresIn: config.jwtExpiresIn }
  )
}

export function requireAuth(req, res, next) {
  const token = readBearerToken(req)
  if (!token) return res.status(401).json({ error: { message: 'Unauthorized' } })

  try {
    const payload = jwt.verify(token, config.jwtSecret)
    const sub = payload && typeof payload === 'object' ? payload.sub : null
    const role = payload && typeof payload === 'object' ? payload.role : null
    const username = payload && typeof payload === 'object' ? payload.username : null
    if (!sub || !role) return res.status(401).json({ error: { message: 'Unauthorized' } })

    req.user = { id: String(sub), role: String(role), username: username ? String(username) : null }
    next()
  } catch {
    return res.status(401).json({ error: { message: 'Unauthorized' } })
  }
}

export function requireRole(allowedRoles) {
  const set = new Set(allowedRoles)
  return function requireRoleMiddleware(req, res, next) {
    requireAuth(req, res, () => {
      const role = req.user?.role
      if (!role || !set.has(role)) {
        return res.status(403).json({ error: { message: 'Forbidden' } })
      }
      next()
    })
  }
}

export async function handleLogin(req, res) {
  const username = String(req.body?.username || '').trim()
  const password = String(req.body?.password || '')

  if (!username || !password) {
    return res.status(400).json({ error: { message: 'Username and password are required' } })
  }

  const db = getDb()
  const user = db
    .prepare('SELECT id, username, password_hash, role, is_active FROM users WHERE username = ?')
    .get(username)

  if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } })
  if (Number(user.is_active) !== 1) return res.status(403).json({ error: { message: 'User is disabled' } })

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } })

  const token = signToken(user)
  return res.json({ ok: true, token, user: { username: user.username, role: user.role } })
}

export function handleMe(req, res) {
  requireAuth(req, res, () => {
    return res.json({ ok: true, user: { id: req.user.id, username: req.user.username, role: req.user.role } })
  })
}

