#!/usr/bin/env node

/**
 * Script to create admin user
 * Usage: node scripts/create-admin.js
 */

require('dotenv').config()
const readline = require('readline')
const dbConnection = require('../database/connection')
const { hashPassword } = require('../utils/hash')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function createAdmin() {
  try {
    console.log('=== Create Admin User ===\n')

    const email = await question('Email: ')
    const password = await question('Password: ')
    const name = await question('Name: ')

    if (!email || !password) {
      console.error('Email and password are required')
      process.exit(1)
    }

    if (password.length < 6) {
      console.error('Password must be at least 6 characters')
      process.exit(1)
    }

    // Initialize database
    await dbConnection.init()
    const db = dbConnection.getDb()

    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      console.error(`User with email ${email} already exists`)
      process.exit(1)
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Insert admin user
    const result = db
      .prepare(
        `
      INSERT INTO users (email, password_hash, name, role)
      VALUES (?, ?, ?, 'admin')
    `
      )
      .run(email, passwordHash, name || null)

    console.log(`\n✅ Admin user created successfully!`)
    console.log(`ID: ${result.lastInsertRowid}`)
    console.log(`Email: ${email}`)
    console.log(`Role: admin`)

    dbConnection.close()
    rl.close()
  } catch (error) {
    console.error('Error creating admin:', error.message)
    process.exit(1)
  }
}

createAdmin()
