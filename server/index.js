import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { mkdirSync } from 'fs'
import { randomUUID } from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { config } from './config.js'
import { getDb, migrate } from './db.js'
import { handleLogin, handleMe, requireRole } from './auth.js'
import { handlePageview, getStatsSummary } from './telemetry.js'
import bcrypt from 'bcryptjs'
import { ensureAppDataSeeded, readAppData, writeAppData } from './dataStore.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UPLOADS_DIR = path.join(__dirname, 'uploads')

function getRequestId(req) {
  const headerId = req?.headers?.['x-request-id']
  if (typeof headerId === 'string' && headerId.trim()) return headerId
  return randomUUID()
}

function safeBodyKeys(body) {
  if (!body || typeof body !== 'object') return []
  try {
    return Object.keys(body)
  } catch {
    return []
  }
}

function logError(err, req) {
  const timestamp = new Date().toISOString()
  const baseInfo = {
    message: err?.message || String(err),
    stack: err?.stack
  }

  const requestId = req?.requestId || getRequestId(req)

  if (req) {
    console.error(`[${timestamp}] [api:error]`, {
      ...baseInfo,
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip,
      user: req.user?.username || null,
      bodyKeys: safeBodyKeys(req.body)
    })
  } else {
    console.error(`[${timestamp}] [server:error]`, { ...baseInfo, requestId })
  }
}

function logRequest(req, res, startedAt) {
  const timestamp = new Date().toISOString()
  const durationMs = Date.now() - startedAt
  const printer = res.statusCode >= 500 ? console.error : res.statusCode >= 400 ? console.warn : console.log
  printer(`[${timestamp}] [api:request]`, {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    status: res.statusCode,
    durationMs,
    ip: req.ip,
    user: req.user?.username || null,
    bodyKeys: safeBodyKeys(req.body)
  })
}

function wrapAsync(handler) {
  if (handler?.constructor?.name !== 'AsyncFunction') return handler
  return async function wrappedHandler(req, res, next) {
    try {
      await handler(req, res, next)
    } catch (err) {
      logError(err, req)
      next(err)
    }
  }
}

function enableAsyncErrorLogging(app) {
  const methods = ['get', 'post', 'patch', 'put', 'delete']
  methods.forEach((method) => {
    const original = app[method].bind(app)
    app[method] = (...args) => {
      const wrapped = args.map((arg) => (typeof arg === 'function' ? wrapAsync(arg) : arg))
      return original(...wrapped)
    }
  })
}

process.on('unhandledRejection', (err) => logError(err))
process.on('uncaughtException', (err) => {
  logError(err)
  process.exit(1)
})

// Helpers --------------------------------------------------------------------
function readData() {
  return readAppData()
}

function writeData(data) {
  return writeAppData(data)
}

function ensureArray(data, key) {
  if (!Array.isArray(data[key])) data[key] = []
  return data[key]
}

function ensureObject(data, key, fallback = {}) {
  const value = data[key]
  if (!value || typeof value !== 'object' || Array.isArray(value)) data[key] = fallback
  return data[key]
}

function generateId(items) {
  const ids = (items || []).map((x) => x?.id).filter((x) => x !== undefined && x !== null)
  const allNumbers = ids.length > 0 && ids.every((x) => typeof x === 'number')
  if (allNumbers) {
    const max = Math.max(0, ...ids)
    return max + 1
  }
  return randomUUID()
}

const ADMIN_COLLECTIONS = new Set([
  'printRequests',
  'volunteers',
  'campaigns',
  'doneWorks',
  'partners',
  'articles',
  'videos',
  'materials',
  'printModels',
  'projects',
  'resources',
  'materialDonations',
  'fundraisingGoals',
  'supportGoals',
  'generalPartners',
  'employees',
  'organizationProjects'
])

// Auth / RBAC ----------------------------------------------------------------
if (config.env === 'production' && !config.jwtSecret) {
  throw new Error('AUTH_JWT_SECRET must be set in production')
}

const requireSuperAdmin = requireRole(['super_admin'])
const requireAdmin = requireRole(['super_admin', 'admin'])
const requireModerator = requireRole(['super_admin', 'admin', 'moderator'])

function createServer() {
  // Ensure DB schema exists (auth + telemetry)
  migrate()
  ensureAppDataSeeded()

  const app = express()
  enableAsyncErrorLogging(app)
  // If you run behind a reverse proxy (nginx), enable it:
  // app.set('trust proxy', 1)
  app.use(
    cors({
      origin: (origin, cb) => {
        // non-browser requests / same-origin
        if (!origin) return cb(null, true)

        // In dev, allow common local origins by default
        const allowList =
          config.corsOrigins.length > 0
            ? config.corsOrigins
            : ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3001']

        if (allowList.includes(origin)) return cb(null, true)
        return cb(new Error('CORS: origin not allowed'))
      },
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )
  app.use(cookieParser())
  app.use(express.json({ limit: '1mb' }))
  app.use((req, res, next) => {
    req.requestId = getRequestId(req)
    const startedAt = Date.now()
    res.on('finish', () => logRequest(req, res, startedAt))
    next()
  })

  // Static uploads (for admin-managed media)
  mkdirSync(UPLOADS_DIR, { recursive: true })
  app.use('/uploads', express.static(UPLOADS_DIR))

  const upload = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname || '')
        cb(null, `${randomUUID()}${ext}`)
      }
    }),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
  })

  // Auth (JWT + roles)
  app.post('/api/auth/login', handleLogin)
  app.get('/api/auth/me', handleMe)

  // Telemetry (public, privacy-friendly)
  app.post('/api/telemetry/pageview', handlePageview)

  // Admin: upload media -------------------------------------------------------
  app.post('/api/admin/upload', requireModerator, upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'File is required (field name: file)' } })
    }
    res.json({
      ok: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`
    })
  })

  // Public/Admin: Support goals ----------------------------------------------
  app.get('/api/support-goals', async (_req, res) => {
    const data = readData()
    res.json(data.supportGoals || [])
  })

  app.get('/api/admin/support-goals', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.supportGoals || [])
  })

  app.post('/api/admin/support-goals', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const list = ensureArray(data, 'supportGoals')
    const item = {
      id: generateId(list),
      title: payload.title || '',
      description: payload.description || '',
      target_amount: payload.target_amount || 0,
      current_amount: payload.current_amount || 0,
      category: payload.category || '',
      priority: payload.priority || 'medium',
      icon: payload.icon || '',
      examples: payload.examples || []
    }
    list.push(item)
    writeData(data)
    res.json(item)
  })

  app.patch('/api/admin/support-goals/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'supportGoals')
    const item = list.find((x) => String(x.id) === String(req.params.id))
    if (!item) return res.status(404).json({ error: { message: 'Not found' } })
    Object.assign(item, req.body || {})
    writeData(data)
    res.json(item)
  })

  app.delete('/api/admin/support-goals/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'supportGoals')
    const before = list.length
    data.supportGoals = list.filter((x) => String(x.id) !== String(req.params.id))
    if (data.supportGoals.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Organization projects --------------------------------------
  app.get('/api/organization-projects', async (_req, res) => {
    const data = readData()
    res.json(data.organizationProjects || [])
  })

  app.get('/api/organization-projects/:slug', async (req, res) => {
    const data = readData()
    const item = (data.organizationProjects || []).find((p) => p.slug === req.params.slug)
    if (!item) return res.status(404).json({ error: { message: 'Not found' } })
    res.json(item)
  })

  app.get('/api/admin/organization-projects', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.organizationProjects || [])
  })

  app.post('/api/admin/organization-projects', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const list = ensureArray(data, 'organizationProjects')
    const item = {
      id: generateId(list),
      slug: payload.slug || `project-${Date.now()}`,
      title: payload.title || '',
      description: payload.description || '',
      fullDescription: payload.fullDescription || '',
      icon: payload.icon || '🎯',
      image: payload.image || '',
      category: payload.category || 'education',
      status: payload.status || 'planned',
      participants: payload.participants || undefined,
      duration: payload.duration || undefined,
      location: payload.location || undefined,
      tags: payload.tags || []
    }
    list.push(item)
    writeData(data)
    res.json(item)
  })

  app.patch('/api/admin/organization-projects/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'organizationProjects')
    const item = list.find((x) => String(x.id) === String(req.params.id))
    if (!item) return res.status(404).json({ error: { message: 'Not found' } })
    Object.assign(item, req.body || {})
    writeData(data)
    res.json(item)
  })

  app.delete('/api/admin/organization-projects/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'organizationProjects')
    const before = list.length
    data.organizationProjects = list.filter((x) => String(x.id) !== String(req.params.id))
    if (data.organizationProjects.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: General partners -------------------------------------------
  app.get('/api/general-partners', async (_req, res) => {
    const data = readData()
    res.json(data.generalPartners || [])
  })

  app.get('/api/admin/general-partners', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.generalPartners || [])
  })

  app.post('/api/admin/general-partners', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const list = ensureArray(data, 'generalPartners')
    const item = {
      id: generateId(list),
      name: payload.name || '',
      type: payload.type || 'company',
      logo: payload.logo || '',
      industry: payload.industry || '',
      assistanceType: payload.assistanceType || '',
      description: payload.description || '',
      fullDescription: payload.fullDescription || '',
      website: payload.website || '',
      email: payload.email || '',
      phone: payload.phone || '',
      city: payload.city || '',
      foundedYear: payload.foundedYear || undefined,
      completedProjects: payload.completedProjects || 0
    }
    list.push(item)
    writeData(data)
    res.json(item)
  })

  app.patch('/api/admin/general-partners/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'generalPartners')
    const item = list.find((x) => String(x.id) === String(req.params.id))
    if (!item) return res.status(404).json({ error: { message: 'Not found' } })
    Object.assign(item, req.body || {})
    writeData(data)
    res.json(item)
  })

  app.delete('/api/admin/general-partners/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'generalPartners')
    const before = list.length
    data.generalPartners = list.filter((x) => String(x.id) !== String(req.params.id))
    if (data.generalPartners.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Employees ---------------------------------------------------
  app.get('/api/employees', async (_req, res) => {
    const data = readData()
    res.json(data.employees || [])
  })

  app.get('/api/admin/employees', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.employees || [])
  })

  app.post('/api/admin/employees', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const list = ensureArray(data, 'employees')
    const item = {
      id: payload.id || generateId(list),
      name: payload.name || '',
      role: payload.role || '',
      photoUrl: payload.photoUrl || '',
      backgroundUrl: payload.backgroundUrl || '',
      bio: payload.bio || '',
      details: payload.details || []
    }
    list.push(item)
    writeData(data)
    res.json(item)
  })

  app.patch('/api/admin/employees/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'employees')
    const item = list.find((x) => String(x.id) === String(req.params.id))
    if (!item) return res.status(404).json({ error: { message: 'Not found' } })
    Object.assign(item, req.body || {})
    writeData(data)
    res.json(item)
  })

  app.delete('/api/admin/employees/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'employees')
    const before = list.length
    data.employees = list.filter((x) => String(x.id) !== String(req.params.id))
    if (data.employees.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Site content (key/value) -----------------------------------
  app.get('/api/site-content/:key', async (req, res) => {
    const data = readData()
    const siteContent = ensureObject(data, 'siteContent', {})
    const value = siteContent[req.params.key]
    if (!value) return res.status(404).json({ error: { message: 'Not found' } })
    res.json(value)
  })

  app.get('/api/admin/site-content/:key', requireAdmin, async (req, res) => {
    const data = readData()
    const siteContent = ensureObject(data, 'siteContent', {})
    const value = siteContent[req.params.key]
    if (!value) return res.status(404).json({ error: { message: 'Not found' } })
    res.json(value)
  })

  app.put('/api/admin/site-content/:key', requireAdmin, async (req, res) => {
    const data = readData()
    const siteContent = ensureObject(data, 'siteContent', {})
    siteContent[req.params.key] = req.body || {}
    writeData(data)
    res.json(siteContent[req.params.key])
  })

  // Admin: raw collections editor (replace whole collection) ------------------
  app.get('/api/admin/collections/:key', requireAdmin, async (req, res) => {
    const key = req.params.key
    if (!ADMIN_COLLECTIONS.has(key)) {
      return res.status(400).json({ error: { message: 'Collection not allowed' } })
    }
    const data = readData()
    res.json(data[key] || [])
  })

  app.put('/api/admin/collections/:key', requireAdmin, async (req, res) => {
    const key = req.params.key
    if (!ADMIN_COLLECTIONS.has(key)) {
      return res.status(400).json({ error: { message: 'Collection not allowed' } })
    }
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: { message: 'Body must be an array' } })
    }
    const data = readData()
    data[key] = req.body
    writeData(data)
    res.json({ ok: true, count: data[key].length })
  })

  // Admin: stats / monitoring ------------------------------------------------
  app.get('/api/admin/stats/summary', requireAdmin, getStatsSummary)

  // Admin: user management (super_admin only) -------------------------------
  app.get('/api/admin/users', requireSuperAdmin, (_req, res) => {
    const db = getDb()
    const users = db
      .prepare('SELECT id, username, role, is_active, created_at FROM users ORDER BY id ASC')
      .all()
    res.json(users)
  })

  app.post('/api/admin/users', requireSuperAdmin, async (req, res) => {
    const username = String(req.body?.username || '').trim()
    const password = String(req.body?.password || '')
    const role = String(req.body?.role || '')

    if (!username || !password) return res.status(400).json({ error: { message: 'Username and password are required' } })
    if (!['super_admin', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ error: { message: 'Invalid role' } })
    }

    const db = getDb()
    const hash = await bcrypt.hash(password, 12)

    try {
      const info = db
        .prepare('INSERT INTO users (username, password_hash, role, is_active) VALUES (?, ?, ?, 1)')
        .run(username, hash, role)
      res.json({ ok: true, id: info.lastInsertRowid })
    } catch (e) {
      return res.status(400).json({ error: { message: 'User already exists' } })
    }
  })

  app.patch('/api/admin/users/:id', requireSuperAdmin, async (req, res) => {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: { message: 'Invalid id' } })

    const role = req.body?.role != null ? String(req.body.role) : null
    const password = req.body?.password != null ? String(req.body.password) : null
    const isActive = req.body?.is_active != null ? Number(req.body.is_active) : null

    if (role != null && !['super_admin', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ error: { message: 'Invalid role' } })
    }
    if (isActive != null && ![0, 1].includes(isActive)) {
      return res.status(400).json({ error: { message: 'Invalid is_active' } })
    }

    const db = getDb()
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id)
    if (!user) return res.status(404).json({ error: { message: 'Not found' } })

    let passwordHash = null
    if (password != null) {
      passwordHash = await bcrypt.hash(password, 12)
    }

    db.prepare(
      `
      UPDATE users
      SET
        role = COALESCE(?, role),
        is_active = COALESCE(?, is_active),
        password_hash = COALESCE(?, password_hash)
      WHERE id = ?
    `
    ).run(role, isActive, passwordHash, id)

    const updated = db
      .prepare('SELECT id, username, role, is_active, created_at FROM users WHERE id = ?')
      .get(id)
    res.json(updated)
  })

  // Public/Admin: Resources ---------------------------------------------------
  app.get('/api/resources', async (_req, res) => {
    const data = readData()
    res.json(data.resources || [])
  })

  app.get('/api/admin/resources', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.resources || [])
  })

  app.post('/api/admin/resources', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const list = ensureArray(data, 'resources')
    const item = {
      id: generateId(list),
      category: payload.category || '',
      title: payload.title || '',
      url: payload.url || '',
      description: payload.description || ''
    }
    list.push(item)
    writeData(data)
    res.json(item)
  })

  app.patch('/api/admin/resources/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'resources')
    const item = list.find((x) => String(x.id) === String(req.params.id))
    if (!item) return res.status(404).json({ error: { message: 'Not found' } })
    Object.assign(item, req.body || {})
    writeData(data)
    res.json(item)
  })

  app.delete('/api/admin/resources/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'resources')
    const before = list.length
    data.resources = list.filter((x) => String(x.id) !== String(req.params.id))
    if (data.resources.length === before) return res.status(404).json({ error: { message: 'Not found' } })
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Donations ---------------------------------------------------
  app.get('/api/donations', async (_req, res) => {
    const data = readData()
    res.json(data.donations || { financial: [], material: [] })
  })

  app.get('/api/admin/donations', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.donations || { financial: [], material: [] })
  })

  app.put('/api/admin/donations', requireAdmin, async (req, res) => {
    const data = readData()
    data.donations = req.body || { financial: [], material: [] }
    writeData(data)
    res.json(data.donations)
  })

  // Public/Admin: Material donations -----------------------------------------
  app.get('/api/material-donations', async (_req, res) => {
    const data = readData()
    res.json(data.materialDonations || [])
  })

  // Public submission (help page)
  app.post('/api/material-donations', async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const list = ensureArray(data, 'materialDonations')
    const item = {
      id: generateId(list),
      name: payload.name || '',
      item: payload.item || '',
      type: payload.type || 'plastic',
      comment: payload.comment || '',
      date: new Date().toISOString().split('T')[0]
    }
    list.push(item)
    writeData(data)
    res.json(item)
  })

  app.get('/api/admin/material-donations', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.materialDonations || [])
  })

  app.delete('/api/admin/material-donations/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'materialDonations')
    const before = list.length
    data.materialDonations = list.filter((x) => String(x.id) !== String(req.params.id))
    if (data.materialDonations.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Fundraising goals ------------------------------------------
  app.get('/api/fundraising-goals', async (_req, res) => {
    const data = readData()
    res.json(data.fundraisingGoals || [])
  })

  app.get('/api/admin/fundraising-goals', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.fundraisingGoals || [])
  })

  app.post('/api/admin/fundraising-goals', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const list = ensureArray(data, 'fundraisingGoals')
    const item = {
      id: generateId(list),
      title: payload.title || '',
      description: payload.description || '',
      target_amount: payload.target_amount || 0,
      current_amount: payload.current_amount || 0,
      image: payload.image || ''
    }
    list.push(item)
    writeData(data)
    res.json(item)
  })

  app.patch('/api/admin/fundraising-goals/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'fundraisingGoals')
    const item = list.find((x) => String(x.id) === String(req.params.id))
    if (!item) return res.status(404).json({ error: { message: 'Not found' } })
    Object.assign(item, req.body || {})
    writeData(data)
    res.json(item)
  })

  app.delete('/api/admin/fundraising-goals/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const list = ensureArray(data, 'fundraisingGoals')
    const before = list.length
    data.fundraisingGoals = list.filter((x) => String(x.id) !== String(req.params.id))
    if (data.fundraisingGoals.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public: create print request --------------------------------------------
  app.post('/api/print-requests', async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const newRequest = {
      id: randomUUID(),
      name: payload.name || '',
      orphanage: payload.orphanage || '',
      wish: payload.wish || '',
      file_name: payload.file_name || '',
      model_link: payload.model_link || '',
      comment: payload.comment || '',
      contact_name: payload.contact_name || '',
      contact_phone: payload.contact_phone || '',
      contact_email: payload.contact_email || '',
      status: 'new',
      date: new Date().toISOString().split('T')[0]
    }
    ensureArray(data, 'printRequests').push(newRequest)
    writeData(data)
    res.json(newRequest)
  })

  // Public: list published campaigns ----------------------------------------
  app.get('/api/campaigns', async (_req, res) => {
    const data = readData()
    const items = (data.campaigns || []).filter((c) => c.status === 'published')
    res.json(items)
  })

  // Public: create volunteer application ------------------------------------
  app.post('/api/volunteers', async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const volunteer = {
      id: randomUUID(),
      name: payload.name || '',
      type: payload.type || 'individual',
      city: payload.city || '',
      printer_model: payload.printer_model || '',
      materials: payload.materials || [],
      about: payload.about || '',
      contact: payload.contact || '',
      status: 'new',
      createdAt: new Date().toISOString()
    }
    ensureArray(data, 'volunteers').push(volunteer)
    writeData(data)
    res.json(volunteer)
  })

  // Admin: print requests ----------------------------------------------------
  app.get('/api/admin/print-requests', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.printRequests || [])
  })

  app.patch('/api/admin/print-requests/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const item = (data.printRequests || []).find((r) => r.id === req.params.id)
    if (!item) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    const fields = [
      'name',
      'orphanage',
      'wish',
      'file_name',
      'model_link',
      'comment',
      'contact_name',
      'contact_phone',
      'contact_email'
    ]
    for (const key of fields) {
      if (key in req.body) item[key] = req.body[key]
    }
    writeData(data)
    res.json(item)
  })

  app.patch('/api/admin/print-requests/:id/status', requireAdmin, async (req, res) => {
    const data = readData()
    const item = (data.printRequests || []).find((r) => r.id === req.params.id)
    if (!item) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    item.status = req.body?.status || item.status
    writeData(data)
    res.json(item)
  })

  // Admin: volunteers --------------------------------------------------------
  app.get('/api/admin/volunteers', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.volunteers || [])
  })

  app.patch('/api/admin/volunteers/:id/status', requireAdmin, async (req, res) => {
    const data = readData()
    const item = (data.volunteers || []).find((v) => v.id === req.params.id)
    if (!item) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    item.status = req.body?.status || item.status
    writeData(data)
    res.json(item)
  })

  // Admin: campaigns ---------------------------------------------------------
  app.get('/api/admin/campaigns', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.campaigns || [])
  })

  app.post('/api/admin/campaigns', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const campaigns = ensureArray(data, 'campaigns')
    const campaign = {
      id: randomUUID(),
      title: payload.title || '',
      description: payload.description || '',
      type: payload.type || 'materials',
      status: payload.status || 'draft',
      shortText: payload.shortText || '',
      heroImage: payload.heroImage || '',
      needs: payload.needs || [],
      progress: payload.progress || 0
    }
    campaigns.push(campaign)
    writeData(data)
    res.json(campaign)
  })

  app.patch('/api/admin/campaigns/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const item = (data.campaigns || []).find((c) => c.id === req.params.id)
    if (!item) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(item, req.body || {})
    writeData(data)
    res.json(item)
  })

  app.delete('/api/admin/campaigns/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const before = data.campaigns.length
    data.campaigns = (data.campaigns || []).filter((c) => c.id !== req.params.id)
    if (data.campaigns.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  app.patch('/api/admin/campaign-needs/:needId', requireAdmin, async (req, res) => {
    const data = readData()
    let found = null
    for (const campaign of data.campaigns || []) {
      const need = (campaign.needs || []).find((n) => n.id === req.params.needId)
      if (need) {
        Object.assign(need, req.body || {})
        found = need
        break
      }
    }
    if (!found) {
      return res.status(404).json({ error: { message: 'Need not found' } })
    }
    writeData(data)
    res.json(found)
  })

  // Admin: donations history stub ------------------------------------------
  app.post('/api/admin/donations-history', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const donation = {
      id: randomUUID(),
      date: payload.date || new Date().toISOString(),
      amount: payload.amount || 0,
      method: payload.method || 'transfer',
      comment: payload.comment || ''
    }
    ensureArray(data, 'donationsHistory').push(donation)
    writeData(data)
    res.json(donation)
  })

  // Public/ Admin: done works (gallery) --------------------------------------
  app.get('/api/done-works', async (_req, res) => {
    const data = readData()
    res.json(data.doneWorks || [])
  })

  app.get('/api/admin/done-works', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.doneWorks || [])
  })

  app.post('/api/admin/done-works', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const doneWorks = ensureArray(data, 'doneWorks')
    const work = {
      id: randomUUID(),
      title: payload.title || '',
      image: payload.image || '',
      description: payload.description || '',
      date: payload.date || new Date().toISOString().split('T')[0]
    }
    doneWorks.push(work)
    writeData(data)
    res.json(work)
  })

  app.delete('/api/admin/done-works/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const before = data.doneWorks.length
    data.doneWorks = (data.doneWorks || []).filter((w) => w.id !== req.params.id)
    if (data.doneWorks.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  app.patch('/api/admin/done-works/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const work = (data.doneWorks || []).find((w) => w.id === req.params.id)
    if (!work) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    const fields = ['title', 'image', 'description', 'date']
    for (const key of fields) {
      if (key in req.body) work[key] = req.body[key]
    }
    writeData(data)
    res.json(work)
  })

  // Admin: partners ----------------------------------------------------------
  app.get('/api/admin/partners', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.partners || [])
  })

  app.post('/api/admin/partners', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const partners = ensureArray(data, 'partners')
    const partner = {
      id: randomUUID(),
      name: payload.name || '',
      type: payload.type || '',
      city: payload.city || '',
      contact: payload.contact || '',
      printer_model: payload.printer_model || '',
      materials: payload.materials || [],
      about: payload.about || '',
      completed_works: payload.completed_works || 0
    }
    partners.push(partner)
    writeData(data)
    res.json(partner)
  })

  app.patch('/api/admin/partners/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const partner = (data.partners || []).find((p) => p.id === req.params.id)
    if (!partner) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    const fields = ['name', 'type', 'city', 'contact', 'printer_model', 'materials', 'about', 'completed_works']
    for (const key of fields) {
      if (key in req.body) partner[key] = req.body[key]
    }
    writeData(data)
    res.json(partner)
  })

  app.delete('/api/admin/partners/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const before = data.partners.length
    data.partners = (data.partners || []).filter((p) => p.id !== req.params.id)
    if (data.partners.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Articles -----------------------------------------------------
  app.get('/api/articles', async (_req, res) => {
    const data = readData()
    res.json(data.articles || [])
  })

  app.get('/api/admin/articles', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.articles || [])
  })

  app.post('/api/admin/articles', requireModerator, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const article = {
      id: randomUUID(),
      title: payload.title || '',
      content: payload.content || '',
      author: payload.author || '',
      date: payload.date || new Date().toISOString(),
      image: payload.image || '',
      category: payload.category || ''
    }
    data.articles = data.articles || []
    data.articles.push(article)
    writeData(data)
    res.json(article)
  })

  app.patch('/api/admin/articles/:id', requireModerator, async (req, res) => {
    const data = readData()
    const article = (data.articles || []).find((a) => a.id === req.params.id)
    if (!article) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(article, req.body || {})
    writeData(data)
    res.json(article)
  })

  app.delete('/api/admin/articles/:id', requireModerator, async (req, res) => {
    const data = readData()
    const before = (data.articles || []).length
    data.articles = (data.articles || []).filter((a) => a.id !== req.params.id)
    if (data.articles.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Videos ------------------------------------------------------
  app.get('/api/videos', async (_req, res) => {
    const data = readData()
    res.json(data.videos || [])
  })

  app.get('/api/admin/videos', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.videos || [])
  })

  app.post('/api/admin/videos', requireModerator, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const video = {
      id: randomUUID(),
      title: payload.title || '',
      url: payload.url || '',
      description: payload.description || '',
      thumbnail: payload.thumbnail || '',
      date: payload.date || new Date().toISOString(),
      duration: payload.duration || ''
    }
    data.videos = data.videos || []
    data.videos.push(video)
    writeData(data)
    res.json(video)
  })

  app.patch('/api/admin/videos/:id', requireModerator, async (req, res) => {
    const data = readData()
    const video = (data.videos || []).find((v) => v.id === req.params.id)
    if (!video) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(video, req.body || {})
    writeData(data)
    res.json(video)
  })

  app.delete('/api/admin/videos/:id', requireModerator, async (req, res) => {
    const data = readData()
    const before = (data.videos || []).length
    data.videos = (data.videos || []).filter((v) => v.id !== req.params.id)
    if (data.videos.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Materials ---------------------------------------------------
  app.get('/api/materials', async (_req, res) => {
    const data = readData()
    res.json(data.materials || [])
  })

  app.get('/api/admin/materials', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.materials || [])
  })

  app.post('/api/admin/materials', requireModerator, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const material = {
      id: randomUUID(),
      title: payload.title || '',
      type: payload.type || '',
      fileUrl: payload.fileUrl || '',
      description: payload.description || '',
      date: payload.date || new Date().toISOString(),
      size: payload.size || ''
    }
    data.materials = data.materials || []
    data.materials.push(material)
    writeData(data)
    res.json(material)
  })

  app.patch('/api/admin/materials/:id', requireModerator, async (req, res) => {
    const data = readData()
    const material = (data.materials || []).find((m) => m.id === req.params.id)
    if (!material) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(material, req.body || {})
    writeData(data)
    res.json(material)
  })

  app.delete('/api/admin/materials/:id', requireModerator, async (req, res) => {
    const data = readData()
    const before = (data.materials || []).length
    data.materials = (data.materials || []).filter((m) => m.id !== req.params.id)
    if (data.materials.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Print Models -------------------------------------------------
  app.get('/api/print-models', async (_req, res) => {
    const data = readData()
    res.json(data.printModels || [])
  })

  app.get('/api/admin/print-models', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.printModels || [])
  })

  app.post('/api/admin/print-models', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const model = {
      id: randomUUID(),
      name: payload.name || '',
      description: payload.description || '',
      category: payload.category || '',
      fileUrl: payload.fileUrl || '',
      imageUrl: payload.imageUrl || '',
      printTime: payload.printTime || '',
      materialType: payload.materialType || '',
      date: payload.date || new Date().toISOString()
    }
    data.printModels = data.printModels || []
    data.printModels.push(model)
    writeData(data)
    res.json(model)
  })

  app.patch('/api/admin/print-models/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const model = (data.printModels || []).find((m) => m.id === req.params.id)
    if (!model) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(model, req.body || {})
    writeData(data)
    res.json(model)
  })

  app.delete('/api/admin/print-models/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const before = (data.printModels || []).length
    data.printModels = (data.printModels || []).filter((m) => m.id !== req.params.id)
    if (data.printModels.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Projects ----------------------------------------------------
  app.get('/api/projects', async (_req, res) => {
    const data = readData()
    res.json(data.projects || [])
  })

  app.get('/api/admin/projects', requireAdmin, async (_req, res) => {
    const data = readData()
    res.json(data.projects || [])
  })

  app.post('/api/admin/projects', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const project = {
      id: randomUUID(),
      title: payload.title || '',
      description: payload.description || '',
      shortDescription: payload.shortDescription || '',
      status: payload.status || 'planned',
      category: payload.category || '',
      heroImage: payload.heroImage || '',
      startDate: payload.startDate || new Date().toISOString(),
      endDate: payload.endDate || '',
      photos: payload.photos || [],
      videos: payload.videos || [],
      reports: payload.reports || [],
      videoReports: payload.videoReports || [],
      mediaLinks: payload.mediaLinks || [],
      beneficiaries: payload.beneficiaries || '',
      impact: payload.impact || '',
      partners: payload.partners || [],
      budget: payload.budget || 0,
      raised: payload.raised || 0
    }
    data.projects = data.projects || []
    data.projects.push(project)
    writeData(data)
    res.json(project)
  })

  app.patch('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const project = (data.projects || []).find((p) => p.id === req.params.id)
    if (!project) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(project, req.body || {})
    writeData(data)
    res.json(project)
  })

  app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    const data = readData()
    const before = (data.projects || []).length
    data.projects = (data.projects || []).filter((p) => p.id !== req.params.id)
    if (data.projects.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    writeData(data)
    res.json({ ok: true })
  })

  // Public: Contact Form -----------------------------------------------------
  app.post('/api/contacts/send', async (req, res) => {
    const payload = req.body || {}
    const data = readData()
    const contact = {
      id: randomUUID(),
      name: payload.name || '',
      email: payload.email || '',
      phone: payload.phone || '',
      message: payload.message || '',
      date: new Date().toISOString()
    }
    data.contacts = data.contacts || []
    data.contacts.push(contact)
    writeData(data)
    res.json({ success: true, message: 'Сообщение отправлено', data: contact })
  })

  app.use((err, req, res, next) => {
    logError(err, req)
    if (res.headersSent) return next(err)
    res.status(500).json({ error: { message: 'Internal server error' } })
  })

  return app
}

function listenOnce(app, { host, port }) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, host, () => resolve(server))
    server.once('error', (err) => reject(err))
  })
}

async function start() {
  const app = createServer()

  const host = config.host
  let port = config.port

  for (let attempt = 1; attempt <= config.portMaxAttempts; attempt++) {
    try {
      await listenOnce(app, { host, port })
      const prettyHost = host === '0.0.0.0' ? 'localhost' : host
      console.log(`API server running on http://${prettyHost}:${port}`)
      if (attempt > 1) {
        console.log(`Port ${config.port} was busy; switched to ${port}`)
      }
      return
    } catch (err) {
      if (err?.code === 'EADDRINUSE' && config.portFallback) {
        port += 1
        continue
      }
      logError(err)
      console.error('Failed to start API server.')
      process.exitCode = 1
      return
    }
  }

  console.error(
    `Failed to start API server: no free port in range ${config.port}..${config.port + config.portMaxAttempts - 1}`
  )
  process.exitCode = 1
}

start()
