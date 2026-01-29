-- ============================================
-- 002: Seed Data for 3D Print Service
-- Данные основаны на требованиях владельца бизнеса
-- ============================================

-- ============================================
-- Feature Flags (ВСЕ ВКЛЮЧЕНЫ - полноценная система)
-- ============================================

INSERT INTO feature_flags (key, enabled, scope, description) VALUES
  ('models', 1, 'global', 'Загрузка и управление 3D-моделями'),
  ('pricing', 1, 'global', 'Мгновенная оценка стоимости'),
  ('slicing', 1, 'global', 'Точный расчет через CuraEngine (ВКЛЮЧЕНО)'),
  ('orders', 1, 'global', 'Оформление заказов'),
  ('queue', 1, 'global', 'Очередь производства'),
  ('shipping', 1, 'global', 'Расчет доставки через API Почты России'),
  ('payment', 1, 'global', 'Онлайн-оплата через ЮKassa (ВКЛЮЧЕНО)'),
  ('ai', 0, 'global', 'AI-помощник (пока отключен, задел есть)'),
  ('admin', 1, 'global', 'Админ-панель');

-- ============================================
-- Materials (Материалы для FDM печати)
-- Цена: 1500 руб/кг = 1.5 руб/грамм
-- ============================================

INSERT INTO materials (name, type, density, price_per_gram, available_colors_json, slicer_settings_json, is_active) VALUES
  (
    'PLA',
    'FDM',
    1.24,
    1.5,
    '["Белый", "Черный", "Красный", "Синий", "Зеленый", "Желтый", "Серый", "Оранжевый"]',
    '{"temp": 200, "bed_temp": 60, "speed": 50, "retraction": 5}',
    1
  ),
  (
    'ABS',
    'FDM',
    1.04,
    1.5,
    '["Белый", "Черный", "Красный", "Синий", "Натуральный"]',
    '{"temp": 240, "bed_temp": 100, "speed": 40, "retraction": 3}',
    1
  ),
  (
    'PETG',
    'FDM',
    1.27,
    1.8,
    '["Прозрачный", "Черный", "Синий", "Красный", "Зеленый"]',
    '{"temp": 230, "bed_temp": 80, "speed": 45, "retraction": 4}',
    1
  ),
  (
    'TPU (Flexible)',
    'FDM',
    1.21,
    2.5,
    '["Черный", "Белый", "Красный", "Синий"]',
    '{"temp": 220, "bed_temp": 50, "speed": 25, "retraction": 2}',
    1
  ),
  (
    'Nylon (PA)',
    'FDM',
    1.14,
    2.0,
    '["Натуральный", "Черный"]',
    '{"temp": 250, "bed_temp": 80, "speed": 40, "retraction": 5}',
    1
  );

-- ============================================
-- Printers (Примеры, нужно заполнить реальными данными)
-- Тарифы: индивидуально для каждого принтера
-- ============================================

INSERT INTO printers (name, type, bed_x, bed_y, bed_z, nozzle_size, price_per_hour, max_speed, supported_materials_json, status, metadata_json) VALUES
  (
    'Prusa MK4 #1',
    'FDM',
    250,
    210,
    220,
    0.4,
    300,
    200,
    '[1, 2, 3]',
    'available',
    '{"location": "Цех 1", "notes": "Основной принтер для PLA/PETG"}'
  ),
  (
    'Ender 3 Pro #1',
    'FDM',
    220,
    220,
    250,
    0.4,
    150,
    150,
    '[1, 2]',
    'available',
    '{"location": "Цех 1", "notes": "Бюджетный принтер"}'
  ),
  (
    'Creality CR-10 #1',
    'FDM',
    300,
    300,
    400,
    0.4,
    400,
    180,
    '[1, 2, 3, 5]',
    'available',
    '{"location": "Цех 2", "notes": "Большой формат"}'
  ),
  (
    'Artillery Sidewinder X2 #1',
    'FDM',
    300,
    300,
    400,
    0.4,
    350,
    200,
    '[1, 2, 3]',
    'available',
    '{"location": "Цех 2", "notes": "Быстрая печать"}'
  ),
  (
    'Bambu Lab X1 Carbon #1',
    'FDM',
    256,
    256,
    256,
    0.4,
    500,
    250,
    '[1, 2, 3, 4]',
    'available',
    '{"location": "Цех 3", "notes": "Премиум принтер с мульти-материалом"}'
  );

-- TODO: Добавить реальные принтеры с актуальными тарифами

-- ============================================
-- Print Profiles (Качество печати)
-- ============================================

INSERT INTO print_profiles (name, layer_height, infill_default, speed_default, supports_default, time_multiplier, price_multiplier, slicer_profile_path) VALUES
  (
    'Черновик (Draft)',
    0.28,
    15,
    80,
    0,
    0.6,
    0.8,
    '/profiles/draft.json'
  ),
  (
    'Стандарт (Standard)',
    0.2,
    20,
    50,
    0,
    1.0,
    1.0,
    '/profiles/standard.json'
  ),
  (
    'Высокое качество (Fine)',
    0.12,
    20,
    40,
    0,
    1.8,
    1.4,
    '/profiles/fine.json'
  ),
  (
    'Ультра качество (Ultra Fine)',
    0.08,
    25,
    30,
    0,
    3.0,
    2.0,
    '/profiles/ultra_fine.json'
  );

-- ============================================
-- Pricing Rules
-- Маржа: 20% (по требованию владельца)
-- Минимальная цена заказа: 500 руб
-- ============================================

INSERT INTO pricing_rules (
  setup_fee,
  labor_rate_per_hour,
  labor_fixed,
  margin_percent,
  min_order_price,
  bulk_discount_rules_json,
  postprocess_options_json
) VALUES (
  100,
  0,
  50,
  20,
  500,
  '[]',
  '[
    {
      "name": "none",
      "label": "Без обработки",
      "price": 0,
      "days": 0
    },
    {
      "name": "sanding",
      "label": "Шлифовка (механическая)",
      "price": 200,
      "days": 1
    },
    {
      "name": "chemical_smoothing",
      "label": "Химическая полировка",
      "price": 500,
      "days": 2,
      "materials": ["ABS"]
    },
    {
      "name": "painting_basic",
      "label": "Покраска (базовая, 1 цвет)",
      "price": 800,
      "days": 3
    },
    {
      "name": "painting_advanced",
      "label": "Покраска (сложная, градиенты)",
      "price": 2000,
      "days": 5
    }
  ]'
);

-- ============================================
-- Shipping Methods
-- API Почты России для расчета
-- ============================================

INSERT INTO shipping_methods (name, type, base_price, zones_json, api_config_json, estimated_days_min, estimated_days_max, is_active) VALUES
  (
    'Самовывоз',
    'fixed',
    0,
    NULL,
    NULL,
    1,
    1,
    1
  ),
  (
    'Курьерская доставка (Москва)',
    'fixed',
    300,
    NULL,
    NULL,
    1,
    2,
    1
  ),
  (
    'Почта России (расчет через API)',
    'api',
    0,
    NULL,
    '{
      "provider": "russian_post",
      "api_url": "https://otpravka-api.pochta.ru/",
      "api_key": "CHANGE_ME",
      "api_token": "CHANGE_ME",
      "default_from_index": "101000"
    }',
    5,
    14,
    1
  );

-- TODO: Добавить API ключи Почты России в конфигурацию

-- ============================================
-- Email Templates (базовые шаблоны)
-- ============================================

INSERT INTO email_templates (key, subject, body_html, body_text, variables_json, is_active) VALUES
  (
    'order_created',
    'Заказ {{ order_number }} создан',
    '<h1>Спасибо за заказ!</h1>
    <p>Ваш заказ <strong>{{ order_number }}</strong> успешно создан.</p>
    <p>Сумма заказа: <strong>{{ total }} руб.</strong></p>
    <p>Мы свяжемся с вами в ближайшее время.</p>
    <p><a href="{{ order_url }}">Посмотреть заказ</a></p>',
    'Спасибо за заказ! Ваш заказ {{ order_number }} создан. Сумма: {{ total }} руб.',
    '["order_number", "total", "order_url", "name"]',
    1
  ),
  (
    'order_status_changed',
    'Статус заказа {{ order_number }} изменен',
    '<h1>Статус заказа изменен</h1>
    <p>Заказ <strong>{{ order_number }}</strong></p>
    <p>Новый статус: <strong>{{ status }}</strong></p>
    <p>{{ comment }}</p>
    <p><a href="{{ order_url }}">Посмотреть заказ</a></p>',
    'Статус заказа {{ order_number }} изменен на {{ status }}.',
    '["order_number", "status", "comment", "order_url"]',
    1
  ),
  (
    'order_shipped',
    'Заказ {{ order_number }} отправлен',
    '<h1>Ваш заказ отправлен!</h1>
    <p>Заказ <strong>{{ order_number }}</strong> отправлен.</p>
    <p>Трек-номер: <strong>{{ tracking_number }}</strong></p>
    <p>Ожидаемая доставка: {{ estimated_delivery }}</p>',
    'Заказ {{ order_number }} отправлен. Трек-номер: {{ tracking_number }}',
    '["order_number", "tracking_number", "estimated_delivery"]',
    1
  ),
  (
    'payment_received',
    'Оплата заказа {{ order_number }} получена',
    '<h1>Оплата получена</h1>
    <p>Заказ <strong>{{ order_number }}</strong> оплачен.</p>
    <p>Сумма: <strong>{{ amount }} руб.</strong></p>
    <p>Мы приступили к производству.</p>',
    'Оплата заказа {{ order_number }} получена. Сумма: {{ amount }} руб.',
    '["order_number", "amount"]',
    1
  );

-- ============================================
-- Settings (дополнительные настройки)
-- ============================================

INSERT INTO settings (key, value_json, description) VALUES
  (
    'site_name',
    '"3D Print Service"',
    'Название сервиса'
  ),
  (
    'site_email',
    '"info@3dprint.example.com"',
    'Email для уведомлений'
  ),
  (
    'site_phone',
    '"+7 (999) 123-45-67"',
    'Телефон для связи'
  ),
  (
    'yukassa_shop_id',
    '"CHANGE_ME"',
    'ID магазина ЮKassa'
  ),
  (
    'yukassa_secret_key',
    '"CHANGE_ME"',
    'Секретный ключ ЮKassa'
  ),
  (
    'curaengine_path',
    '"/usr/bin/CuraEngine"',
    'Путь к CuraEngine (для точного расчета)'
  ),
  (
    'slicing_enabled',
    'true',
    'Включен ли точный расчет через слайсинг'
  );

-- ============================================
-- Admin User (создать через скрипт отдельно)
-- ============================================

-- TODO: Запустить скрипт create-admin.js для создания первого админа
