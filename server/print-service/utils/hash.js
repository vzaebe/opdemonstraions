const bcrypt = require('bcryptjs')
const crypto = require('crypto')

/**
 * Hash a password using bcrypt
 */
async function hashPassword(password) {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Compare a password with a hash
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash)
}

/**
 * Generate a random token (for email verification, password reset, etc.)
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate SHA256 hash (for file deduplication, cache keys)
 */
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Generate SHA256 hash from file
 */
function sha256File(filePath) {
  const fs = require('fs')
  const fileBuffer = fs.readFileSync(filePath)
  return sha256(fileBuffer)
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  sha256,
  sha256File,
}
