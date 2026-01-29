import bcrypt from 'bcryptjs'
import { migrate, getDb } from '../db.js'
import { config } from '../config.js'

function usage() {
  console.log('Usage: node server/scripts/create-user.js <username> <password> <role>')
  console.log('role: super_admin | admin | moderator')
}

async function main() {
  const [username, password, role] = process.argv.slice(2)

  if (!username || !password || !role) {
    usage()
    process.exit(2)
  }
  if (!['super_admin', 'admin', 'moderator'].includes(role)) {
    console.error('Invalid role:', role)
    usage()
    process.exit(2)
  }
  if (!config.jwtSecret) {
    console.error('AUTH_JWT_SECRET is required (set it in env before creating users).')
    process.exit(2)
  }

  migrate()
  const db = getDb()

  const hash = await bcrypt.hash(password, 12)
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)

  if (existing) {
    db.prepare('UPDATE users SET password_hash = ?, role = ?, is_active = 1 WHERE id = ?').run(hash, role, existing.id)
    console.log(`Updated user "${username}" with role "${role}".`)
    return
  }

  db.prepare('INSERT INTO users (username, password_hash, role, is_active) VALUES (?, ?, ?, 1)').run(
    username,
    hash,
    role
  )
  console.log(`Created user "${username}" with role "${role}".`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

