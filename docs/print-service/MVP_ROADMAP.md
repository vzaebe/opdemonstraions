# MVP vs Phase 2 Roadmap

## Философия разделения

**MVP (Minimum Viable Product)** — функциональная система, которая решает основные задачи:
- Загрузка моделей
- Мгновенный расчет стоимости
- Оформление заказа
- Админ-панель для управления
- Производственная очередь

**Phase 2** — расширенные возможности, оптимизации, AI-функции

---

## MVP Scope (4-6 недель разработки)

### ✅ Core Module
- [x] Auth (JWT, роли: guest/user/admin)
- [x] Users (регистрация, профиль)
- [x] Feature Flags (управление модулями)
- [x] Settings (key-value хранилище)
- [x] File Storage (приватные файлы, signed URLs)
- [x] Audit Log (базовый, для критичных действий админа)

### ✅ Models Module
- [x] Upload STL/3MF (drag&drop + multiple files)
- [x] Upload by URL
- [x] STL Parsing (Three.js STLLoader → bbox, volume, triangle count)
- [x] 3MF Parsing (basic, без сложных multi-part/colors)
- [x] Validation (watertight check через алгоритм, size limits)
- [ ] ~~Auto-repair~~ (Phase 2)
- [x] Thumbnail generation (PNG screenshot из Three.js)

### ✅ Pricing Module
- [x] Materials CRUD (PLA/ABS/PETG/TPU, цены, плотности, цвета)
- [x] Printers (базовые настройки, тарифы)
- [x] Print Profiles (Draft/Standard/Fine, коэффициенты)
- [x] Pricing Rules (setup fee, labor, margin, min price)
- [x] Instant Estimate (эвристика по volume/height)
- [x] Breakdown (материал, время, труд, маржа)
- [x] Bulk Discounts (простые правила qty → скидка)
- [ ] ~~Accurate Estimate (slicing)~~ (опционально, feature flag disabled по умолчанию)

### ✅ Orders Module
- [x] Cart (опционально, можно сразу создавать заказ)
- [x] Create Order (контакты, доставка, items)
- [x] Order Statuses (pending/confirmed/in_production/ready/shipped/completed)
- [x] Status History (журнал изменений)
- [x] Order Messages (двусторонняя переписка клиент-админ)
- [x] Email Notifications (базовые шаблоны: order created, status changed)
- [ ] ~~SMS Notifications~~ (Phase 2)

### ✅ Production Queue Module
- [x] Queue Management (список работ, привязка к order_items)
- [x] Statuses (queued/assigned/printing/completed/failed)
- [x] Printer Assignment (ручное в админке)
- [x] Priority (ручное изменение)
- [x] History (журнал событий)
- [ ] ~~Auto-assignment by material/printer availability~~ (Phase 2)
- [ ] ~~Grouping by material for batch printing~~ (Phase 2)

### ✅ Shipping Module
- [x] Shipping Methods (фиксированные тарифы: самовывоз/курьер/почта)
- [x] Zones (простые правила город → цена)
- [ ] ~~API интеграция (СДЭК, DPD)~~ (Phase 2)
- [x] Tracking Number (ручной ввод админом)
- [ ] ~~Auto-tracking через API доставки~~ (Phase 2)

### ⏸️ Payment Module (опционально, feature flag disabled)
- [x] Mock Provider (для тестирования)
- [x] Interface (абстракция для провайдеров)
- [ ] ~~Stripe/ЮKassa/Robokassa~~ (Phase 2, требует бизнес-подтверждения)

### ❌ Slicing Module (disabled by default, но инфраструктура готова)
- [x] Database schema (slicing_jobs table)
- [x] API endpoints (POST /slicing/estimate, GET /slicing/jobs/:id)
- [ ] CuraEngine integration (Phase 2, требует установки на сервере)
- [ ] Worker Pool (Phase 2)
- [ ] Cache (Phase 2)

### ❌ AI Module (disabled, интерфейсы есть, реализации нет)
- [x] Database schema (ai_requests table)
- [x] API endpoints (с проверкой feature flag)
- [x] Provider Interface (заглушки)
- [ ] OpenAI integration (Phase 2)
- [ ] Chat Assistant (Phase 2)
- [ ] Model Analysis (Phase 2)
- [ ] 2D→3D Generation (Phase 2)

### ✅ Admin Module
- [x] Dashboard (KPI виджеты: заказы, средний чек, загрузка)
- [x] Orders Management (список, детали, смена статуса, цены, трек-номер)
- [x] Queue Management (список работ, назначение принтеров, приоритеты)
- [x] Settings CRUD:
  - [x] Materials
  - [x] Printers
  - [x] Profiles
  - [x] Pricing Rules
  - [x] Shipping Methods
  - [x] Email Templates
  - [x] Feature Flags
- [ ] ~~AI Settings~~ (Phase 2)
- [x] Audit Log (просмотр)

### ✅ Frontend
- [x] Landing Page (3D-текст с Three.js, Hero, How It Works, Features, FAQ)
- [x] Calculator Page (Upload, 3D Viewer, Parameters, Instant Quote, Add to Order)
- [x] Checkout Page (Contacts, Shipping, Payment mock, Order Summary)
- [x] User Dashboard (Orders List, Order Details, Messages)
- [ ] ~~2D→3D Request Form~~ (Phase 2, требует AI)
- [x] Admin Dashboard (KPI, Orders, Queue, Settings)

### ✅ 3D Components
- [x] ThreeScene.vue (базовая обертка)
- [x] ThreeText3D.vue (3D-текст для landing hero)
- [x] ModelViewer3D.vue (STL viewer с OrbitControls, bbox display)
- [ ] ~~PrinterAnimation.vue~~ (опционально, Phase 2)

### ✅ UI Kit Extensions
- [x] UiFileUpload.vue
- [x] UiSlider.vue
- [x] UiBadge.vue
- [x] UiSkeleton.vue
- [x] UiTooltip.vue
- [ ] UiTable.vue (Phase 2, для MVP можно использовать простые списки/карточки)
- [ ] UiTabs.vue (Phase 2, или простая версия для MVP)

### ✅ Infrastructure
- [x] SQLite Database + Migrations
- [x] Seed Data (дефолтные материалы, принтеры, профили, правила цен)
- [x] File Storage (uploads, private files)
- [x] Email Service (SMTP или API, базовая настройка)
- [x] Environment Variables (.env файл)
- [x] Logging (Winston или аналог)
- [ ] ~~Monitoring~~ (Phase 2)

---

## Phase 2 Scope (2-4 недели после MVP)

### Slicing Module (Точный расчет)
- [ ] CuraEngine/PrusaSlicer CLI integration
- [ ] Worker Pool (max concurrency 2-4)
- [ ] Job Queue (in-memory или Redis)
- [ ] Result Parser (gcode → time/filament)
- [ ] Cache (params hash → result)
- [ ] Accurate Estimate UI flow (polling/WebSocket)

### AI Module
- [ ] OpenAI API integration
- [ ] Chat Assistant (контекстный помощник по заказу)
- [ ] Model Analysis (предложения по ориентации, warnings)
- [ ] 2D→3D Generation Request (UI form + admin review flow)
- [ ] AI Settings в админке

### Payment Module
- [ ] Stripe/ЮKassa/Robokassa integration
- [ ] Webhooks обработка
- [ ] Payment UI flow (redirect, callback)
- [ ] Refunds

### Shipping Module
- [ ] API интеграция (СДЭК, DPD, Boxberry)
- [ ] Auto-tracking (получение статуса доставки)
- [ ] Webhook от транспортных компаний

### Production Queue Enhancements
- [ ] Auto-assignment (принтер по материалу/загрузке)
- [ ] Grouping (batch печать одного материала)
- [ ] Optimization алгоритмы (minimize setup changes)
- [ ] Kanban UI (drag&drop работ между статусами)

### Advanced UI Components
- [ ] UiTable.vue (полнофункциональная: сортировка, фильтры, пагинация)
- [ ] UiTabs.vue (расширенная версия)
- [ ] UiAccordion.vue
- [ ] UiStepper.vue
- [ ] UiTimeline.vue
- [ ] UiNotification/Toast system

### 3D Enhancements
- [ ] PrinterAnimation.vue (анимированный принтер на landing)
- [ ] Model Repair UI (интеграция с repair tools)
- [ ] Advanced 3D Viewer features (cross-section, measurements)

### Monitoring & Analytics
- [ ] Prometheus metrics (requests, slicing jobs, queue length)
- [ ] Grafana dashboards
- [ ] Error tracking (Sentry или аналог)
- [ ] User analytics (Google Analytics/Yandex Metrika)

### Performance Optimizations
- [ ] CDN для статики
- [ ] Image optimization (WebP, lazy loading)
- [ ] Code splitting (dynamic imports)
- [ ] Service Worker (offline support, опционально)

### Security Enhancements
- [ ] Rate limiting (более строгий)
- [ ] CAPTCHA (для регистрации/заказов)
- [ ] Content Security Policy
- [ ] Security headers (Helmet.js)

---

## Feature Flags Configuration (MVP)

```javascript
// Стартовые значения feature_flags (seed data)
{
  models: true,        // Загрузка и управление моделями
  pricing: true,       // Мгновенный расчет
  slicing: false,      // Точный расчет (Phase 2)
  orders: true,        // Оформление заказов
  queue: true,         // Очередь производства
  shipping: true,      // Доставка
  payment: false,      // Онлайн-оплата (Phase 2 или по требованию)
  ai: false,           // AI-функции (Phase 2)
  admin: true          // Админ-панель
}
```

---

## Deployment Strategy

### MVP Deployment
1. **VPS Ubuntu 22.04 LTS**
2. **Node.js 20.x LTS**
3. **Nginx** (статик фронта + reverse proxy для API)
4. **SQLite3** (файл БД в `/var/lib/print-service/data.db`)
5. **PM2** или **systemd** (для запуска Node.js как сервиса)
6. **Let's Encrypt SSL** (certbot)

### Phase 2 Deployment Enhancements
- **Docker** (контейнеризация backend + slicing worker)
- **Docker Compose** (multi-container setup)
- **Redis** (для job queue и cache)
- **PostgreSQL** migration (опционально, если SQLite не справляется с нагрузкой)

---

## Development Timeline (MVP)

**Неделя 1-2: Backend Foundation**
- Database schema + migrations
- Core module (auth, users, feature flags, files)
- Models module (upload, parsing, validation)
- Pricing module (instant estimate, materials/profiles CRUD)

**Неделя 3-4: Orders & Queue**
- Orders module (create, status, messages)
- Production Queue (CRUD, assignment)
- Admin API (orders, queue, settings)
- Email notifications

**Неделя 5-6: Frontend**
- Landing page (3D-текст, hero, sections)
- Calculator page (upload, viewer, parameters, quote)
- Checkout page
- User dashboard
- Admin dashboard (orders, queue, settings UI)

**Неделя 7 (опционально): Polish & Testing**
- UI/UX refinements
- E2E tests (Cypress или Playwright)
- Bug fixes
- Documentation
- Deployment scripts

---

## Testing Strategy

### MVP Testing
- **Unit Tests**: Критичные модули (pricing calculator, parser, auth)
- **Integration Tests**: API endpoints (базовые сценарии)
- **E2E Tests**: Основные флоу (upload → quote → order → admin)
- **Manual QA**: UI/UX проверка

### Phase 2 Testing
- **Load Tests**: Slicing worker под нагрузкой
- **Security Tests**: Penetration testing (базовый)
- **Performance Tests**: Frontend (Lighthouse)

---

## Success Metrics (MVP)

1. **Функциональность:**
   - ✅ Пользователь может загрузить STL/3MF
   - ✅ Получить мгновенный расчет стоимости
   - ✅ Оформить заказ
   - ✅ Видеть статус заказа в кабинете
   - ✅ Админ может управлять заказами и очередью

2. **Производительность:**
   - Instant quote < 1 сек
   - File upload < 5 сек для файлов до 50 МБ
   - 3D Viewer загрузка < 3 сек

3. **Надежность:**
   - Uptime > 99% (после деплоя)
   - Нет критичных багов после недели production

---

## Post-MVP Roadmap (Phase 3+)

- **Multi-language support** (i18n)
- **Mobile app** (React Native или Flutter)
- **Marketplace** (заказы от других пользователей → мастера)
- **Material/Color marketplace** (продажа филамента)
- **3D Model Library** (библиотека готовых моделей для продажи)
- **Advanced analytics** (prediction, trends)

---

## Вопросы для владельца бизнеса (приоритизация)

1. **Критично ли иметь точный расчет (slicing) в MVP?**
   - Если да → включить slicing в MVP (добавить 1-2 недели)
   - Если нет → оставить на Phase 2

2. **Нужна ли онлайн-оплата в MVP?**
   - Если да → интегрировать провайдера в MVP
   - Если нет (например, оплата при получении) → оставить mock в MVP

3. **Приоритет AI-функций?**
   - Если высокий → начать Phase 2 с AI
   - Если низкий → сначала slicing и оптимизации

4. **Какие материалы/принтеры включить в seed data?**
   - Предоставить список или использовать типовые (PLA/ABS/PETG, Prusa MK4/Ender 3 Pro)

---

## Решение: Recommended MVP Configuration

**Включить в MVP:**
- ✅ Core, Models, Pricing (instant), Orders, Queue, Shipping, Admin, Frontend
- ✅ Feature flags (slicing/payment/ai disabled)
- ✅ Базовый UI Kit (без сложных компонентов типа UiTable)

**Отложить на Phase 2:**
- Slicing (CuraEngine integration)
- AI (OpenAI integration)
- Payment (реальные провайдеры)
- Shipping API (СДЭК и т.д.)
- Advanced UI components
- Monitoring/Analytics

**Срок MVP: 5-6 недель full-time разработки**

**Срок Phase 2: 2-4 недели после MVP (в зависимости от приоритетов)**

---

**Итого: MVP предоставляет полноценную функциональность для ручного управления заказами 3D-печати с мгновенным расчетом стоимости, а Phase 2 добавляет автоматизацию (слайсинг, AI) и интеграции (оплата, доставка).**
