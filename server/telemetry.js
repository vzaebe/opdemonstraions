import { createHash } from 'crypto'
import { config } from './config.js'
import { getDb } from './db.js'

function hashIp(ip) {
  if (!ip) return null
  const h = createHash('sha256')
  h.update(String(ip))
  if (config.telemetrySalt) h.update('|')
  if (config.telemetrySalt) h.update(config.telemetrySalt)
  return h.digest('hex')
}

function getClientIp(req) {
  // Keep it simple: prefer direct connection.
  // If you put this behind a reverse proxy, configure Express "trust proxy".
  const ip = req.ip || req.connection?.remoteAddress || null
  return ip ? String(ip) : null
}

export function handlePageview(req, res) {
  const path = String(req.body?.path || '').slice(0, 512)
  const referrer = req.body?.referrer ? String(req.body.referrer).slice(0, 1024) : null
  const ua = req.headers['user-agent'] ? String(req.headers['user-agent']).slice(0, 512) : null

  if (!path || !path.startsWith('/')) {
    return res.status(400).json({ error: { message: 'Invalid path' } })
  }

  const ipHash = hashIp(getClientIp(req))
  const db = getDb()
  db.prepare('INSERT INTO pageviews (path, referrer, ua, ip_hash) VALUES (?, ?, ?, ?)').run(
    path,
    referrer,
    ua,
    ipHash
  )

  return res.json({ ok: true })
}

export function getStatsSummary(_req, res) {
  const db = getDb()

  // Last 30 days summary
  const totals = db
    .prepare(
      `
      SELECT
        COUNT(*) as total_views,
        COUNT(DISTINCT ip_hash) as unique_visitors
      FROM pageviews
      WHERE at >= datetime('now', '-30 days')
    `
    )
    .get()

  const topPaths = db
    .prepare(
      `
      SELECT path, COUNT(*) as views
      FROM pageviews
      WHERE at >= datetime('now', '-30 days')
      GROUP BY path
      ORDER BY views DESC
      LIMIT 20
    `
    )
    .all()

  const daily = db
    .prepare(
      `
      SELECT substr(at, 1, 10) as day, COUNT(*) as views
      FROM pageviews
      WHERE at >= datetime('now', '-30 days')
      GROUP BY day
      ORDER BY day ASC
    `
    )
    .all()

  return res.json({
    ok: true,
    periodDays: 30,
    totalViews: Number(totals?.total_views || 0),
    uniqueVisitors: Number(totals?.unique_visitors || 0),
    topPaths,
    daily
  })
}

