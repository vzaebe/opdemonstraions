const Database = require('better-sqlite3')
const fs = require('fs')
const path = require('path')
const config = require('../config')

class DatabaseConnection {
  constructor() {
    this.db = null
  }

  async init() {
    try {
      console.log('Initializing database...')
      // Ensure database directory exists
      const dbDir = path.dirname(config.database.path)
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true })
        console.log(`Created database directory: ${dbDir}`)
      }

      console.log(`Connecting to database: ${config.database.path}`)
      // Connect to SQLite
      this.db = new Database(config.database.path, {
        verbose: config.isDevelopment ? console.log : null,
      })

      // Enable foreign keys
      this.db.pragma('foreign_keys = ON')
      console.log('Foreign keys enabled')

      // Run migrations
      console.log('Running migrations...')
      await this.runMigrations()
      console.log('Migrations completed')

      console.log(`✅ Database connected: ${config.database.path}`)
    } catch (error) {
      console.error('❌ Database initialization error:', error)
      throw error
    }
  }

  async runMigrations() {
    const migrationsDir = path.join(__dirname, 'migrations')

    // Create migrations table if not exists
    this.db
      .prepare(
        `
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
      )
      .run()

    // Get applied migrations
    const appliedMigrations = this.db.prepare('SELECT name FROM migrations').all()
    const appliedSet = new Set(appliedMigrations.map((m) => m.name))

    // Get all migration files
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`⏭️  Migration already applied: ${file}`)
        continue
      }

      console.log(`🔄 Running migration: ${file}`)
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')

      // Split by semicolons and execute (better-sqlite3 doesn't support .exec with multiple statements well)
      const statements = sql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      this.db.transaction(() => {
        for (const statement of statements) {
          this.db.prepare(statement).run()
        }
        this.db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file)
      })()

      console.log(`✅ Migration applied: ${file}`)
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.')
    }
    return this.db
  }

  close() {
    if (this.db) {
      this.db.close()
      console.log('Database connection closed.')
    }
  }
}

const dbConnection = new DatabaseConnection()

module.exports = dbConnection
