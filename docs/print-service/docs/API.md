# API Documentation

Complete REST API reference for 3D Print Service.

## Base URL

```
Development: http://localhost:3100/api/v1
Production:  https://print.example.com/api/v1
```

## Authentication

Most endpoints require JWT authentication. Include the token in the `Authorization` header:

```http
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle
- **Expiration**: 7 days (configurable)
- **Refresh**: Not implemented yet
- **Guest tokens**: Valid for current session

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Endpoints

### Authentication & Users

#### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response** `201`:
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "created_at": "2026-01-11T12:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**
- `email`: Valid email, unique
- `password`: Min 8 characters
- `name`: Optional, max 255 chars

---

#### POST /auth/login
Login with existing credentials.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** `200`:
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user"
    },
    "token": "eyJhbGc..."
  }
}
```

---

#### POST /auth/guest
Create a guest session for anonymous users.

**Request:**
```json
{
  "email": "guest@example.com"
}
```

**Response** `201`:
```json
{
  "data": {
    "user": {
      "id": 2,
      "email": "guest@example.com",
      "role": "guest"
    },
    "token": "eyJhbGc..."
  }
}
```

---

#### GET /auth/me
Get current user info.

**Headers:** `Authorization: Bearer <token>`

**Response** `200`:
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

### Models

#### POST /models/upload
Upload one or more 3D model files.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `files`: File[] (STL, 3MF, OBJ)

**Response** `201`:
```json
{
  "data": [
    {
      "id": 1,
      "file_id": 1,
      "format": "stl",
      "bbox_x": 100.5,
      "bbox_y": 120.3,
      "bbox_z": 50.2,
      "volume": 125000,
      "surface_area": 35000,
      "triangle_count": 2400,
      "filename": "model.stl",
      "created_at": "2026-01-11T12:00:00Z"
    }
  ]
}
```

**File Limits:**
- Max size: 100 MB
- Formats: `.stl`, `.3mf`, `.obj`
- Max files per request: 10

---

#### GET /models/:id
Get model metadata.

**Headers:** `Authorization: Bearer <token>`

**Response** `200`:
```json
{
  "data": {
    "id": 1,
    "format": "stl",
    "bbox_x": 100.5,
    "bbox_y": 120.3,
    "bbox_z": 50.2,
    "volume": 125000,
    "surface_area": 35000,
    "triangle_count": 2400,
    "warnings_json": null,
    "created_at": "2026-01-11T12:00:00Z"
  }
}
```

---

### Pricing

#### GET /pricing/materials
Get available materials with pricing.

**Response** `200`:
```json
{
  "data": [
    {
      "id": 1,
      "name": "PLA",
      "type": "FDM",
      "density": 1.24,
      "price_per_gram": 1.5,
      "colors_json": "[\"Белый\",\"Черный\",\"Красный\",\"Синий\"]",
      "available": true
    },
    {
      "id": 2,
      "name": "ABS",
      "type": "FDM",
      "density": 1.04,
      "price_per_gram": 1.8,
      "colors_json": "[\"Белый\",\"Черный\"]",
      "available": true
    }
  ]
}
```

---

#### GET /pricing/profiles
Get available print quality profiles.

**Response** `200`:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Черновик",
      "layer_height": 0.3,
      "quality_level": 1,
      "description": "Быстро, низкое качество"
    },
    {
      "id": 2,
      "name": "Стандарт",
      "layer_height": 0.2,
      "quality_level": 2,
      "description": "Оптимальное соотношение"
    },
    {
      "id": 3,
      "name": "Высокое",
      "layer_height": 0.1,
      "quality_level": 3,
      "description": "Медленно, высокое качество"
    }
  ]
}
```

---

#### POST /pricing/quote
Calculate instant price quote (heuristic).

**Headers:** `Authorization: Bearer <token>` (optional)

**Request:**
```json
{
  "model_id": 1,
  "quantity": 2,
  "material_id": 1,
  "profile_id": 2,
  "infill": 20,
  "supports": false,
  "color": "Белый"
}
```

**Response** `200`:
```json
{
  "data": {
    "estimate": {
      "material_cost": 450.00,
      "machine_time_cost": 320.50,
      "labor_cost": 200.00,
      "postprocess_cost": 0,
      "subtotal": 970.50,
      "margin": 194.10,
      "total": 1164.60,
      "estimated_days": 2
    },
    "breakdown": {
      "model_volume": 125000,
      "material_weight": 300.0,
      "estimated_print_time_hours": 5.5,
      "formula": "material + machine_time + labor + margin"
    },
    "type": "instant",
    "note": "Приблизительная оценка. Для точного расчета используйте слайсер."
  }
}
```

**Validation:**
- `model_id`: Required, exists
- `quantity`: Min 1, max 100
- `material_id`: Required, exists
- `profile_id`: Required, exists
- `infill`: 10-100%
- `supports`: Boolean

---

### Slicing (Accurate Quotes)

#### POST /slicing/jobs
Create accurate slicing job using CuraEngine.

**Headers:** `Authorization: Bearer <token>` (optional)

**Request:**
```json
{
  "model_id": 1,
  "profile_id": 2,
  "material_id": 1,
  "infill": 20,
  "supports": false
}
```

**Response** `201`:
```json
{
  "data": {
    "id": 1,
    "model_id": 1,
    "status": "pending",
    "created_at": "2026-01-11T12:00:00Z"
  }
}
```

**Status Flow:**
- `pending` → Job created, waiting for slot
- `processing` → CuraEngine is running
- `completed` → Success, result available
- `failed` → Error occurred

---

#### GET /slicing/jobs/:id
Get slicing job status and result.

**Headers:** `Authorization: Bearer <token>` (optional)

**Response** `200` (when pending/processing):
```json
{
  "data": {
    "id": 1,
    "status": "processing",
    "created_at": "2026-01-11T12:00:00Z",
    "started_at": "2026-01-11T12:00:05Z"
  }
}
```

**Response** `200` (when completed):
```json
{
  "data": {
    "id": 1,
    "status": "completed",
    "result": {
      "printTime": 14400,
      "printTimeHours": "4.00",
      "filamentLength": 50000,
      "filamentWeight": 150.5,
      "layerCount": 400
    },
    "created_at": "2026-01-11T12:00:00Z",
    "finished_at": "2026-01-11T12:00:45Z"
  }
}
```

---

#### GET /slicing/status
Check if CuraEngine is available.

**Response** `200`:
```json
{
  "data": {
    "available": true,
    "engine": "CuraEngine",
    "maxParallelJobs": 2,
    "currentJobs": 0
  }
}
```

---

#### GET /slicing/stats
Get slicing jobs statistics.

**Response** `200`:
```json
{
  "data": {
    "total": 150,
    "pending": 3,
    "processing": 1,
    "completed": 145,
    "failed": 1
  }
}
```

---

### Orders

#### POST /orders/create
Create a new order.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "items": [
    {
      "model_id": 1,
      "quantity": 2,
      "material_id": 1,
      "profile_id": 2,
      "infill": 20,
      "supports": false,
      "color": "Белый",
      "price": 1164.60
    }
  ],
  "contact": {
    "email": "customer@example.com",
    "phone": "+79001234567",
    "name": "John Doe"
  },
  "shipping": {
    "method_id": 1,
    "address": "г. Москва, ул. Ленина, д. 1, кв. 10",
    "cost": 300
  },
  "payment": {
    "method": "upon_receipt"
  }
}
```

**Response** `201`:
```json
{
  "data": {
    "order_id": 1,
    "order_number": "ORD-20260111-0001",
    "status": "pending",
    "created_at": "2026-01-11T12:00:00Z"
  }
}
```

---

#### GET /orders
Get user's orders list.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status`: Filter by status (optional)
- `limit`: Max results (default: 50)
- `offset`: Pagination offset

**Response** `200`:
```json
{
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20260111-0001",
      "status": "pending",
      "totals_json": "{\"grand_total\": 1464.60}",
      "created_at": "2026-01-11T12:00:00Z"
    }
  ]
}
```

---

#### GET /orders/:id
Get order details.

**Headers:** `Authorization: Bearer <token>`

**Response** `200`:
```json
{
  "data": {
    "id": 1,
    "order_number": "ORD-20260111-0001",
    "status": "confirmed",
    "items_json": "[{\"model_id\": 1, \"quantity\": 2, ...}]",
    "totals_json": "{\"grand_total\": 1464.60, \"shipping\": 300}",
    "shipping_json": "{\"address\": \"...\"}",
    "tracking_number": null,
    "created_at": "2026-01-11T12:00:00Z",
    "updated_at": "2026-01-11T12:05:00Z"
  }
}
```

---

#### GET /orders/:id/messages
Get order messages/comments.

**Headers:** `Authorization: Bearer <token>`

**Response** `200`:
```json
{
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "author_type": "customer",
      "author_name": "John Doe",
      "message": "Когда будет готов заказ?",
      "created_at": "2026-01-11T13:00:00Z"
    },
    {
      "id": 2,
      "author_type": "admin",
      "author_name": "Менеджер",
      "message": "Заказ будет готов завтра.",
      "created_at": "2026-01-11T13:30:00Z"
    }
  ]
}
```

---

#### POST /orders/:id/messages
Add message to order.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "message": "Спасибо за информацию!"
}
```

**Response** `201`:
```json
{
  "data": {
    "id": 3,
    "order_id": 1,
    "author_type": "customer",
    "message": "Спасибо за информацию!",
    "created_at": "2026-01-11T14:00:00Z"
  }
}
```

---

### Production Queue

#### GET /queue
Get production queue items.

**Headers:** `Authorization: Bearer <token>` (admin)

**Query Parameters:**
- `status`: Filter by status
- `printer_id`: Filter by printer

**Response** `200`:
```json
{
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "order_item_id": 1,
      "printer_id": 2,
      "status": "printing",
      "priority": 10,
      "scheduled_at": "2026-01-11T10:00:00Z",
      "started_at": "2026-01-11T10:30:00Z",
      "estimated_finish": "2026-01-11T14:30:00Z"
    }
  ]
}
```

**Queue Statuses:**
- `queued` - Waiting
- `assigned` - Assigned to printer
- `printing` - In progress
- `done` - Completed
- `failed` - Failed
- `cancelled` - Cancelled

---

#### PUT /queue/:id
Update queue item (assign printer, change priority, status).

**Headers:** `Authorization: Bearer <token>` (admin)

**Request:**
```json
{
  "printer_id": 3,
  "priority": 20,
  "status": "printing"
}
```

**Response** `200`:
```json
{
  "data": {
    "id": 1,
    "printer_id": 3,
    "priority": 20,
    "status": "printing",
    "updated_at": "2026-01-11T15:00:00Z"
  }
}
```

---

### Admin

#### GET /admin/dashboard
Get dashboard statistics.

**Headers:** `Authorization: Bearer <admin-token>`

**Response** `200`:
```json
{
  "data": {
    "orders_today": 5,
    "orders_week": 32,
    "revenue_today": 15000.50,
    "revenue_week": 98500.00,
    "queue_pending": 3,
    "queue_printing": 2
  }
}
```

---

#### GET /admin/orders
Get all orders (admin view).

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `status`: Filter
- `date_from`: ISO date
- `date_to`: ISO date

**Response** `200`:
```json
{
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20260111-0001",
      "guest_email": "customer@example.com",
      "status": "confirmed",
      "totals_json": "{\"grand_total\": 1464.60}",
      "created_at": "2026-01-11T12:00:00Z"
    }
  ]
}
```

---

#### PUT /admin/orders/:id
Update order (status, tracking, manual price adjustment).

**Headers:** `Authorization: Bearer <admin-token>`

**Request:**
```json
{
  "status": "shipped",
  "tracking_number": "12345678901234",
  "notes": "Упаковано и отправлено"
}
```

**Response** `200`:
```json
{
  "data": {
    "id": 1,
    "status": "shipped",
    "tracking_number": "12345678901234",
    "updated_at": "2026-01-11T16:00:00Z"
  }
}
```

---

#### GET /admin/materials
Get materials list.

**Headers:** `Authorization: Bearer <admin-token>`

**Response** `200`:
```json
{
  "data": [
    {
      "id": 1,
      "name": "PLA",
      "type": "FDM",
      "density": 1.24,
      "price_per_gram": 1.5,
      "colors_json": "[\"Белый\",\"Черный\"]",
      "available": true
    }
  ]
}
```

---

#### POST /admin/materials
Create new material.

**Headers:** `Authorization: Bearer <admin-token>`

**Request:**
```json
{
  "name": "PETG",
  "type": "FDM",
  "density": 1.27,
  "price_per_gram": 2.0,
  "colors_json": "[\"Прозрачный\",\"Черный\"]"
}
```

---

#### PUT /admin/materials/:id
Update material.

---

#### DELETE /admin/materials/:id
Delete material.

---

#### GET /admin/printers
Get printers list.

---

#### POST /admin/printers
Create printer.

---

#### PUT /admin/printers/:id
Update printer.

---

#### DELETE /admin/printers/:id
Delete printer.

---

## Rate Limiting

- **General**: 100 requests per 15 minutes per IP
- **Upload**: 10 files per 15 minutes per IP
- **Admin**: 200 requests per 15 minutes

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642000000
```

---

## Webhooks (Planned)

Future webhooks for payment/shipping:

- `order.created`
- `order.status_changed`
- `payment.completed`
- `shipping.dispatched`

---

## OpenAPI Spec

Full OpenAPI 3.0 spec coming soon: `/api/v1/openapi.json`

---

**Last Updated:** 2026-01-11
