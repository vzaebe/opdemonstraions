-- Expand auth model:
-- - add role super_admin
-- - add is_active flag
-- SQLite doesn't allow altering CHECK constraints directly -> recreate table.

PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS users_new (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL CHECK(role IN ('super_admin', 'admin', 'moderator')),
  is_active     INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Copy existing users
INSERT INTO users_new (id, username, password_hash, role, is_active, created_at)
SELECT id, username, password_hash, role, 1, created_at
FROM users;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

-- Keep audit_log foreign keys consistent
PRAGMA foreign_key_check;

COMMIT;
PRAGMA foreign_keys = ON;

