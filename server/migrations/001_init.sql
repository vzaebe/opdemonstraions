-- Initial schema (auth + audit + telemetry)
-- Keep it minimal and low-maintenance for a small VPS.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL CHECK(role IN ('admin', 'moderator')),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  at        TEXT    NOT NULL DEFAULT (datetime('now')),
  user_id   INTEGER,
  action    TEXT    NOT NULL,
  entity    TEXT,
  entity_id TEXT,
  meta_json TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_audit_log_at ON audit_log(at);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);

CREATE TABLE IF NOT EXISTS pageviews (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  at       TEXT NOT NULL DEFAULT (datetime('now')),
  path     TEXT NOT NULL,
  referrer TEXT,
  ua       TEXT,
  ip_hash  TEXT
);

CREATE INDEX IF NOT EXISTS idx_pageviews_at ON pageviews(at);
CREATE INDEX IF NOT EXISTS idx_pageviews_path ON pageviews(path);
CREATE INDEX IF NOT EXISTS idx_pageviews_ip_hash ON pageviews(ip_hash);

