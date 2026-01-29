# 3D Print Service - Complete Print Automation Platform

A full-featured web platform for 3D printing order automation with instant cost calculation, CuraEngine slicing integration, production queue management, and admin dashboard.

## 🎯 Key Features

### For Customers
- **3D Model Upload** - STL/3MF files via drag&drop or URL
- **Interactive 3D Viewer** - Rotate, zoom, wireframe mode with Three.js
- **Instant Cost Calculation** - Real-time pricing with detailed breakdown
- **Accurate Slicing** - CuraEngine integration for precise time/material estimates
- **Multiple Materials & Profiles** - PLA, ABS, PETG with configurable quality levels
- **Order Tracking** - Status updates, messaging, and notifications
- **User Dashboard** - Order history and management

### For Administrators
- **Comprehensive Dashboard** - KPIs, revenue, orders, queue stats
- **Order Management** - Status updates, manual price adjustments
- **Production Queue** - Printer assignment, prioritization, tracking
- **Materials & Printers** - Full CRUD for inventory management
- **Feature Flags** - Dynamic module enable/disable
- **Print Profiles** - Quality presets with configurable parameters

### Technical Highlights
- **Modular Architecture** - Feature-flag driven, independently deployable
- **Two-Tier Pricing** - Instant heuristic + accurate slicing estimates
- **Real STL Parser** - Binary & ASCII format support with validation
- **RBAC** - Guest, User, Admin, Superadmin roles
- **SQLite3 Database** - Easy migration to Postgres/MySQL
- **Vue 3 + TypeScript** - Modern reactive frontend
- **Three.js 3D** - WebGL-based model visualization

---

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

---

## 🛠 Technology Stack

### Backend
- **Node.js** (v18+) + **Express.js** 4.x
- **SQLite3** with migrations
- **JWT** authentication
- **CuraEngine** CLI integration
- **Winston** for logging
- **Helmet** + rate limiting for security

### Frontend
- **Vue 3** (Composition API) + **TypeScript**
- **Vite** for build tooling
- **Pinia** for state management
- **Vue Router** with navigation guards
- **Axios** for HTTP requests
- **Three.js** for 3D visualization
- **Troika-three-text** for 3D text rendering

### Database Schema
- Users & Authentication
- Files & Models
- Materials & Printers
- Print Profiles & Pricing Rules
- Orders & Order Items
- Production Queue
- Slicing Jobs
- Feature Flags
- Audit Logs

---

## 📁 Project Structure

```
print-service/
├── server/                      # Backend (Node.js + Express)
│   ├── database/
│   │   ├── connection.js        # SQLite connection
│   │   ├── migrations/          # DB migrations
│   │   │   ├── 001_initial.sql
│   │   │   ├── 002_feature_flags.sql
│   │   │   └── 003_slicing.sql
│   │   └── seeds/               # Seed data
│   │       └── initial.sql
│   ├── modules/                 # Feature modules
│   │   ├── auth/                # Authentication & users
│   │   ├── models/              # 3D model upload & parsing
│   │   ├── pricing/             # Cost calculation
│   │   ├── slicing/             # CuraEngine integration
│   │   │   ├── parser.js        # STL parser (binary + ASCII)
│   │   │   ├── slicer.js        # CuraEngine wrapper
│   │   │   ├── service.js       # Slicing jobs
│   │   │   └── routes.js
│   │   ├── orders/              # Order management
│   │   ├── queue/               # Production queue
│   │   ├── admin/               # Admin panel API
│   │   └── ai/                  # AI module (stubs)
│   ├── middleware/              # Express middleware
│   │   ├── auth.js
│   │   ├── featureFlag.js
│   │   └── rateLimiter.js
│   ├── utils/                   # Utilities
│   │   ├── logger.js
│   │   ├── response.js
│   │   └── validation.js
│   ├── var/                     # Runtime data
│   │   ├── uploads/             # Uploaded models
│   │   ├── slicing-cache/       # Slicing cache
│   │   └── app.sqlite           # Database
│   ├── .env.example
│   ├── index.js                 # Server entry point
│   └── package.json
│
├── client/                      # Frontend (Vue 3 + TypeScript)
│   ├── src/
│   │   ├── assets/
│   │   │   └── styles/
│   │   │       └── main.scss    # Global styles
│   │   ├── components/
│   │   │   ├── ui/              # UI Kit components
│   │   │   │   ├── UiButton.vue
│   │   │   │   ├── UiCard.vue
│   │   │   │   ├── UiFileUpload.vue
│   │   │   │   ├── UiSlider.vue
│   │   │   │   └── UiBadge.vue
│   │   │   ├── ModelViewer3D.vue    # Three.js viewer
│   │   │   └── ThreeDLanding.vue    # 3D animated landing
│   │   ├── router/
│   │   │   └── index.ts         # Vue Router config
│   │   ├── services/
│   │   │   └── api.ts           # Axios API client
│   │   ├── stores/              # Pinia stores
│   │   │   ├── auth.ts
│   │   │   ├── calculator.ts
│   │   │   ├── orders.ts
│   │   │   ├── admin.ts
│   │   │   └── print.ts
│   │   ├── views/
│   │   │   ├── LandingView.vue
│   │   │   ├── CalculatorView.vue
│   │   │   ├── CheckoutView.vue
│   │   │   ├── OrdersView.vue
│   │   │   ├── OrderDetailView.vue
│   │   │   └── admin/
│   │   │       ├── AdminDashboardView.vue
│   │   │       ├── AdminOrdersView.vue
│   │   │       ├── AdminQueueView.vue
│   │   │       └── AdminSettingsView.vue
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── IMPLEMENTATION_STATUS.md
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **CuraEngine** CLI (optional, for accurate slicing)
  ```bash
  # Install CuraEngine (Linux example)
  wget https://github.com/Ultimaker/CuraEngine/releases/download/X.X.X/CuraEngine
  chmod +x CuraEngine
  sudo mv CuraEngine /usr/local/bin/
  ```

### Clone Repository

```bash
git clone <repository-url>
cd print-service
```

### Backend Setup

```bash
cd server
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run migrations
npm run migrate

# Seed initial data (materials, printers, profiles, feature flags)
npm run seed
```

### Frontend Setup

```bash
cd client
npm install
```

---

## ⚙️ Configuration

### Backend (.env)

```bash
# Server
PORT=3100
NODE_ENV=development

# Database
DATABASE_PATH=./var/app.sqlite

# Security
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# File Storage
UPLOAD_DIR=./var/uploads
MAX_FILE_SIZE=104857600  # 100MB

# Pricing (Business Rules)
DEFAULT_MATERIAL_PRICE=1.5       # RUB per gram (1500 RUB/kg)
DEFAULT_MARGIN=0.2               # 20% margin
MIN_ORDER_PRICE=500              # Minimum order price in RUB
LABOR_SETUP_FEE=200              # Setup fee per order

# CuraEngine (optional)
CURA_ENGINE_PATH=CuraEngine      # Path to CuraEngine executable
SLICER_MAX_JOBS=2                # Max parallel slicing jobs

# Feature Flags (can be overridden via database)
FEATURE_SLICING=true
FEATURE_SHIPPING=true
FEATURE_PAYMENT=true
FEATURE_AI=false
```

### Frontend (vite.config.ts)

API proxy is pre-configured:
```typescript
server: {
  port: 5174,
  proxy: {
    '/api': 'http://localhost:3100'  // Backend URL
  }
}
```

---

## 🏃 Running the Application

### Development Mode

#### Start Backend
```bash
cd server
npm run dev
# Runs on http://localhost:3100
```

#### Start Frontend
```bash
cd client
npm run dev
# Runs on http://localhost:5174
```

Visit **http://localhost:5174** in your browser.

### Production Mode

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
cd client
npm run build
npm run preview
```

Or serve the `dist/` folder with Nginx (see deployment docs).

---

## 📖 API Documentation

### Base URL
```
http://localhost:3100/api/v1
```

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "data": {
    "user": { "id": 1, "email": "user@example.com", ... },
    "token": "eyJhbGc..."
  }
}
```

#### Create Guest
```http
POST /auth/guest
Content-Type: application/json

{
  "email": "guest@example.com"
}
```

### Models

#### Upload Model
```http
POST /models/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
  - files: [File1.stl, File2.stl]
```

#### Get Model
```http
GET /models/:id
Authorization: Bearer <token>

Response:
{
  "data": {
    "id": 1,
    "format": "stl",
    "bbox_x": 100.5,
    "bbox_y": 120.3,
    "bbox_z": 50.2,
    "volume": 125000,
    "surface_area": 35000,
    "triangle_count": 2400
  }
}
```

### Pricing

#### Get Materials
```http
GET /pricing/materials

Response:
{
  "data": [
    {
      "id": 1,
      "name": "PLA",
      "type": "FDM",
      "density": 1.24,
      "price_per_gram": 1.5,
      "colors_json": "[\"Белый\",\"Черный\",\"Красный\"]"
    }
  ]
}
```

#### Get Print Profiles
```http
GET /pricing/profiles

Response:
{
  "data": [
    {
      "id": 1,
      "name": "Черновик",
      "layer_height": 0.3,
      "quality_level": 1
    },
    {
      "id": 2,
      "name": "Стандарт",
      "layer_height": 0.2,
      "quality_level": 2
    }
  ]
}
```

#### Calculate Quote (Instant)
```http
POST /pricing/quote
Content-Type: application/json
Authorization: Bearer <token>

{
  "model_id": 1,
  "quantity": 2,
  "material_id": 1,
  "profile_id": 2,
  "infill": 20,
  "supports": false,
  "color": "Белый"
}

Response:
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
    "breakdown": { ... }
  }
}
```

### Slicing (Accurate Calculation)

#### Create Slicing Job
```http
POST /slicing/jobs
Content-Type: application/json
Authorization: Bearer <token>

{
  "model_id": 1,
  "profile_id": 2,
  "material_id": 1,
  "infill": 20,
  "supports": false
}

Response:
{
  "data": {
    "id": 1,
    "status": "pending",  // pending -> processing -> completed/failed
    "created_at": "2026-01-11T12:00:00Z"
  }
}
```

#### Get Job Status
```http
GET /slicing/jobs/:id
Authorization: Bearer <token>

Response (when completed):
{
  "data": {
    "id": 1,
    "status": "completed",
    "result": {
      "printTime": 14400,        // seconds
      "printTimeHours": "4.00",
      "filamentLength": 50000,   // mm
      "filamentWeight": 150.5,   // grams
      "layerCount": 400
    }
  }
}
```

### Orders

#### Create Order
```http
POST /orders/create
Content-Type: application/json
Authorization: Bearer <token>

{
  "items": [
    {
      "model_id": 1,
      "quantity": 2,
      "material_id": 1,
      "profile_id": 2,
      "infill": 20,
      "supports": false,
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

Response:
{
  "data": {
    "order_id": 1,
    "order_number": "ORD-20260111-0001",
    "status": "pending"
  }
}
```

#### Get My Orders
```http
GET /orders
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20260111-0001",
      "status": "pending",
      "created_at": "2026-01-11T12:00:00Z",
      "totals_json": "{\"grand_total\": 1464.60}"
    }
  ]
}
```

#### Get Order Detail
```http
GET /orders/:id
Authorization: Bearer <token>
```

#### Add Order Message
```http
POST /orders/:id/messages
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "Когда будет готов заказ?"
}
```

### Admin

#### Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin-token>

Response:
{
  "data": {
    "orders_today": 5,
    "orders_week": 32,
    "revenue_today": 15000,
    "revenue_week": 98500,
    "queue_pending": 3,
    "queue_printing": 2
  }
}
```

#### Manage Orders
```http
GET /admin/orders?status=pending
PUT /admin/orders/:id
```

#### Production Queue
```http
GET /queue
PUT /queue/:id
```

#### Materials CRUD
```http
GET /admin/materials
POST /admin/materials
PUT /admin/materials/:id
DELETE /admin/materials/:id
```

---

## 🏗 Architecture

### Modular Design

The system is designed as **independent, feature-flag controlled modules**:

1. **Core** - Auth, users, RBAC, feature flags, file storage
2. **Models** - Upload, STL parsing, validation, metadata extraction
3. **Pricing** - Instant quotes, materials, profiles, rules
4. **Slicing** - CuraEngine integration, job queue, caching
5. **Orders** - Cart, checkout, order management, messaging
6. **Queue** - Production queue, printer assignment, tracking
7. **Admin** - Dashboard, CRUD, settings
8. **AI** - Chat, model analysis (stubs, feature-flagged)

### Two-Tier Pricing

1. **Instant Estimate** (Fast, ~100ms)
   - Heuristic calculation based on volume, material density, infill
   - Factors: material cost, machine time (rough), labor, margin
   - Returns immediately for UX

2. **Accurate Estimate** (Slow, ~30-60s)
   - CuraEngine CLI slicing
   - Parses actual print time and filament usage from gcode
   - Cached by (model + profile + params)
   - Used for final invoice

### STL Parser

Supports **binary** and **ASCII** STL formats:
- Binary: Fast parsing of triangle count, vertices, normals
- ASCII: Text-based parsing with regex
- Calculates: bounding box, volume (signed tetrahedron), surface area
- Validates: dimensions, aspect ratio, complexity

### Feature Flags

Database-driven flags allow dynamic enable/disable:
```javascript
const flags = {
  slicing: true,   // Enable CuraEngine
  shipping: true,  // Enable shipping calc
  payment: true,   // Enable YuKassa
  ai: false        // Disable AI features
}
```

Frontend checks flags on load and hides/shows features accordingly.

### Security

- **JWT** authentication with refresh tokens
- **RBAC**: guest, user, admin, superadmin
- **Rate limiting**: 100 req/15min per IP
- **Helmet.js**: Security headers
- **bcrypt**: Password hashing (10 rounds)
- **File validation**: Type, size, hash
- **SQL injection**: Prepared statements only

---

## 🧪 Testing

### Unit Tests
```bash
cd server
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests (Cypress)
```bash
cd client
npm run test:e2e
```

---

## 🚀 Deployment

### Requirements
- Ubuntu 20.04+ or similar Linux
- Node.js 18+
- Nginx (for frontend + reverse proxy)
- CuraEngine (optional)
- Systemd (for backend service)

### Quick Deploy

1. **Build Frontend**
   ```bash
   cd client
   npm install
   npm run build
   # Output: dist/
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name print.example.com;

       # Frontend static files
       location / {
           root /var/www/print-service/client/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API proxy
       location /api {
           proxy_pass http://localhost:3100;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Create Systemd Service**
   ```ini
   [Unit]
   Description=3D Print Service Backend
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/print-service/server
   ExecStart=/usr/bin/node index.js
   Restart=on-failure
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```

4. **Start Service**
   ```bash
   sudo systemctl enable print-service
   sudo systemctl start print-service
   sudo systemctl status print-service
   ```

For detailed deployment guide, see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 📝 Development Guidelines

### Code Style
- **Backend**: Standard.js conventions
- **Frontend**: Vue 3 Composition API, TypeScript strict mode
- **Naming**: camelCase for JS, kebab-case for Vue files

### Git Workflow
```bash
# Feature branch
git checkout -b feature/my-feature

# Commit with conventional commits
git commit -m "feat(models): add 3MF format support"

# Push and create PR
git push origin feature/my-feature
```

### Adding New Module

1. Create module directory: `server/modules/my-module/`
2. Create: `service.js`, `controller.js`, `routes.js`
3. Add feature flag: `feature_flags` table
4. Mount routes in `server/index.js`
5. Add frontend store: `client/src/stores/myModule.ts`
6. Add routes: `client/src/router/index.ts`

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 🐛 Bug Reports

Please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment (OS, Node version, browser)

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: GitHub Issues
- **Email**: support@example.com

---

**Made with ❤️ for the 3D printing community**
