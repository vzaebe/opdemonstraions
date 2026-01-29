# Architecture Documentation

## System Overview

3D Print Service is a **modular, feature-flag driven** web platform for automated 3D printing order management. It follows a classic client-server architecture with clear separation between frontend presentation, backend business logic, and data persistence.

```
┌─────────────────────────────────────────────┐
│          Frontend (Vue 3 SPA)               │
│  ┌────────┐  ┌────────┐  ┌────────┐        │
│  │ Views  │  │ Stores │  │ Router │        │
│  └────────┘  └────────┘  └────────┘        │
│       │ Three.js 3D Viewer │               │
└───────┼────────────────────┼────────────────┘
        │      HTTP/REST     │
        ▼                    ▼
┌─────────────────────────────────────────────┐
│        Backend (Node.js + Express)          │
│  ┌────────────────────────────────────┐    │
│  │   Modules (Feature-Flagged)        │    │
│  │  ┌──────┐ ┌────────┐ ┌─────────┐  │    │
│  │  │ Auth │ │ Models │ │ Pricing │  │    │
│  │  └──────┘ └────────┘ └─────────┘  │    │
│  │  ┌────────┐ ┌────────┐ ┌──────┐   │    │
│  │  │Slicing│ │ Orders │ │ Queue│   │    │
│  │  └────────┘ └────────┘ └──────┘   │    │
│  └────────────────────────────────────┘    │
│           │ Business Logic │                │
└───────────┼────────────────┼────────────────┘
            │   SQL Queries  │
            ▼                ▼
┌─────────────────────────────────────────────┐
│         Database (SQLite3)                  │
│  Users, Models, Orders, Materials,          │
│  Printers, Queue, Feature Flags             │
└─────────────────────────────────────────────┘

External Integrations:
  ┌─────────────┐  ┌──────────────┐
  │ CuraEngine  │  │  YuKassa API │
  │  (Slicing)  │  │  (Payment)   │
  └─────────────┘  └──────────────┘
