const Database = require('better-sqlite3')
const fs = require('fs')
const path = require('path')

const dbPath = path.join(__dirname, '../storage/database/print-service.db')
const migrationFile = path.join(__dirname, '../database/migrations/002_seed_data.sql')

const db = new Database(dbPath)

console.log('Running migration: 002_seed_data.sql')

const sql = fs.readFileSync(migrationFile, 'utf-8')

// Remove comments
const cleanedSql = sql
  .split('\n')
  .filter(line => !line.trim().startsWith('--'))
  .join('\n')

// Split by semicolons that are not inside parentheses (for multi-line INSERTs)
const statements = []
let currentStatement = ''
let parenDepth = 0

for (let i = 0; i < cleanedSql.length; i++) {
  const char = cleanedSql[i]
  const nextChar = cleanedSql[i + 1]
  
  if (char === '(') parenDepth++
  if (char === ')') parenDepth--
  
  if (char === ';' && parenDepth === 0) {
    const stmt = currentStatement.trim()
    if (stmt && !stmt.startsWith('--')) {
      statements.push(stmt)
    }
    currentStatement = ''
  } else {
    currentStatement += char
  }
}

// Add last statement if exists
if (currentStatement.trim()) {
  statements.push(currentStatement.trim())
}

console.log(`Found ${statements.length} statements`)

db.transaction(() => {
  for (const statement of statements) {
    try {
      if (statement.trim()) {
        db.prepare(statement).run()
      }
    } catch (error) {
      // Ignore UNIQUE constraint errors (data might already exist)
      if (error.message.includes('UNIQUE constraint')) {
        console.log(`⚠️  Skipping duplicate: ${statement.substring(0, 50)}...`)
        continue
      }
      throw error
    }
  }
  
  // Mark migration as applied
  try {
    db.prepare('INSERT INTO migrations (name) VALUES (?)').run('002_seed_data.sql')
    console.log('✅ Migration applied successfully')
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      console.log('⚠️  Migration already marked as applied')
    } else {
      throw error
    }
  }
})()

db.close()
console.log('Done!')
