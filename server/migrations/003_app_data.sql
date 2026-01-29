-- Store site content data (previously server/data.json) inside SQLite.
-- We keep it as a single JSON blob to stay simple and avoid over-engineering.

CREATE TABLE IF NOT EXISTS app_kv (
  key        TEXT PRIMARY KEY,
  json       TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_app_kv_updated_at ON app_kv(updated_at);

