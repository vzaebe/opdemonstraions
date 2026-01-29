import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let _db = null

function readMigration(name) {
  const p = path.join(__dirname, 'migrations', name)
  return readFileSync(p, 'utf-8')
}

export function getDb() {
  if (!_db) {
    _db = new Database(config.dbPath)

    // Safe defaults for a small VPS
    _db.pragma('foreign_keys = ON')
    _db.pragma('journal_mode = WAL')
    _db.pragma('synchronous = NORMAL')
  }
  return _db
}

export function migrate() {
  const db = getDb()
  const current = db.pragma('user_version', { simple: true })

  if (current < 1) {
    const sql = readMigration('001_init.sql')
    db.exec(sql)
    db.pragma('user_version = 1')
  }

  const currentAfter1 = db.pragma('user_version', { simple: true })
  if (currentAfter1 < 2) {
    const sql = readMigration('002_users_superadmin.sql')
    db.exec(sql)
    db.pragma('user_version = 2')
  }

  const currentAfter2 = db.pragma('user_version', { simple: true })
  if (currentAfter2 < 3) {
    const sql = readMigration('003_app_data.sql')
    db.exec(sql)
    db.pragma('user_version = 3')
  }
}

