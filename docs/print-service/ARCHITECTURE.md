# Архитектура платформы автоматизации заказов 3D-печати

## 1. Карта модулей и архитектура системы

### 1.1 Выбор технологий Backend

**Выбор: Express.js**

**Обоснование:**
- **Простота и гибкость**: Express позволяет быстро создать модульную архитектуру без избыточных абстракций
- **Совместимость**: В проекте уже используется Express (server/index.js), что обеспечивает консистентность
- **Легковесность**: Для микросервиса с четко определенным API не требуется тяжеловесный фреймворк типа NestJS
- **Экосистема**: Богатая экосистема middleware и инструментов для работы с файлами, очередями, процессами
- **Производительность**: Меньше overhead по сравнению с NestJS для compute-интенсивных задач (слайсинг, парсинг STL)

### 1.2 Модульная архитектура

Система состоит из независимых модулей с четкими границами и контрактами:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Vue 3 SPA)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ 3D Landing   │  │ Calculator   │  │ User Dashboard  │   │
│  │ (3D effects) │  │ (3D Viewer)  │  │ (Orders)        │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Checkout     │  │ 2D→3D Form   │  │ Admin Panel     │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Node.js/Express)                │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              CORE Module (всегда включен)            │   │
│  │  • Auth (JWT, sessions, roles: user/admin/guest)    │   │
│  │  • Users (profiles, contacts)                        │   │
│  │  • Feature Flags (enable/disable modules)            │   │
│  │  • Settings (key-value config store)                 │   │
│  │  • File Storage (private/public, signed URLs)        │   │
│  │  • Events/Outbox (для уведомлений и аудита)         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            MODELS Module (feature: models)           │   │
│  │  • Upload (multipart, URL download, batch)           │   │
│  │  • Parsing (STL/3MF → metadata, bbox, volume)        │   │
│  │  • Validation (watertight, manifold, size limits)    │   │
│  │  • Repair (опционально, hooks для external tools)    │   │
│  │  • Thumbnails (preview generation via jobs)          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           PRICING Module (feature: pricing)          │   │
│  │  • Calculator (instant estimate: эвристика)          │   │
│  │  • Breakdown (материал, время, труд, маржа, доставка)│  │
│  │  • Rules Engine (коэффициенты из БД)                 │   │
│  │  • Bulk/Quantity discounts                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          SLICING Module (feature: slicing)           │   │
│  │  • Profiles (качество, материалы, принтеры)          │   │
│  │  • Jobs Queue (CuraEngine/PrusaSlicer CLI)           │   │
│  │  • Worker Pool (throttling, timeouts, isolation)     │   │
│  │  • Cache (model_hash + profile + params)             │   │
│  │  • Parser (gcode → time/filament/warnings)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            ORDERS Module (feature: orders)           │   │
│  │  • Cart (multi-model, qty per model)                 │   │
│  │  • Checkout (контакты, доставка, оплата)             │   │
│  │  • Orders Management (CRUD, статусы, history)        │   │
│  │  • Messages/Comments (клиент ↔ админ)                │   │
│  │  • Notifications (email hooks)                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      PRODUCTION QUEUE Module (feature: queue)        │   │
│  │  • Queue Management (приоритеты, группировка)        │   │
│  │  • Printer Assignment (автомат + ручное)             │   │
│  │  • Статусы производства (queued/printing/done/fail)  │   │
│  │  • History & Audit (журнал событий)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         SHIPPING Module (feature: shipping)          │   │
│  │  • Methods & Tariffs (фикс/зоны/API adapters)        │   │
│  │  • Tracking (внешние API через адаптеры)             │   │
│  │  • Calculator (интеграция в pricing)                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          PAYMENT Module (feature: payment)           │   │
│  │  • Provider Interface (абстракция)                   │   │
│  │  • Mock Provider (для тестирования)                  │   │
│  │  • Webhooks (обработка событий оплаты)               │   │
│  │  • TODO: реальные провайдеры (Stripe/Robokassa/ЮKassa)│  │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AI Module (feature: ai)                 │   │
│  │  • Provider Interface (OpenAI/Local/Ollama/Disabled) │   │
│  │  • Chat Assistant (контекстный помощник)             │   │
│  │  • Model Analysis (рекомендации по ориентации и т.д.)│   │
│  │  • 2D→3D Generation (заявка + опционально генерация) │   │
│  │  • Feature Flag driven (все методы возвращают         │   │
│  │    "disabled" если ai=false)                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             ADMIN Module (feature: admin)            │   │
│  │  • Dashboard (статистика, KPI)                       │   │
│  │  • Orders Management (статусы, цены, комменты)       │   │
│  │  • Queue Control (назначение, приоритеты)            │   │
│  │  • Settings CRUD (materials/printers/profiles/       │   │
│  │    pricing rules/shipping/email templates)           │   │
│  │  • Feature Flags UI                                  │   │
│  │  • Audit Log                                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  • SQLite3 Database (с миграциями)                           │
│  • File System (models, previews, cache, logs)              │
│  • CuraEngine/PrusaSlicer CLI (external process)            │
│  • Email Service (SMTP/API адаптер)                          │
│  • Optional: External AI Service (HTTP/gRPC)                │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Модульность через Feature Flags

**Таблица feature_flags:**
```sql
CREATE TABLE feature_flags (
  id INTEGER PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT 1,
  scope TEXT DEFAULT 'global', -- global / user_role / user_id
  description TEXT,
  metadata_json TEXT, -- дополнительные настройки
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Стартовые флаги (seed):**
```javascript
const DEFAULT_FLAGS = [
  { key: 'models', enabled: true, description: 'Загрузка и управление 3D-моделями' },
  { key: 'pricing', enabled: true, description: 'Мгновенная оценка стоимости' },
  { key: 'slicing', enabled: false, description: 'Точный расчет через слайсер (требует CuraEngine)' },
  { key: 'orders', enabled: true, description: 'Оформление заказов' },
  { key: 'queue', enabled: true, description: 'Очередь производства' },
  { key: 'shipping', enabled: true, description: 'Расчет доставки' },
  { key: 'payment', enabled: false, description: 'Онлайн-оплата (требует настройки провайдера)' },
  { key: 'ai', enabled: false, description: 'AI-помощник и генерация 3D из 2D' },
  { key: 'admin', enabled: true, description: 'Админ-панель' },
]
```

**Middleware проверки:**
```javascript
function requireFeature(featureKey) {
  return async (req, res, next) => {
    const flag = await db.getFeatureFlag(featureKey)
    if (!flag || !flag.enabled) {
      return res.status(403).json({
        error: 'Feature disabled',
        feature: featureKey,
        message: `Функция "${featureKey}" отключена администратором`
      })
    }
    next()
  }
}

// Использование:
router.post('/api/v1/slicing/submit', requireFeature('slicing'), slicingController.submit)
```

---

## 2. User Flows и диаграммы взаимодействий

### 2.1 Основной flow: Расчет → Заказ

```
┌─────────────┐
│   GUEST     │
│  / USER     │
└──────┬──────┘
       │
       ├─────────────► [Landing Page] 3D-анимации, "Как заказать", CTA
       │
       └─────────────► [Calculator Page]
                       │
                       ├─ Upload STL/3MF (drag&drop или URL)
                       │  └─► POST /api/v1/models/upload
                       │      └─► Парсинг (bbox, volume, area, watertight)
                       │          └─► Возврат model_id, metadata, warnings
                       │
                       ├─ Показать 3D Viewer (Three.js, orbit controls)
                       │
                       ├─ Выбрать параметры:
                       │  • Материал (FDM: PLA/ABS/PETG/TPU + цвет)
                       │  • Качество (slider: Быстро ← → Качество)
                       │  • Количество копий (qty)
                       │  • Advanced: infill %, supports, shells, post-process
                       │
                       ├─ Instant Quote:
                       │  └─► POST /api/v1/pricing/quote
                       │      Body: { model_id, material, quality, qty, advanced_params }
                       │      Response: {
                       │        instant_price: 1250.50,
                       │        estimated_days: 3-5,
                       │        breakdown: {
                       │          material: 450,
                       │          machine_time: 600,
                       │          labor: 100,
                       │          postprocess: 50,
                       │          margin: 50.50
                       │        },
                       │        warnings: ["Модель требует supports"],
                       │        accurate_available: true (если slicing включен)
                       │      }
                       │
                       ├─ [Optional] Accurate Quote (если slicing=true):
                       │  └─► POST /api/v1/slicing/estimate
                       │      └─► Создать slicing job (фоновая задача)
                       │          └─► Worker запускает CuraEngine
                       │              └─► Парсинг gcode → точное время/филамент
                       │                  └─► Обновление quote с accurate_result
                       │                      └─► WebSocket/Polling уведомление UI
                       │
                       ├─ Add to Cart / Order Now
                       │  └─► POST /api/v1/cart/add или сразу /api/v1/orders/create
                       │
                       └─► [Checkout Page]
                           │
                           ├─ Контакты (email, phone, name)
                           ├─ Доставка (выбор метода: самовывоз/курьер/почта)
                           │  └─► GET /api/v1/shipping/methods
                           │      └─► Response: [{ id, name, price, days }]
                           ├─ Оплата (если payment=true):
                           │  └─► POST /api/v1/payment/init
                           │      └─► Redirect на форму оплаты
                           │          └─► Webhook /api/v1/payment/webhook
                           │              └─► Обновление статуса заказа
                           ├─ Комментарий (optional)
                           │
                           └─► POST /api/v1/orders/create
                               Body: { items, contacts, shipping, payment_method, comment }
                               Response: { order_id, order_number, status, total }
                               │
                               └─► Email уведомление клиенту и админу
                                   └─► Redirect на [Order Confirmation]
                                       └─► Показать order_number, статус, ETA

┌──────────────────────────────────────────────────────────────┐
│                      USER DASHBOARD                          │
│  • Список заказов (номер, статус, дата, цена)              │
│  • Детали заказа:                                            │
│    - Items (модели, qty, параметры, preview)                │
│    - Статусы с историей и датами                             │
│    - Трек-номер (если есть)                                  │
│    - Сообщения (двусторонняя переписка с админом)           │
│    - Кнопки: Скачать модели, Повторить заказ                │
│  • 2D→3D Request Form (если ai=true):                        │
│    - Upload image + description                              │
│    - POST /api/v1/ai/generate-3d-request                     │
│      → Создать order с типом "2d_to_3d_request"             │
│      → Админ получает уведомление                            │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Admin Flow: Управление заказами и очередью

```
┌─────────────┐
│   ADMIN     │
└──────┬──────┘
       │
       └─────────────► [Admin Dashboard]
                       │
                       ├─ KPI виджеты:
                       │  • Новые заказы (за сегодня/неделю)
                       │  • Средний чек
                       │  • Загрузка очереди (часов печати)
                       │  • Топ материалы/принтеры
                       │
                       ├─ [Orders Management]
                       │  │
                       │  ├─ Таблица заказов (фильтры по статусу, дате, клиенту)
                       │  │  └─► GET /api/v1/admin/orders?status=pending&sort=created_at
                       │  │
                       │  ├─ Детали заказа:
                       │  │  • Просмотр всех данных
                       │  │  • Изменение статуса
                       │  │  • Ручная корректировка цены
                       │  │  • Добавление трек-номера
                       │  │  • Сообщения с клиентом
                       │  │  └─► PUT /api/v1/admin/orders/:id
                       │  │
                       │  └─ Массовые действия (экспорт, печать накладных)
                       │
                       ├─ [Production Queue]
                       │  │
                       │  ├─ Список работ:
                       │  │  • Фильтры: статус, принтер, материал, приоритет
                       │  │  • Сортировка: дата, приоритет, время печати
                       │  │  └─► GET /api/v1/admin/queue?printer_id=&status=queued
                       │  │
                       │  ├─ Карточка работы:
                       │  │  • order_item_id, model preview, параметры
                       │  │  • Назначение принтера (dropdown)
                       │  │  • Изменение приоритета (drag&drop или number input)
                       │  │  • Scheduled date/time
                       │  │  • Старт/Пауза/Завершение/Отмена
                       │  │  └─► PUT /api/v1/admin/queue/:id
                       │  │
                       │  ├─ Группировка:
                       │  │  • По принтеру (показать загрузку)
                       │  │  • По материалу (показать остатки филамента)
                       │  │  • "Что печатать дальше" (рекомендации AI optional)
                       │  │
                       │  └─ История (audit log):
                       │     └─► GET /api/v1/admin/queue/history?item_id=
                       │
                       ├─ [Settings]
                       │  │
                       │  ├─ Materials & Colors:
                       │  │  └─► CRUD /api/v1/admin/materials
                       │  │      Fields: name, type (FDM/SLA/MJF), density, price_per_g,
                       │  │              available_colors_json, slicer_settings_json
                       │  │
                       │  ├─ Printers:
                       │  │  └─► CRUD /api/v1/admin/printers
                       │  │      Fields: name, type, bed_x/y/z, nozzle_size, price_per_hour,
                       │  │              max_speed, supported_materials_json, status
                       │  │
                       │  ├─ Print Profiles (Quality):
                       │  │  └─► CRUD /api/v1/admin/profiles
                       │  │      Fields: name (Draft/Standard/Fine), layer_height, speed,
                       │  │              infill_default, supports_default, time_multiplier,
                       │  │              price_multiplier, slicer_profile_path
                       │  │
                       │  ├─ Pricing Rules:
                       │  │  └─► PUT /api/v1/admin/pricing-rules
                       │  │      Fields: setup_fee, labor_rate_per_hour, margin_percent,
                       │  │              min_order_price, bulk_discount_rules_json,
                       │  │              postprocess_options_json
                       │  │
                       │  ├─ Shipping Methods:
                       │  │  └─► CRUD /api/v1/admin/shipping
                       │  │      Fields: name, type (fixed/zones/api), base_price,
                       │  │              zones_json, api_config_json, estimated_days
                       │  │
                       │  ├─ Email Templates:
                       │  │  └─► CRUD /api/v1/admin/email-templates
                       │  │      Templates: order_created, order_status_changed,
                       │  │                  order_shipped, payment_received, etc.
                       │  │
                       │  ├─ Feature Flags:
                       │  │  └─► GET/PUT /api/v1/admin/feature-flags
                       │  │      Toggle: models, pricing, slicing, orders, queue,
                       │  │              shipping, payment, ai, admin
                       │  │
                       │  └─ AI Settings (если ai=true):
                       │     └─► PUT /api/v1/admin/ai-settings
                       │         Fields: provider (openai/local/ollama), api_key,
                       │                 model_name, temperature, max_tokens
                       │
                       └─ [Audit Log]
                          └─► GET /api/v1/admin/audit?user_id=&action=&date_from=
```

### 2.3 AI Module Flow (опционально, feature flag driven)

```
[Client] → Check feature flag 'ai'
           │
           ├─ If ai=false:
           │  └─► UI скрывает AI-кнопки и формы
           │      API возвращает 403 "Feature disabled"
           │
           └─ If ai=true:
              │
              ├─ Chat Assistant:
              │  └─► POST /api/v1/ai/chat
              │      Body: { message, context: { model_id?, order_id? } }
              │      Response: { reply, suggestions? }
              │      (контекст: "Как уменьшить стоимость?", "Какой материал лучше?")
              │
              ├─ Model Analysis:
              │  └─► POST /api/v1/ai/analyze-model
              │      Body: { model_id }
              │      Response: {
              │        warnings: ["Тонкие стенки < 1mm"],
              │        recommendations: ["Повернуть на 45° для уменьшения supports"],
              │        optimizations: ["Уменьшить infill до 15% без потери прочности"]
              │      }
              │
              └─ 2D→3D Generation Request:
                 └─► POST /api/v1/ai/generate-3d-request
                     Body: { image_file, description, reference_images? }
                     Response: { request_id, status: "pending_review" }
                     │
                     └─► Админ получает уведомление
                         └─► Админ загружает сгенерированную модель или отклоняет
                             └─► PUT /api/v1/admin/ai-requests/:id/fulfill
                                 Body: { model_file, comment }
                                 └─► Email клиенту с моделью
```

---

## 3. Схема базы данных

### 3.1 Таблицы (SQLite3, миграции)

**CORE MODULE:**

```sql
-- users
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- NULL для guest-конверсии
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK(role IN ('guest', 'user', 'admin', 'superadmin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- sessions (JWT alternative: можно использовать JWT + refresh tokens в БД)
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- feature_flags
CREATE TABLE feature_flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT 1,
  scope TEXT DEFAULT 'global',
  description TEXT,
  metadata_json TEXT, -- JSON
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_feature_flags_key ON feature_flags(key);

-- settings (key-value store для конфигов)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value_json TEXT, -- JSON
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_settings_key ON settings(key);

-- files (общее хранилище файлов)
CREATE TABLE files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL, -- UUID + ext
  path TEXT NOT NULL, -- относительный путь от storage root
  hash TEXT, -- SHA256 для дедупликации
  size INTEGER, -- bytes
  mime_type TEXT,
  uploaded_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX idx_files_hash ON files(hash);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
```

**MODELS MODULE:**

```sql
-- models (3D модели)
CREATE TABLE models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id INTEGER NOT NULL,
  user_id INTEGER,
  format TEXT NOT NULL CHECK(format IN ('STL', '3MF', 'OBJ')), -- расширяемо
  unit TEXT DEFAULT 'mm',
  bbox_x REAL, bbox_y REAL, bbox_z REAL, -- bounding box, mm
  volume REAL, -- mm³
  surface_area REAL, -- mm²
  is_watertight BOOLEAN,
  is_manifold BOOLEAN,
  triangle_count INTEGER,
  warnings_json TEXT, -- JSON массив предупреждений
  metadata_json TEXT, -- JSON (цвета для 3MF, и т.д.)
  thumbnail_file_id INTEGER, -- preview image
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (thumbnail_file_id) REFERENCES files(id) ON DELETE SET NULL
);
CREATE INDEX idx_models_user_id ON models(user_id);
CREATE INDEX idx_models_file_id ON models(file_id);
```

**PRICING MODULE:**

```sql
-- materials
CREATE TABLE materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK(type IN ('FDM', 'SLA', 'SLS', 'MJF')),
  density REAL NOT NULL, -- g/cm³
  price_per_gram REAL NOT NULL,
  available_colors_json TEXT, -- JSON ["Red", "Blue", ...]
  slicer_settings_json TEXT, -- JSON (температура, скорость и т.д.)
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_materials_type ON materials(type);
CREATE INDEX idx_materials_is_active ON materials(is_active);

-- printers
CREATE TABLE printers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('FDM', 'SLA', 'SLS', 'MJF')),
  bed_x REAL NOT NULL, bed_y REAL NOT NULL, bed_z REAL NOT NULL, -- mm
  nozzle_size REAL, -- mm (для FDM)
  price_per_hour REAL NOT NULL,
  max_speed REAL, -- mm/s
  supported_materials_json TEXT, -- JSON [material_ids]
  status TEXT DEFAULT 'available' CHECK(status IN ('available', 'busy', 'maintenance', 'offline')),
  metadata_json TEXT, -- JSON (доп. характеристики)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_printers_status ON printers(status);
CREATE INDEX idx_printers_type ON printers(type);

-- print_profiles (качество)
CREATE TABLE print_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE, -- "Draft", "Standard", "Fine"
  layer_height REAL NOT NULL, -- mm
  infill_default INTEGER DEFAULT 20, -- %
  speed_default REAL, -- mm/s
  supports_default BOOLEAN DEFAULT 0,
  time_multiplier REAL DEFAULT 1.0, -- для эвристики
  price_multiplier REAL DEFAULT 1.0,
  slicer_profile_path TEXT, -- путь к файлу профиля CuraEngine
  metadata_json TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- pricing_rules (единая таблица правил)
CREATE TABLE pricing_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setup_fee REAL DEFAULT 0, -- фикс. стоимость на заказ
  labor_rate_per_hour REAL DEFAULT 0,
  labor_fixed REAL DEFAULT 0, -- фикс. труд на деталь
  margin_percent REAL DEFAULT 15,
  min_order_price REAL DEFAULT 500,
  bulk_discount_rules_json TEXT, -- JSON [{ qty_from, discount_percent }]
  postprocess_options_json TEXT, -- JSON [{ name, price, days }]
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Одна строка в таблице (singleton pattern или версионирование)

-- quotes (сохраненные расчеты)
CREATE TABLE quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  model_id INTEGER NOT NULL,
  material_id INTEGER,
  profile_id INTEGER,
  quantity INTEGER DEFAULT 1,
  params_json TEXT, -- JSON (infill, supports, color, и т.д.)
  instant_result_json TEXT, -- JSON {price, time, breakdown}
  accurate_result_json TEXT, -- JSON {price, time, breakdown, slicing_job_id}
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL,
  FOREIGN KEY (profile_id) REFERENCES print_profiles(id) ON DELETE SET NULL
);
CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_model_id ON quotes(model_id);
```

**SLICING MODULE:**

```sql
-- slicing_jobs
CREATE TABLE slicing_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  model_id INTEGER NOT NULL,
  profile_id INTEGER NOT NULL,
  material_id INTEGER,
  params_hash TEXT NOT NULL, -- SHA256(model + profile + params) для кеша
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  priority INTEGER DEFAULT 0,
  result_json TEXT, -- JSON {print_time_sec, filament_g, filament_length_mm, warnings}
  gcode_file_id INTEGER, -- опционально сохранять gcode
  logs_path TEXT, -- путь к логам слайсера
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
```

**ORDERS MODULE:**

```sql
-- orders
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE, -- человеко-читаемый номер (например, OP-2026-00001)
  user_id INTEGER,
  email TEXT NOT NULL, -- может быть guest
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
  shipping_address_json TEXT, -- JSON
  tracking_number TEXT,
  payment_method TEXT, -- 'mock', 'stripe', 'cash', и т.д.
  payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_data_json TEXT, -- JSON (transaction_id и т.д.)
  comment TEXT,
  internal_notes TEXT, -- только для админа
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE SET NULL
);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- order_items
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  model_id INTEGER,
  model_snapshot_json TEXT, -- JSON snapshot модели на момент заказа (bbox, volume и т.д.)
  material_id INTEGER,
  profile_id INTEGER,
  quantity INTEGER NOT NULL DEFAULT 1,
  params_json TEXT, -- JSON (color, infill, supports и т.д.)
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

-- order_status_history
CREATE TABLE order_status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  comment TEXT,
  changed_by INTEGER, -- admin user_id
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- order_messages (двусторонняя переписка)
CREATE TABLE order_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  author_type TEXT NOT NULL CHECK(author_type IN ('client', 'admin', 'system')),
  author_user_id INTEGER,
  message TEXT NOT NULL,
  attachments_json TEXT, -- JSON [file_ids]
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX idx_order_messages_order_id ON order_messages(order_id);
```

**PRODUCTION QUEUE MODULE:**

```sql
-- production_queue
CREATE TABLE production_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_item_id INTEGER NOT NULL,
  printer_id INTEGER,
  status TEXT DEFAULT 'queued' CHECK(status IN (
    'queued', 'assigned', 'printing', 'paused', 'completed', 'failed', 'cancelled'
  )),
  priority INTEGER DEFAULT 0, -- выше = важнее
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

-- production_queue_history (журнал событий)
CREATE TABLE production_queue_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  queue_item_id INTEGER NOT NULL,
  event_type TEXT NOT NULL, -- 'assigned', 'started', 'paused', 'resumed', 'completed', 'failed', 'cancelled'
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
```

**SHIPPING MODULE:**

```sql
-- shipping_methods
CREATE TABLE shipping_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'fixed' CHECK(type IN ('fixed', 'zones', 'api')),
  base_price REAL DEFAULT 0,
  zones_json TEXT, -- JSON [{ name, price, regions }]
  api_config_json TEXT, -- JSON (api_key, endpoint, и т.д.)
  estimated_days_min INTEGER DEFAULT 1,
  estimated_days_max INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_shipping_methods_is_active ON shipping_methods(is_active);
```

**PAYMENT MODULE:**

```sql
-- payment_transactions
CREATE TABLE payment_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  provider TEXT NOT NULL, -- 'mock', 'stripe', 'robokassa', и т.д.
  transaction_id TEXT, -- ID транзакции у провайдера
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'RUB',
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  metadata_json TEXT, -- JSON (доп. данные провайдера)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);
```

**AI MODULE:**

```sql
-- ai_requests (2D→3D заявки)
CREATE TABLE ai_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  type TEXT DEFAULT '2d_to_3d' CHECK(type IN ('2d_to_3d', 'model_analysis', 'chat')),
  input_data_json TEXT, -- JSON (image_file_ids, description, и т.д.)
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'rejected')),
  result_data_json TEXT, -- JSON (model_id, suggestions, и т.д.)
  assigned_to INTEGER, -- admin user_id
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX idx_ai_requests_user_id ON ai_requests(user_id);
CREATE INDEX idx_ai_requests_status ON ai_requests(status);
```

**ADMIN MODULE:**

```sql
-- email_templates
CREATE TABLE email_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE, -- 'order_created', 'order_status_changed', и т.д.
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables_json TEXT, -- JSON массив доступных переменных ({{ order_number }}, {{ name }}, и т.д.)
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_email_templates_key ON email_templates(key);

-- audit_log
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL, -- 'update_order', 'change_feature_flag', 'delete_material', и т.д.
  entity_type TEXT, -- 'order', 'material', 'printer', и т.д.
  entity_id INTEGER,
  changes_json TEXT, -- JSON (old_value, new_value)
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

---

*Продолжение следует в следующем файле (API спецификация)...*

**TODO для владельца бизнеса:**
1. Уточнить стартовые данные материалов: плотность, цены за грамм, доступные цвета
2. Уточнить тарифы принтеров: цена/час, характеристики принтеров
3. Уточнить коэффициенты качества и их влияние на время/цену
4. Уточнить трудозатраты и варианты постобработки
5. Уточнить правила доставки (зоны, тарифы) или интеграцию с API доставки
6. Уточнить провайдера оплаты и его настройки
