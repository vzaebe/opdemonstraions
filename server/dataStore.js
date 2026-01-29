import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDb } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LEGACY_JSON_PATH = path.join(__dirname, 'data.json')
const KEY = 'data'

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function ensureAppDataSeeded() {
  const db = getDb()
  const row = db.prepare('SELECT json FROM app_kv WHERE key = ?').get(KEY)
  if (row?.json) return

  // First run: import legacy JSON if it exists; otherwise start with empty object.
  let initial = {}
  if (existsSync(LEGACY_JSON_PATH)) {
    const raw = readFileSync(LEGACY_JSON_PATH, 'utf-8')
    initial = safeJsonParse(raw, {})
  }

  db.prepare('INSERT OR REPLACE INTO app_kv (key, json, updated_at) VALUES (?, ?, datetime(\'now\'))').run(
    KEY,
    JSON.stringify(initial)
  )
}

export function readAppData() {
  const db = getDb()
  const row = db.prepare('SELECT json FROM app_kv WHERE key = ?').get(KEY)
  return row?.json ? safeJsonParse(row.json, {}) : {}
}

export function writeAppData(data) {
  const db = getDb()
  db.prepare('INSERT OR REPLACE INTO app_kv (key, json, updated_at) VALUES (?, ?, datetime(\'now\'))').run(
    KEY,
    JSON.stringify(data ?? {})
  )
}

