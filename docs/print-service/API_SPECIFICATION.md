# API Specification - 3D Print Service

## Общие принципы

- **Base URL**: `/api/v1`
- **Аутентификация**: JWT Bearer Token в заголовке `Authorization: Bearer <token>`
- **Content-Type**: `application/json` (кроме file uploads: `multipart/form-data`)
- **Responses**:
  - Success: `200 OK`, `201 Created`, `204 No Content`
  - Errors: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

**Стандартная структура ошибки:**
```json
{
  "error": "Error type",
  "message": "Human-readable message",
  "details": { /* optional additional info */ }
}
```

---

## 1. CORE Module

### 1.1 Authentication

#### POST `/auth/register`
Регистрация нового пользователя

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "Иван Иванов",
  "phone": "+79991234567"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Иван Иванов",
    "role": "user"
  },
  "token": "eyJhbGci..."
}
```

---

#### POST `/auth/login`
Вход пользователя

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Иван Иванов",
    "role": "user"
  },
  "token": "eyJhbGci..."
}
```

---

#### POST `/auth/guest`
Создание гостевой сессии (для анонимного расчета и заказа)

**Request:**
```json
{
  "email": "guest@temp.com" // optional
}
```

**Response (201):**
```json
{
  "user": {
    "id": 2,
    "email": "guest_abc123@temp.com",
    "role": "guest"
  },
  "token": "eyJhbGci..."
}
```

---

#### POST `/auth/logout`
Выход из системы (опционально: инвалидация токена)

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No Content

---

#### GET `/auth/me`
Получить текущего пользователя

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Иван Иванов",
  "phone": "+79991234567",
  "role": "user",
  "created_at": "2026-01-10T12:00:00Z"
}
```

---

### 1.2 Feature Flags

#### GET `/feature-flags`
Получить список всех feature flags (публичный endpoint)

**Response (200):**
```json
{
  "flags": {
    "models": true,
    "pricing": true,
    "slicing": false,
    "orders": true,
    "queue": true,
    "shipping": true,
    "payment": false,
    "ai": false
  }
}
```

---

## 2. MODELS Module

### 2.1 Upload

#### POST `/models/upload`
Загрузить 3D-модель (одиночная или пакетная)

**Headers:**
- `Authorization: Bearer <token>` (optional для guest)
- `Content-Type: multipart/form-data`

**Request (multipart):**
```
files[]: File (STL/3MF)
```

**Response (201):**
```json
{
  "models": [
    {
      "id": 1,
      "file_id": 10,
      "format": "STL",
      "bbox": { "x": 100, "y": 80, "z": 50 },
      "volume": 125000,
      "surface_area": 35000,
      "is_watertight": true,
      "is_manifold": true,
      "warnings": [],
      "thumbnail_url": "/api/v1/files/10/preview"
    }
  ]
}
```

**Errors:**
- `400`: Invalid file format, file too large (> 100 MB)
- `422`: Model validation failed (non-manifold, zero volume, etc.)

---

#### POST `/models/upload-url`
Загрузить модель по URL

**Request:**
```json
{
  "url": "https://example.com/model.stl"
}
```

**Response (201):** Same as `/models/upload`

---

### 2.2 Model Info

#### GET `/models/:id`
Получить информацию о модели

**Response (200):**
```json
{
  "id": 1,
  "file_id": 10,
  "format": "STL",
  "unit": "mm",
  "bbox": { "x": 100, "y": 80, "z": 50 },
  "volume": 125000,
  "surface_area": 35000,
  "is_watertight": true,
  "is_manifold": true,
  "triangle_count": 15000,
  "warnings": ["Thin walls < 1mm detected"],
  "metadata": {},
  "thumbnail_url": "/api/v1/files/10/preview",
  "download_url": "/api/v1/models/1/download",
  "created_at": "2026-01-10T12:00:00Z"
}
```

---

#### GET `/models/:id/download`
Скачать исходный файл модели

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Binary file with correct MIME type

---

#### POST `/models/:id/validate`
Запустить углубленную валидацию (если модуль включен)

**Response (200):**
```json
{
  "is_valid": true,
  "issues": [
    { "type": "warning", "message": "Thin wall at triangle 1234" }
  ],
  "auto_repair_available": true
}
```

---

## 3. PRICING Module

### 3.1 Materials & Profiles

#### GET `/materials`
Получить список доступных материалов

**Query params:**
- `type`: FDM/SLA/SLS (optional)
- `active_only`: true/false (default: true)

**Response (200):**
```json
{
  "materials": [
    {
      "id": 1,
      "name": "PLA",
      "type": "FDM",
      "density": 1.24,
      "price_per_gram": 0.05,
      "available_colors": ["White", "Black", "Red", "Blue", "Green"],
      "is_active": true
    }
  ]
}
```

---

#### GET `/profiles`
Получить список профилей качества

**Response (200):**
```json
{
  "profiles": [
    {
      "id": 1,
      "name": "Draft",
      "layer_height": 0.3,
      "infill_default": 15,
      "time_multiplier": 0.6,
      "price_multiplier": 0.8
    },
    {
      "id": 2,
      "name": "Standard",
      "layer_height": 0.2,
      "infill_default": 20,
      "time_multiplier": 1.0,
      "price_multiplier": 1.0
    },
    {
      "id": 3,
      "name": "Fine",
      "layer_height": 0.1,
      "infill_default": 20,
      "time_multiplier": 2.0,
      "price_multiplier": 1.5
    }
  ]
}
```

---

### 3.2 Quote Calculation

#### POST `/pricing/quote`
Мгновенный расчет стоимости (instant estimate)

**Request:**
```json
{
  "model_id": 1,
  "material_id": 1,
  "profile_id": 2,
  "quantity": 1,
  "color": "Black",
  "params": {
    "infill": 20,
    "supports": true,
    "shells": 3,
    "postprocess": "none"
  }
}
```

**Response (200):**
```json
{
  "quote_id": 10,
  "instant_estimate": {
    "price": 1250.50,
    "estimated_days": "3-5",
    "breakdown": {
      "material": 450.00,
      "machine_time": 600.00,
      "labor": 100.00,
      "postprocess": 0,
      "margin": 100.50,
      "subtotal": 1250.50
    },
    "details": {
      "weight_grams": 9000,
      "print_time_hours": 12,
      "volume_cm3": 125
    }
  },
  "warnings": [
    "Модель требует supports (автоматически включены)"
  ],
  "accurate_available": true
}
```

**Errors:**
- `400`: Invalid parameters
- `404`: Model or material not found
- `422`: Model exceeds printer bed size

---

#### POST `/pricing/quote/accurate`
Запросить точный расчет через слайсер (требует feature flag `slicing=true`)

**Request:**
```json
{
  "quote_id": 10
}
```

**Response (202 Accepted):**
```json
{
  "slicing_job_id": 5,
  "status": "pending",
  "message": "Slicing job queued. Poll /slicing/jobs/5 for updates."
}
```

---

## 4. SLICING Module

### 4.1 Jobs

#### GET `/slicing/jobs/:id`
Получить статус задачи слайсинга

**Response (200):**
```json
{
  "id": 5,
  "status": "completed",
  "result": {
    "print_time_sec": 43200,
    "print_time_formatted": "12h 00m",
    "filament_grams": 9500,
    "filament_length_mm": 3160000,
    "warnings": ["Support material required: 50g"]
  },
  "updated_estimate": {
    "price": 1300.00,
    "breakdown": {
      "material": 475.00,
      "machine_time": 620.00,
      "labor": 105.00,
      "margin": 100.00,
      "subtotal": 1300.00
    }
  },
  "started_at": "2026-01-10T12:00:00Z",
  "completed_at": "2026-01-10T12:02:30Z"
}
```

**Status values:** `pending`, `running`, `completed`, `failed`, `cancelled`

---

#### GET `/slicing/profiles`
Получить список профилей слайсера (админская информация)

**Response (200):**
```json
{
  "profiles": [
    {
      "id": 1,
      "name": "Draft",
      "slicer": "CuraEngine",
      "profile_path": "/profiles/draft_pla.json"
    }
  ]
}
```

---

## 5. ORDERS Module

### 5.1 Cart (опционально, можно создавать заказ напрямую)

#### POST `/cart/add`
Добавить в корзину

**Request:**
```json
{
  "quote_id": 10
}
```

**Response (200):**
```json
{
  "cart": {
    "items": [
      {
        "id": 1,
        "model_id": 1,
        "material_id": 1,
        "profile_id": 2,
        "quantity": 1,
        "price": 1250.50,
        "thumbnail_url": "/api/v1/files/10/preview"
      }
    ],
    "total": 1250.50
  }
}
```

---

### 5.2 Orders

#### POST `/orders/create`
Создать заказ (из корзины или напрямую из quote)

**Request:**
```json
{
  "items": [
    {
      "model_id": 1,
      "material_id": 1,
      "profile_id": 2,
      "quantity": 2,
      "params": { "color": "Black", "infill": 20, "supports": true }
    }
  ],
  "contacts": {
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+79991234567"
  },
  "shipping": {
    "method_id": 1,
    "address": {
      "city": "Москва",
      "street": "ул. Примерная, д. 1",
      "apartment": "кв. 10",
      "postal_code": "123456"
    }
  },
  "payment_method": "mock",
  "comment": "Срочно, пожалуйста"
}
```

**Response (201):**
```json
{
  "order": {
    "id": 100,
    "order_number": "OP-2026-00100",
    "status": "pending",
    "subtotal": 2501.00,
    "shipping_cost": 300,
    "total": 2801.00,
    "estimated_delivery": "2026-01-15 - 2026-01-17",
    "created_at": "2026-01-10T12:00:00Z"
  }
}
```

---

#### GET `/orders`
Получить список заказов текущего пользователя

**Query params:**
- `status`: pending/confirmed/shipped/etc. (optional)
- `limit`: default 20
- `offset`: default 0

**Response (200):**
```json
{
  "orders": [
    {
      "id": 100,
      "order_number": "OP-2026-00100",
      "status": "in_production",
      "total": 2801.00,
      "created_at": "2026-01-10T12:00:00Z"
    }
  ],
  "total_count": 5
}
```

---

#### GET `/orders/:id`
Получить детали заказа

**Response (200):**
```json
{
  "id": 100,
  "order_number": "OP-2026-00100",
  "status": "in_production",
  "type": "standard",
  "items": [
    {
      "id": 1,
      "model": {
        "id": 1,
        "name": "model.stl",
        "thumbnail_url": "/api/v1/files/10/preview"
      },
      "material": { "id": 1, "name": "PLA", "color": "Black" },
      "profile": { "id": 2, "name": "Standard" },
      "quantity": 2,
      "unit_price": 1250.50,
      "total_price": 2501.00
    }
  ],
  "contacts": {
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+79991234567"
  },
  "shipping": {
    "method": "Курьерская доставка",
    "address": { "city": "Москва", "street": "...", "apartment": "..." },
    "cost": 300,
    "tracking_number": null
  },
  "payment": {
    "method": "mock",
    "status": "pending"
  },
  "subtotal": 2501.00,
  "shipping_cost": 300,
  "discount": 0,
  "total": 2801.00,
  "status_history": [
    { "status": "pending", "created_at": "2026-01-10T12:00:00Z" },
    { "status": "confirmed", "created_at": "2026-01-10T13:00:00Z" },
    { "status": "in_production", "created_at": "2026-01-10T14:00:00Z" }
  ],
  "created_at": "2026-01-10T12:00:00Z",
  "updated_at": "2026-01-10T14:00:00Z"
}
```

---

### 5.3 Order Messages

#### GET `/orders/:id/messages`
Получить сообщения по заказу

**Response (200):**
```json
{
  "messages": [
    {
      "id": 1,
      "author_type": "client",
      "author_name": "Иван Иванов",
      "message": "Можно ли ускорить производство?",
      "created_at": "2026-01-10T15:00:00Z"
    },
    {
      "id": 2,
      "author_type": "admin",
      "author_name": "Менеджер",
      "message": "Постараемся сделать за 2 дня.",
      "created_at": "2026-01-10T15:30:00Z"
    }
  ]
}
```

---

#### POST `/orders/:id/messages`
Отправить сообщение по заказу

**Request:**
```json
{
  "message": "Спасибо!"
}
```

**Response (201):**
```json
{
  "id": 3,
  "author_type": "client",
  "message": "Спасибо!",
  "created_at": "2026-01-10T16:00:00Z"
}
```

---

## 6. SHIPPING Module

#### GET `/shipping/methods`
Получить доступные методы доставки

**Query params:**
- `address_json`: JSON с адресом (для расчета стоимости по зонам/API)

**Response (200):**
```json
{
  "methods": [
    {
      "id": 1,
      "name": "Самовывоз",
      "price": 0,
      "estimated_days": "1-2"
    },
    {
      "id": 2,
      "name": "Курьерская доставка (Москва)",
      "price": 300,
      "estimated_days": "1-3"
    },
    {
      "id": 3,
      "name": "Почта России",
      "price": 450,
      "estimated_days": "5-10"
    }
  ]
}
```

---

## 7. PAYMENT Module

#### POST `/payment/init`
Инициализация оплаты (требует feature flag `payment=true`)

**Request:**
```json
{
  "order_id": 100,
  "provider": "mock",
  "return_url": "https://example.com/orders/100/payment-result"
}
```

**Response (200):**
```json
{
  "transaction_id": "txn_abc123",
  "redirect_url": "https://payment-provider.com/pay?token=xyz",
  "status": "pending"
}
```

---

#### POST `/payment/webhook`
Webhook для обработки событий оплаты (вызывается провайдером)

**Request:** Provider-specific payload

**Response (200):**
```json
{
  "status": "ok"
}
```

---

## 8. AI Module

### 8.1 Chat Assistant

#### POST `/ai/chat`
Чат с AI-помощником (требует feature flag `ai=true`)

**Request:**
```json
{
  "message": "Как уменьшить стоимость печати?",
  "context": {
    "model_id": 1,
    "quote_id": 10
  }
}
```

**Response (200):**
```json
{
  "reply": "Вы можете уменьшить стоимость, снизив infill до 10-15% (прочность останется достаточной для этой модели) и выбрав профиль 'Draft' вместо 'Standard'. Это сократит время печати на 40%.",
  "suggestions": [
    { "action": "change_infill", "value": 15 },
    { "action": "change_profile", "value": 1 }
  ]
}
```

**Errors:**
- `403`: Feature disabled

---

### 8.2 Model Analysis

#### POST `/ai/analyze-model`
Анализ модели через AI (требует feature flag `ai=true`)

**Request:**
```json
{
  "model_id": 1
}
```

**Response (200):**
```json
{
  "warnings": [
    "Обнаружены тонкие стенки < 0.8mm на высоте 25mm"
  ],
  "recommendations": [
    "Поверните модель на 45° вдоль оси X для уменьшения supports",
    "Увеличьте толщину стенок до 1.2mm для прочности"
  ],
  "optimizations": [
    "Уменьшите infill до 15% без потери функциональности"
  ]
}
```

---

### 8.3 2D→3D Generation

#### POST `/ai/generate-3d-request`
Создать заявку на генерацию 3D-модели из 2D-изображения (требует feature flag `ai=true`)

**Headers:** `Content-Type: multipart/form-data`

**Request (multipart):**
```
image: File
description: "Фигурка персонажа, высота 15 см"
reference_images[]: File (optional)
```

**Response (201):**
```json
{
  "request_id": 50,
  "status": "pending_review",
  "message": "Ваша заявка отправлена менеджеру. Мы свяжемся с вами в течение 24 часов."
}
```

---

## 9. ADMIN Module

### 9.1 Orders Management

#### GET `/admin/orders`
Получить список всех заказов (требует роль `admin`)

**Query params:**
- `status`: (optional)
- `date_from`, `date_to`: (optional)
- `search`: поиск по номеру заказа, email, имени
- `limit`, `offset`

**Response (200):**
```json
{
  "orders": [
    {
      "id": 100,
      "order_number": "OP-2026-00100",
      "status": "in_production",
      "customer": "ivan@example.com",
      "total": 2801.00,
      "created_at": "2026-01-10T12:00:00Z"
    }
  ],
  "total_count": 150
}
```

---

#### PUT `/admin/orders/:id`
Обновить заказ (статус, цену, трек-номер и т.д.)

**Request:**
```json
{
  "status": "shipped",
  "tracking_number": "RU123456789",
  "internal_notes": "Упаковано с дополнительной защитой"
}
```

**Response (200):**
```json
{
  "id": 100,
  "order_number": "OP-2026-00100",
  "status": "shipped",
  "tracking_number": "RU123456789",
  "updated_at": "2026-01-11T10:00:00Z"
}
```

---

### 9.2 Production Queue

#### GET `/admin/queue`
Получить список работ в очереди производства

**Query params:**
- `status`: queued/assigned/printing/etc.
- `printer_id`: (optional)
- `material_id`: (optional)
- `sort`: priority/scheduled_at/created_at

**Response (200):**
```json
{
  "queue": [
    {
      "id": 1,
      "order_item": {
        "order_number": "OP-2026-00100",
        "model_name": "model.stl",
        "thumbnail_url": "/api/v1/files/10/preview"
      },
      "printer": { "id": 1, "name": "Prusa MK4" },
      "status": "queued",
      "priority": 5,
      "estimated_duration_sec": 43200,
      "scheduled_at": null,
      "created_at": "2026-01-10T14:00:00Z"
    }
  ]
}
```

---

#### PUT `/admin/queue/:id`
Обновить работу в очереди (назначить принтер, изменить приоритет, статус)

**Request:**
```json
{
  "printer_id": 1,
  "priority": 10,
  "status": "printing",
  "scheduled_at": "2026-01-11T09:00:00Z"
}
```

**Response (200):**
```json
{
  "id": 1,
  "printer_id": 1,
  "priority": 10,
  "status": "printing",
  "started_at": "2026-01-11T09:00:00Z",
  "updated_at": "2026-01-11T09:00:00Z"
}
```

---

### 9.3 Settings CRUD

#### GET `/admin/materials`
Получить список всех материалов (включая неактивные)

**Response (200):**
```json
{
  "materials": [
    {
      "id": 1,
      "name": "PLA",
      "type": "FDM",
      "density": 1.24,
      "price_per_gram": 0.05,
      "available_colors": ["White", "Black", "Red"],
      "is_active": true
    }
  ]
}
```

---

#### POST `/admin/materials`
Создать материал

**Request:**
```json
{
  "name": "PETG",
  "type": "FDM",
  "density": 1.27,
  "price_per_gram": 0.08,
  "available_colors": ["Natural", "Black"],
  "slicer_settings": { "temp": 240, "bed_temp": 80 }
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "PETG",
  "...": "..."
}
```

---

#### PUT `/admin/materials/:id`
Обновить материал

**Request:** Same as POST

**Response (200):** Updated material

---

#### DELETE `/admin/materials/:id`
Удалить материал (или деактивировать, если используется в заказах)

**Response (204):** No Content

---

*(Аналогичные CRUD-эндпоинты для `/admin/printers`, `/admin/profiles`, `/admin/shipping`, `/admin/email-templates`)*

---

### 9.4 Feature Flags

#### GET `/admin/feature-flags`
Получить список всех feature flags

**Response (200):**
```json
{
  "flags": [
    {
      "id": 1,
      "key": "slicing",
      "enabled": false,
      "description": "Точный расчет через слайсер",
      "updated_at": "2026-01-10T10:00:00Z"
    }
  ]
}
```

---

#### PUT `/admin/feature-flags/:key`
Обновить feature flag

**Request:**
```json
{
  "enabled": true
}
```

**Response (200):**
```json
{
  "key": "slicing",
  "enabled": true,
  "updated_at": "2026-01-11T12:00:00Z"
}
```

---

### 9.5 Pricing Rules

#### GET `/admin/pricing-rules`
Получить текущие правила ценообразования

**Response (200):**
```json
{
  "id": 1,
  "setup_fee": 100,
  "labor_rate_per_hour": 500,
  "labor_fixed": 50,
  "margin_percent": 15,
  "min_order_price": 500,
  "bulk_discount_rules": [
    { "qty_from": 10, "discount_percent": 5 },
    { "qty_from": 50, "discount_percent": 10 }
  ],
  "postprocess_options": [
    { "name": "standard_sanding", "price": 100, "days": 1 },
    { "name": "painting", "price": 500, "days": 2 }
  ],
  "updated_at": "2026-01-05T10:00:00Z"
}
```

---

#### PUT `/admin/pricing-rules`
Обновить правила ценообразования

**Request:** Same as GET response

**Response (200):** Updated rules

---

### 9.6 Audit Log

#### GET `/admin/audit`
Получить журнал действий администраторов

**Query params:**
- `user_id`: (optional)
- `action`: (optional)
- `entity_type`: (optional)
- `date_from`, `date_to`: (optional)

**Response (200):**
```json
{
  "logs": [
    {
      "id": 100,
      "user": { "id": 1, "name": "Admin", "email": "admin@example.com" },
      "action": "update_order",
      "entity_type": "order",
      "entity_id": 100,
      "changes": {
        "status": { "old": "pending", "new": "confirmed" }
      },
      "ip_address": "192.168.1.1",
      "created_at": "2026-01-10T13:00:00Z"
    }
  ]
}
```

---

## 10. FILES Module

#### GET `/files/:id`
Скачать файл (с проверкой доступа)

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Binary file

---

#### GET `/files/:id/preview`
Получить preview/thumbnail (публичный endpoint или с проверкой доступа)

**Response (200):** Image (JPEG/PNG)

---

## Error Codes Summary

| Code | Description |
|------|-------------|
| 400  | Bad Request (invalid parameters) |
| 401  | Unauthorized (invalid/missing token) |
| 403  | Forbidden (insufficient permissions, feature disabled) |
| 404  | Not Found (entity does not exist) |
| 422  | Unprocessable Entity (validation failed) |
| 429  | Too Many Requests (rate limit) |
| 500  | Internal Server Error |
| 503  | Service Unavailable (slicing service down, etc.) |

---

## Rate Limiting

- **Guest users**: 100 requests/hour
- **Authenticated users**: 1000 requests/hour
- **Admin users**: Unlimited

---

## Webhooks (for external integrations)

### Shipping tracking webhook
```
POST /webhooks/shipping/:provider
```

### Payment webhook
```
POST /webhooks/payment/:provider
```

---

**TODO для владельца бизнеса:**
1. Выбрать провайдера оплаты (Stripe, ЮKassa, Robokassa) и предоставить API ключи
2. Выбрать провайдера доставки (СДЭК, DPD, Boxberry и т.д.) и предоставить API ключи
3. Определить лимиты rate limiting для разных категорий пользователей
4. Уточнить структуру адресов доставки (поля, валидация)
