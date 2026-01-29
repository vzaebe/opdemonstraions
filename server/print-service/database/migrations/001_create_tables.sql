-- ============================================
-- 001: Create Tables for 3D Print Service
-- ============================================

-- ============================================
-- CORE MODULE
-- ============================================

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK(role IN ('guest', 'user', 'admin', 'superadmin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Sessions (опционально, если не используем только JWT)
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Feature Flags
CREATE TABLE IF NOT EXISTS feature_flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT 1,
  scope TEXT DEFAULT 'global',
  description TEXT,
  metadata_json TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feature_flags_key ON feature_flags(key);

-- Settings (key-value store)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value_json TEXT,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(key);

-- Files (общее хранилище)
CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  path TEXT NOT NULL,
  hash TEXT,
  size INTEGER,
  mime_type TEXT,
  uploaded_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_files_hash ON files(hash);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);

-- ============================================
-- MODELS MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id INTEGER NOT NULL,
  user_id INTEGER,
  format TEXT NOT NULL CHECK(format IN ('STL', '3MF', 'OBJ')),
  unit TEXT DEFAULT 'mm',
  bbox_x REAL,
  bbox_y REAL,
  bbox_z REAL,
  volume REAL,
  surface_area REAL,
  is_watertight BOOLEAN,
  is_manifold BOOLEAN,
  triangle_count INTEGER,
  warnings_json TEXT,
  metadata_json TEXT,
  thumbnail_file_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (thumbnail_file_id) REFERENCES files(id) ON DELETE SET NULL
);

CREATE INDEX idx_models_user_id ON models(user_id);
CREATE INDEX idx_models_file_id ON models(file_id);

-- ============================================
-- PRICING MODULE
-- ============================================

-- Materials
CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK(type IN ('FDM', 'SLA', 'SLS', 'MJF')),
  density REAL NOT NULL,
  price_per_gram REAL NOT NULL,
  available_colors_json TEXT,
  slicer_settings_json TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_materials_type ON materials(type);
CREATE INDEX idx_materials_is_active ON materials(is_active);

-- Printers
CREATE TABLE IF NOT EXISTS printers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('FDM', 'SLA', 'SLS', 'MJF')),
  bed_x REAL NOT NULL,
  bed_y REAL NOT NULL,
  bed_z REAL NOT NULL,
  nozzle_size REAL,
  price_per_hour REAL NOT NULL,
  max_speed REAL,
  supported_materials_json TEXT,
  status TEXT DEFAULT 'available' CHECK(status IN ('available', 'busy', 'maintenance', 'offline')),
  metadata_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_printers_status ON printers(status);
CREATE INDEX idx_printers_type ON printers(type);

-- Print Profiles (качество)
CREATE TABLE IF NOT EXISTS print_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  layer_height REAL NOT NULL,
  infill_default INTEGER DEFAULT 20,
  speed_default REAL,
  supports_default BOOLEAN DEFAULT 0,
  time_multiplier REAL DEFAULT 1.0,
  price_multiplier REAL DEFAULT 1.0,
  slicer_profile_path TEXT,
  metadata_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pricing Rules
CREATE TABLE IF NOT EXISTS pricing_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setup_fee REAL DEFAULT 0,
  labor_rate_per_hour REAL DEFAULT 0,
  labor_fixed REAL DEFAULT 0,
  margin_percent REAL DEFAULT 20,
  min_order_price REAL DEFAULT 500,
  bulk_discount_rules_json TEXT,
  postprocess_options_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quotes (сохраненные расчеты)
CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  model_id INTEGER NOT NULL,
  material_id INTEGER,
  profile_id INTEGER,
  quantity INTEGER DEFAULT 1,
  params_json TEXT,
  instant_result_json TEXT,
  accurate_result_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL,
  FOREIGN KEY (profile_id) REFERENCES print_profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_model_id ON quotes(model_id);

-- ============================================
-- SLICING MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS slicing_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id INTEGER NOT NULL,
  profile_id INTEGER NOT NULL,
  material_id INTEGER,
  params_hash TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  priority INTEGER DEFAULT 0,
  result_json TEXT,
  gcode_file_id INTEGER,
  logs_path TEXT,
  error_message TEXT,
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE,
  FOREIGN KEY (profile_id) REFERENCES print_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL,
  FOREIGN KEY (gcode_file_id) REFERENCES files(id) ON DELETE SET NULL
);

CREATE INDEX idx_slicing_jobs_status ON slicing_jobs(status);
CREATE INDEX idx_slicing_jobs_params_hash ON slicing_jobs(params_hash);
CREATE INDEX idx_slicing_jobs_model_id ON slicing_jobs(model_id);

-- ============================================
-- ORDERS MODULE
-- ============================================

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE,
  user_id INTEGER,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN (
    'pending', 'confirmed', 'in_production', 'printing', 'post_processing',
    'ready', 'shipped', 'completed', 'cancelled', 'refunded'
  )),
  type TEXT DEFAULT 'standard' CHECK(type IN ('standard', '2d_to_3d_request')),
  subtotal REAL NOT NULL,
  shipping_cost REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  total REAL NOT NULL,
  shipping_method_id INTEGER,
  shipping_address_json TEXT,
  tracking_number TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_data_json TEXT,
  comment TEXT,
  internal_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE SET NULL
);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  model_id INTEGER,
  model_snapshot_json TEXT,
  material_id INTEGER,
  profile_id INTEGER,
  quantity INTEGER NOT NULL DEFAULT 1,
  params_json TEXT,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  print_time_estimate_sec INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE SET NULL,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL,
  FOREIGN KEY (profile_id) REFERENCES print_profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_model_id ON order_items(model_id);

-- Order Status History
CREATE TABLE IF NOT EXISTS order_status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  comment TEXT,
  changed_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- Order Messages
CREATE TABLE IF NOT EXISTS order_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  author_type TEXT NOT NULL CHECK(author_type IN ('client', 'admin', 'system')),
  author_user_id INTEGER,
  message TEXT NOT NULL,
  attachments_json TEXT,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_order_messages_order_id ON order_messages(order_id);

-- ============================================
-- PRODUCTION QUEUE MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS production_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_item_id INTEGER NOT NULL,
  printer_id INTEGER,
  status TEXT DEFAULT 'queued' CHECK(status IN (
    'queued', 'assigned', 'printing', 'paused', 'completed', 'failed', 'cancelled'
  )),
  priority INTEGER DEFAULT 0,
  scheduled_at DATETIME,
  started_at DATETIME,
  paused_at DATETIME,
  completed_at DATETIME,
  estimated_duration_sec INTEGER,
  actual_duration_sec INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  FOREIGN KEY (printer_id) REFERENCES printers(id) ON DELETE SET NULL
);

CREATE INDEX idx_production_queue_status ON production_queue(status);
CREATE INDEX idx_production_queue_printer_id ON production_queue(printer_id);
CREATE INDEX idx_production_queue_priority ON production_queue(priority DESC);

-- Production Queue History
CREATE TABLE IF NOT EXISTS production_queue_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  queue_item_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  old_printer_id INTEGER,
  new_printer_id INTEGER,
  comment TEXT,
  changed_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (queue_item_id) REFERENCES production_queue(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_production_queue_history_queue_item_id ON production_queue_history(queue_item_id);

-- ============================================
-- SHIPPING MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS shipping_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'fixed' CHECK(type IN ('fixed', 'zones', 'api')),
  base_price REAL DEFAULT 0,
  zones_json TEXT,
  api_config_json TEXT,
  estimated_days_min INTEGER DEFAULT 1,
  estimated_days_max INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shipping_methods_is_active ON shipping_methods(is_active);

-- ============================================
-- PAYMENT MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS payment_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  provider TEXT NOT NULL,
  transaction_id TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'RUB',
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  metadata_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);

-- ============================================
-- AI MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS ai_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  type TEXT DEFAULT '2d_to_3d' CHECK(type IN ('2d_to_3d', 'model_analysis', 'chat')),
  input_data_json TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'rejected')),
  result_data_json TEXT,
  assigned_to INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_ai_requests_user_id ON ai_requests(user_id);
CREATE INDEX idx_ai_requests_status ON ai_requests(status);

-- ============================================
-- ADMIN MODULE
-- ============================================

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables_json TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_templates_key ON email_templates(key);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  changes_json TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
