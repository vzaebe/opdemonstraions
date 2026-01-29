# Project Structure

This document describes the organization of the Open Decisions demonstrations project.

## Overview

The project consists of:
1. **Main Application** - Frontend (Vue 3) + Backend (Express) for the main website
2. **Print Service** - Separate microservice for 3D printing order management

## Directory Structure

```
opdemonstraions/
├── src/                          # Main application frontend (Vue 3 + TypeScript)
│   ├── assets/                   # Static assets (images, styles)
│   ├── components/               # Vue components
│   │   ├── admin/                # Admin-specific components
│   │   ├── charity/              # Charity-related components
│   │   ├── layout/               # Layout components (header, footer)
│   │   ├── sections/             # Page sections
│   │   └── ui/                   # Reusable UI components
│   ├── composables/              # Vue composables (useAnalytics, etc.)
│   ├── config/                   # Configuration files
│   ├── data/                     # Static JSON data files
│   ├── router/                   # Vue Router configuration
│   ├── services/                 # API service layer
│   │   └── api/                  # HTTP client and API services
│   ├── stores/                   # Pinia stores (state management)
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   ├── views/                    # Page views/components
│   └── main.ts                   # Application entry point
│
├── server/                       # Main application backend (Express)
│   ├── config.js                 # Server configuration
│   ├── index.js                  # Express app and routes
│   ├── auth.js                   # Authentication middleware
│   ├── db.js                     # Database connection (SQLite)
│   ├── telemetry.js              # Analytics/telemetry
│   ├── dataStore.js              # Data persistence layer
│   ├── var/                      # Runtime data (database, uploads)
│   └── scripts/                  # Utility scripts
│
├── print-service/                # 3D Print Service (separate microservice)
│   ├── client/                   # Print service frontend (Vue 3)
│   │   ├── src/
│   │   │   ├── components/       # Vue components
│   │   │   ├── services/         # API client
│   │   │   ├── stores/          # Pinia stores
│   │   │   └── views/           # Page views
│   │   └── vite.config.ts
│   └── server/                   # Print service backend (Express)
│       ├── index.js              # Express app
│       ├── config/               # Configuration
│       ├── database/             # Database migrations and seeds
│       ├── modules/              # Feature modules (auth, models, pricing, etc.)
│       ├── middleware/           # Express middleware
│       └── storage/              # File storage (uploads, cache)
│
├── public/                       # Static public assets
├── dist/                         # Build output (generated)
├── docs/                         # Documentation
├── cypress/                      # E2E tests
├── package.json                  # Main project dependencies
├── vite.config.ts                # Vite configuration (main app)
├── ENV.example                   # Environment variables template
└── README.md                     # Project README
```

## Port Configuration

### Development Ports

- **Main Frontend (Vite)**: `5173` (default Vite port)
- **Main Backend (Express)**: `3001` (changed from 3000 to avoid conflicts)
- **Print Service Frontend**: `5174`
- **Print Service Backend**: `3100`

### Port Fallback

Both backend servers support automatic port fallback:
- If the configured port is busy, they automatically try the next port
- This prevents "port already in use" errors during development

## Environment Configuration

### Main Application

Create a `.env` file in the root directory (use `ENV.example` as template):

```bash
# Backend
PORT=3001
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3001/api
```

### Production (VPS Deployment)

For production deployment with frontend on hosting and backend on VPS:

```bash
# Backend (.env on VPS)
PORT=3001
HOST=0.0.0.0
CORS_ORIGINS=https://yourdomain.com,http://your-vps-ip:3001

# Frontend (.env.production for build)
VITE_API_URL=http://your-vps-ip:3001/api
# Or use a domain if you set up reverse proxy:
# VITE_API_URL=https://api.yourdomain.com/api
```

### Print Service

Print service has its own configuration in `print-service/server/.env` (see `print-service/README.md`).

## Architecture Decisions

### Why Separate Folders?

1. **`src/` and `server/` separation**: 
   - Clear separation between frontend and backend
   - Frontend is a SPA that can be deployed to static hosting
   - Backend is a Node.js API that runs on a server
   - This is a standard pattern for full-stack applications

2. **`print-service/` as separate folder**:
   - Print service is a **microservice** - a separate, independently deployable service
   - It has its own frontend and backend
   - It can be developed, deployed, and scaled independently
   - This follows microservices architecture principles

### Deployment Strategy

1. **Development**: Everything runs locally
   - Main frontend: `npm run dev` → `http://localhost:5173`
   - Main backend: `npm run server:dev` → `http://localhost:3001`
   - Print service: See `print-service/README.md`

2. **Production**:
   - **Frontend**: Build static files (`npm run build`) → Deploy to hosting (FTP, GitHub Pages, etc.)
   - **Backend**: Deploy to VPS → Runs on `http://vps-ip:3001`
   - **Print Service**: Deploy separately to VPS or another server

3. **Frontend-Backend Connection**:
   - Frontend uses `VITE_API_URL` environment variable
   - In production, set this to your VPS backend URL
   - Frontend makes API calls to backend over HTTP

## Running the Project

### Main Application

```bash
# Install dependencies
npm install

# Development (frontend + backend)
npm run dev:full

# Or separately:
npm run dev              # Frontend only
npm run server:dev       # Backend only

# Production build
npm run build            # Build frontend
npm run server:prod      # Run backend in production mode
```

### Print Service

See `print-service/README.md` for detailed instructions.

## File Path Dependencies

### Main Application

- Frontend imports use `@/` alias pointing to `src/`
- Backend uses relative paths from `server/`
- No cross-dependencies between `src/` and `server/` at build time

### Print Service

- Completely independent from main application
- Has its own `package.json` files
- Can be deployed separately

## Troubleshooting

### Port 3000/3001 Already in Use

The backend automatically tries the next port if 3001 is busy. If you want to force a specific port:

```bash
PORT=3002 npm run server:dev
```

Or check what's using the port:

```bash
# Windows
netstat -ano | findstr :3001

# Linux/Mac
lsof -i :3001
```

### API Connection Issues

1. Check `VITE_API_URL` in your `.env` file
2. Ensure backend is running
3. Check CORS configuration in `server/config.js`
4. Verify network connectivity (firewall, VPN, etc.)

## Next Steps

- [ ] Set up production environment variables
- [ ] Configure VPS deployment
- [ ] Set up reverse proxy (nginx) for production
- [ ] Configure SSL certificates
- [ ] Set up CI/CD pipeline
