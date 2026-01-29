# Конфигурация интеграций - 3D Print Service

## Обзор интеграций (ПОЛНАЯ ВЕРСИЯ)

Согласно требованиям владельца бизнеса, система включает:

✅ **Slicing** — CuraEngine для точного расчета (включено)  
✅ **Payment** — ЮKassa для онлайн-оплаты (включено)  
✅ **Shipping** — API Почты России для расчета доставки (включено)  
⏸️ **AI** — Задел есть, но пока отключено (будет включено позже)

---

## 1. Настройка ЮKassa (Онлайн-оплата)

### 1.1 Регистрация и получение ключей

1. Зарегистрируйтесь на https://yookassa.ru/
2. Создайте магазин
3. Получите:
   - **shopId** (идентификатор магазина)
   - **Secret Key** (секретный ключ для API)

### 1.2 Конфигурация в `.env`

```env
# ЮKassa
YUKASSA_SHOP_ID=your_shop_id_here
YUKASSA_SECRET_KEY=your_secret_key_here
YUKASSA_RETURN_URL=https://print.yourdomain.com/orders/{order_id}/payment-result
```

### 1.3 Webhook URL

Настройте webhook в личном кабинете ЮKassa:

**URL:** `https://print.yourdomain.com/api/v1/payment/webhook/yukassa`

**События:**
- `payment.succeeded` — оплата успешна
- `payment.canceled` — оплата отменена
- `refund.succeeded` — возврат выполнен

### 1.4 Тестирование

ЮKassa предоставляет тестовую среду:

**Тестовые карты:**
- Успешная оплата: `5555 5555 5555 4477`, CVC: `123`, срок: любой будущий
- Отклоненная оплата: `5555 5555 5555 4444`

**Документация:** https://yookassa.ru/developers/api

---

## 2. Настройка API Почты России (Доставка)

### 2.1 Регистрация

1. Зарегистрируйтесь на https://otpravka.pochta.ru/
2. Получите доступ к API (требуется договор с Почтой России)
3. Получите:
   - **API Key**
   - **API Token**
   - **Authorization Token** (для запросов)

### 2.2 Конфигурация в `.env`

```env
# Почта России API
RUSSIAN_POST_API_URL=https://otpravka-api.pochta.ru/1.0
RUSSIAN_POST_API_KEY=your_api_key_here
RUSSIAN_POST_API_TOKEN=your_api_token_here
RUSSIAN_POST_AUTH_TOKEN=your_auth_token_here
RUSSIAN_POST_FROM_INDEX=101000
```

### 2.3 Методы API

**Расчет стоимости доставки:**
```
POST /1.0/tariff
Authorization: AccessToken {token}
X-User-Authorization: Basic {base64(login:password)}

Body:
{
  "object": "PARCEL",
  "from": 101000,
  "to": 190000,
  "weight": 1000,
  "pack": "PACKAGE"
}
```

**Отслеживание отправления:**
```
GET /1.0/tracking/{tracking_number}
```

**Документация:** https://otpravka.pochta.ru/specification

### 2.4 Альтернатива (если нет договора с Почтой России)

Можно использовать **тарификатор Почты России** (публичный API без авторизации):

**URL:** `https://tariff.pochta.ru/v2/calculate/tariff/delivery`

**Пример запроса:**
```json
{
  "object": "27020",
  "from": "101000",
  "to": "190000",
  "weight": 1000
}
```

---

## 3. Настройка CuraEngine (Точный расчет слайсинга)

### 3.1 Установка CuraEngine

**Ubuntu/Debian:**
```bash
# Установка через apt (если доступно)
sudo apt-get update
sudo apt-get install cura-engine

# Или компиляция из исходников
git clone https://github.com/Ultimaker/CuraEngine.git
cd CuraEngine
mkdir build && cd build
cmake ..
make
sudo make install
```

**Проверка установки:**
```bash
CuraEngine help
```

### 3.2 Конфигурация в `.env`

```env
# CuraEngine
CURAENGINE_PATH=/usr/bin/CuraEngine
SLICING_TIMEOUT_MS=60000
SLICING_MAX_CONCURRENCY=2
FEATURE_SLICING=true
```

### 3.3 Профили слайсера

Профили хранятся в `server/slicing/profiles/*.json`

**Пример профиля (Standard PLA):**
```json
{
  "name": "Standard PLA",
  "settings": {
    "layer_height": 0.2,
    "wall_thickness": 0.8,
    "top_bottom_thickness": 0.8,
    "infill_sparse_density": 20,
    "infill_pattern": "grid",
    "speed_print": 50,
    "speed_travel": 150,
    "support_enable": true,
    "support_type": "buildplate",
    "adhesion_type": "brim",
    "material_print_temperature": 200,
    "material_bed_temperature": 60,
    "retraction_enable": true,
    "retraction_distance": 5
  }
}
```

### 3.4 Запуск слайсинга

**Команда:**
```bash
CuraEngine slice -j profile.json -o output.gcode -l model.stl
```

**Парсинг результата:**
```javascript
// Из gcode комментариев:
// ;TIME:43200
// ;Filament used: 9.5m
// ;Layer count: 250
```

---

## 4. Настройка Email (SMTP)

### 4.1 Конфигурация в `.env`

```env
# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="3D Print Service <noreply@yourdomain.com>"
```

### 4.2 Gmail App Password

Если используете Gmail:
1. Включите двухфакторную аутентификацию
2. Создайте App Password: https://myaccount.google.com/apppasswords
3. Используйте сгенерированный пароль в `EMAIL_PASSWORD`

### 4.3 Альтернативные провайдеры

**Mailgun:**
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@yourdomain.mailgun.org
EMAIL_PASSWORD=your_mailgun_password
```

**SendGrid:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

---

## 5. Pricing Configuration (Ценообразование)

### 5.1 Данные от владельца бизнеса

**Материалы:**
- Стоимость: **1500 руб/кг = 1.5 руб/грамм**
- Применяется ко всем материалам по умолчанию

**Маржа:**
- **20%** от себестоимости (труд + материал + машинное время)

**Минимальная цена заказа:**
- **500 руб**

**Постобработка:**
- Шлифовка механическая: **200 руб** (+1 день)
- Химическая полировка: **500 руб** (+2 дня, только ABS)
- Покраска базовая: **800 руб** (+3 дня)
- Покраска сложная: **2000 руб** (+5 дней)

### 5.2 Обновление в админке

Все параметры можно изменить через админ-панель:

**Settings → Pricing Rules:**
- Setup Fee (фикс. надбавка)
- Labor Fixed (фикс. труд на деталь)
- Margin Percent (маржа %)
- Min Order Price (минимальная цена)

**Settings → Materials:**
- Добавление/редактирование материалов
- Цена за грамм, плотность, цвета

**Settings → Printers:**
- Тарифы (руб/час) для каждого принтера индивидуально

---

## 6. Feature Flags (Включение модулей)

### 6.1 Текущие настройки (ПОЛНАЯ ВЕРСИЯ)

```javascript
{
  models: true,      // Загрузка моделей
  pricing: true,     // Мгновенный расчет
  slicing: true,     // ✅ Точный расчет (CuraEngine)
  orders: true,      // Заказы
  queue: true,       // Очередь производства
  shipping: true,    // Доставка (Почта России API)
  payment: true,     // ✅ Онлайн-оплата (ЮKassa)
  ai: false,         // AI (пока отключен)
  admin: true        // Админ-панель
}
```

### 6.2 Управление через админку

**Admin Panel → Settings → Feature Flags:**
- Включение/выключение модулей без перезапуска сервера
- UI автоматически адаптируется (скрывает неактивные функции)

---

## 7. Безопасность

### 7.1 JWT Secret

**КРИТИЧНО:** Измените `JWT_SECRET` в production:

```env
JWT_SECRET=your-super-secret-random-string-min-32-chars
```

Генерация:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 7.2 Helmet.js

Автоматически настроен для защиты от базовых атак (XSS, clickjacking, и т.д.)

### 7.3 Rate Limiting

**Дефолты:**
- Guest: 100 запросов / 15 минут
- User: 1000 запросов / 15 минут
- Admin: 10000 запросов / 15 минут

Настройка в `.env`:
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 8. Проверка конфигурации

### 8.1 Health Check

```bash
curl http://localhost:3100/health
```

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-11T12:00:00.000Z"
}
```

### 8.2 Feature Flags Check

```bash
curl http://localhost:3100/api/v1/feature-flags
```

**Ответ:**
```json
{
  "flags": {
    "models": true,
    "pricing": true,
    "slicing": true,
    "orders": true,
    "queue": true,
    "shipping": true,
    "payment": true,
    "ai": false
  }
}
```

---

## 9. TODO: Действия для владельца бизнеса

### Критично перед запуском:

1. ✅ **ЮKassa:**
   - [ ] Зарегистрировать магазин
   - [ ] Получить shopId и Secret Key
   - [ ] Настроить webhook
   - [ ] Протестировать тестовыми картами

2. ✅ **Почта России:**
   - [ ] Получить доступ к API Отправки (или использовать публичный тарификатор)
   - [ ] Добавить API ключи в конфигурацию
   - [ ] Протестировать расчет доставки

3. ✅ **CuraEngine:**
   - [ ] Установить на сервер
   - [ ] Создать профили качества для материалов
   - [ ] Протестировать слайсинг тестовой модели

4. ✅ **Email:**
   - [ ] Настроить SMTP (Gmail/Mailgun/SendGrid)
   - [ ] Протестировать отправку писем

5. ✅ **Принтеры:**
   - [ ] Добавить реальные принтеры в `seeds/printers.json`
   - [ ] Установить корректные тарифы (руб/час)

6. ✅ **Безопасность:**
   - [ ] Сгенерировать новый `JWT_SECRET`
   - [ ] Настроить HTTPS (Let's Encrypt)
   - [ ] Настроить Firewall (только 80, 443, SSH)

---

## 10. Документация по интеграциям

- **ЮKassa:** https://yookassa.ru/developers/api
- **Почта России:** https://otpravka.pochta.ru/specification
- **CuraEngine:** https://github.com/Ultimaker/CuraEngine
- **Nodemailer:** https://nodemailer.com/about/

---

**Все интеграции настроены согласно требованиям владельца бизнеса. Система готова к полноценной работе после заполнения API ключей.**
