# План интеграции UI Kit и 3D-лендинга

## 1. Анализ существующего UI Kit

### 1.1 Имеющиеся компоненты

Из анализа кодовой базы выявлено:

**Базовые компоненты (`src/ui/components`):**
- `UiButton.vue` — кнопка с вариантами (primary/secondary/danger/ghost), размерами, loading state
- `UiCard.vue` — карточка контента с padding
- `UiInput.vue` — текстовое поле ввода
- `UiSelect.vue` — выпадающий список
- `UiModal.vue` — модальное окно
- `UiTextarea.vue` — многострочное текстовое поле
- `UiFormField.vue` — обертка для поля формы (label + validation + error)

**Общие UI компоненты (`src/components/ui`):**
- `Section.vue` — секция страницы
- `Icon.vue` — иконки (вероятно SVG sprite или font icons)

**Design Tokens (`@/assets/styles/variables.scss`):**
- Цвета: `$primary-teal`, `$primary-coral`, `$gray-*`, `$white`
- Спейсинг: `$spacing-*`
- Типографика: `$text-sm`, `$text-base`, `$text-lg`
- Border radius: `$border-radius-md`, `$border-radius-lg`
- Shadows: `$shadow-sm`
- Transitions: `$transition-fast`

---

## 2. Стратегия интеграции для 3D Print Service

### 2.1 Принципы

1. **Использовать только существующий UI Kit**: не подключать сторонние UI-библиотеки (Vuetify, Element UI и т.д.)
2. **Расширять, а не заменять**: если не хватает компонента — создать в стиле существующих
3. **Consistency first**: все новые компоненты должны использовать те же токены, паттерны, naming conventions
4. **Доступность**: соблюдать ARIA, keyboard navigation, screen reader support

---

### 2.2 Недостающие компоненты для Print Service

**Необходимо создать:**

#### 2.2.1 `UiFileUpload.vue`
**Назначение:** Drag&drop зона загрузки файлов + input[type=file]

**Функции:**
- Drag&drop STL/3MF файлов
- Multiple files support
- Отображение списка загруженных файлов с прогресс-барами
- Валидация формата и размера
- Кнопка "Upload from URL"

**Пропсы:**
```typescript
{
  accept: string[] // ['.stl', '.3mf']
  maxSize: number // bytes
  maxFiles: number
  multiple: boolean
  modelValue: File[] | null
}
```

---

#### 2.2.2 `UiSlider.vue`
**Назначение:** Slider для выбора качества печати "Время ↔ Качество"

**Функции:**
- Range slider с метками
- Показ значения (Draft / Standard / Fine)
- Интерактивные подсказки (tooltip)

**Пропсы:**
```typescript
{
  min: number
  max: number
  step: number
  modelValue: number
  labels: { value: number, label: string }[]
}
```

---

#### 2.2.3 `UiBadge.vue`
**Назначение:** Бейдж для статусов (заказов, очереди)

**Варианты:** `info`, `success`, `warning`, `danger`, `neutral`

**Пропсы:**
```typescript
{
  variant: 'info' | 'success' | 'warning' | 'danger' | 'neutral'
  size: 'sm' | 'md'
}
```

---

#### 2.2.4 `UiTable.vue`
**Назначение:** Таблица для админ-панели (заказы, очередь, материалы)

**Функции:**
- Сортировка колонок
- Фильтрация
- Пагинация
- Выбор строк (checkbox)
- Слоты для кастомных ячеек

**Пропсы:**
```typescript
{
  columns: { key: string, label: string, sortable?: boolean, width?: string }[]
  data: any[]
  loading: boolean
  selectable: boolean
  selectedRows: any[]
}
```

---

#### 2.2.5 `UiTabs.vue`
**Назначение:** Табы для админ-панели (Settings: Materials / Printers / Profiles)

**Пропсы:**
```typescript
{
  tabs: { key: string, label: string, icon?: string }[]
  modelValue: string // активный tab key
}
```

---

#### 2.2.6 `UiTooltip.vue`
**Назначение:** Подсказки (для параметров печати, иконок, и т.д.)

**Пропсы:**
```typescript
{
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
  trigger: 'hover' | 'click'
}
```

---

#### 2.2.7 `UiNotification.vue` / `UiToast.vue`
**Назначение:** Уведомления (успех загрузки, ошибки, статусы)

**Типы:** `success`, `error`, `warning`, `info`

---

#### 2.2.8 `UiSkeleton.vue`
**Назначение:** Skeleton loader для loading states (3D viewer, таблицы)

**Варианты:** `text`, `rect`, `circle`

---

#### 2.2.9 `UiAccordion.vue`
**Назначение:** Аккордеон для FAQ, advanced параметров печати

---

#### 2.2.10 `UiStepper.vue`
**Назначение:** Индикатор шагов для checkout (Модель → Параметры → Контакты → Оплата)

**Пропсы:**
```typescript
{
  steps: { key: string, label: string, completed?: boolean }[]
  currentStep: string
}
```

---

### 2.3 Структура UI Kit для Print Service

```
src/
  ui/
    components/
      # Существующие
      UiButton.vue
      UiCard.vue
      UiInput.vue
      UiSelect.vue
      UiModal.vue
      UiTextarea.vue
      UiFormField.vue
      
      # Новые для Print Service
      UiFileUpload.vue
      UiSlider.vue
      UiBadge.vue
      UiTable.vue
      UiTabs.vue
      UiTooltip.vue
      UiNotification.vue
      UiSkeleton.vue
      UiAccordion.vue
      UiStepper.vue
      
    index.ts  # Экспорты всех компонентов
    
  assets/
    styles/
      variables.scss  # Design tokens (существующие)
      mixins.scss     # Миксины (создать если нет)
      print-service.scss  # Специфичные стили для Print Service (опционально)
```

---

## 3. 3D-лендинг: технологии и оптимизация

### 3.1 Выбор библиотеки для 3D-эффектов

**Выбор: Three.js + Troika-text-3d**

**Обоснование:**
- **Three.js**: индустриальный стандарт для WebGL, отличная документация, большое сообщество
- **Troika-text-3d**: специализированная библиотека для 3D-текста с отличной производительностью
- **Альтернативы рассмотрены:**
  - Babylon.js: более тяжеловесный, избыточен для лендинга
  - CSS 3D Transforms: недостаточно для "полноценного 3D-эффекта" по требованиям

**Установка:**
```bash
npm install three @troika-js/troika-three-text
```

---

### 3.2 Компоненты 3D-лендинга

#### 3.2.1 `ThreeScene.vue`
**Назначение:** Базовая обертка для Three.js сцены (переиспользуемая)

**Функции:**
- Инициализация renderer, scene, camera
- Обработка resize
- Animation loop
- Cleanup on unmount

**Пропсы:**
```typescript
{
  cameraPosition: { x: number, y: number, z: number }
  antialias: boolean
  alpha: boolean // прозрачный фон
}
```

**Слоты:**
- `default` — содержимое сцены (lights, objects, text)

---

#### 3.2.2 `ThreeText3D.vue`
**Назначение:** 3D-текст с анимацией (для hero section)

**Функции:**
- Troika-text-3d рендеринг
- Анимации: rotation, wave, float
- Gradient materials или PBR materials
- Shadow casting

**Пропсы:**
```typescript
{
  text: string
  fontSize: number
  color: string | string[] // gradient
  animation: 'rotate' | 'wave' | 'float' | 'none'
  animationSpeed: number
}
```

---

#### 3.2.3 `PrinterAnimation.vue`
**Назначение:** Анимированная визуализация 3D-принтера в работе

**Функции:**
- GLB/GLTF модель принтера (можно найти free или создать простую)
- Анимация экструзии (сетка слоев)
- Эффект "печать в реальном времени"

---

### 3.3 Оптимизация производительности

#### 3.3.1 Уровни детализации (LOD)
```javascript
// Использовать THREE.LOD для сложных моделей
const lod = new THREE.LOD();
lod.addLevel(highDetailMesh, 0);
lod.addLevel(mediumDetailMesh, 50);
lod.addLevel(lowDetailMesh, 100);
```

---

#### 3.3.2 Lazy Loading сцен
```javascript
// Не загружать Three.js сразу, только когда пользователь скроллит к секции
import { defineAsyncComponent } from 'vue'

const ThreeText3D = defineAsyncComponent(() => 
  import('@/components/3d/ThreeText3D.vue')
)
```

---

#### 3.3.3 Мобильная оптимизация
- **Низкое разрешение renderer** на мобилках:
  ```javascript
  const pixelRatio = window.devicePixelRatio > 1 
    ? Math.min(window.devicePixelRatio, 2) 
    : 1
  renderer.setPixelRatio(pixelRatio)
  ```
- **Упрощенные материалы** (MeshBasicMaterial вместо PBR)
- **Отключение shadows** на слабых устройствах
- **Fallback на статичное изображение** если WebGL недоступен

---

#### 3.3.4 Ограничение FPS
```javascript
let lastTime = 0
const fps = 30
const interval = 1000 / fps

function animate(time) {
  requestAnimationFrame(animate)
  
  const delta = time - lastTime
  if (delta < interval) return
  
  lastTime = time - (delta % interval)
  
  // Render scene
  renderer.render(scene, camera)
}
```

---

#### 3.3.5 WebGL Feature Detection & Fallback
```javascript
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch (e) {
    return false
  }
}

// В компоненте:
<ThreeText3D v-if="isWebGLAvailable" ... />
<img v-else src="/fallback-3d-text.png" alt="3D Text" />
```

---

### 3.4 Структура 3D-компонентов

```
src/
  components/
    3d/
      ThreeScene.vue          # Базовая обертка
      ThreeText3D.vue         # 3D-текст
      PrinterAnimation.vue    # Анимация принтера
      ModelViewer3D.vue       # Viewer для STL/3MF (для калькулятора)
      
  composables/
    useThree.ts               # Реюзабельная логика Three.js
    useWebGLDetection.ts      # Детектор WebGL
    
  utils/
    three/
      loaders.ts              # STL/3MF/GLTF загрузчики
      materials.ts            # Переиспользуемые материалы
      animations.ts           # Анимационные хелперы
```

---

### 3.5 Composables для Three.js

#### `useThree.ts`
```typescript
import { onMounted, onUnmounted, ref, Ref } from 'vue'
import * as THREE from 'three'

export function useThree(
  containerRef: Ref<HTMLElement | null>,
  options: {
    antialias?: boolean
    alpha?: boolean
    cameraPosition?: [number, number, number]
  } = {}
) {
  const scene = ref<THREE.Scene | null>(null)
  const camera = ref<THREE.PerspectiveCamera | null>(null)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  
  const init = () => {
    if (!containerRef.value) return
    
    // Scene
    scene.value = new THREE.Scene()
    
    // Camera
    camera.value = new THREE.PerspectiveCamera(
      75,
      containerRef.value.clientWidth / containerRef.value.clientHeight,
      0.1,
      1000
    )
    const [x, y, z] = options.cameraPosition || [0, 0, 5]
    camera.value.position.set(x, y, z)
    
    // Renderer
    renderer.value = new THREE.WebGLRenderer({
      antialias: options.antialias ?? true,
      alpha: options.alpha ?? false
    })
    renderer.value.setSize(
      containerRef.value.clientWidth,
      containerRef.value.clientHeight
    )
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.value.appendChild(renderer.value.domElement)
  }
  
  const animate = (callback: () => void) => {
    const loop = () => {
      requestAnimationFrame(loop)
      callback()
      if (renderer.value && camera.value && scene.value) {
        renderer.value.render(scene.value, camera.value)
      }
    }
    loop()
  }
  
  const cleanup = () => {
    if (renderer.value) {
      renderer.value.dispose()
      containerRef.value?.removeChild(renderer.value.domElement)
    }
  }
  
  onMounted(init)
  onUnmounted(cleanup)
  
  return { scene, camera, renderer, animate }
}
```

---

## 4. Страницы 3D Print Service

### 4.1 Landing Page (`/print` или `/print/landing`)

**Секции:**

1. **Hero**
   - 3D-текст: "Закажите 3D-печать онлайн"
   - Анимированная модель принтера (или абстрактная 3D-фигура)
   - CTA кнопка: "Рассчитать стоимость" → `/print/calculator`
   - Краткое описание: "Загрузите модель, получите мгновенную оценку, заказывайте"

2. **Как это работает** (Steps Section)
   - Карточки с иконками:
     1. Загрузите 3D-модель (STL/3MF)
     2. Выберите материал и параметры
     3. Получите расчет стоимости и сроков
     4. Оформите заказ и оплатите
     5. Производство и доставка
   - Использовать `UiCard` и `UiIcon`

3. **Возможности** (Features Section)
   - Сетка карточек:
     - Мгновенный расчет
     - Интерактивный 3D-просмотр
     - Выбор материалов (PLA/ABS/PETG/TPU)
     - Контроль качества
     - Отслеживание заказа
     - AI-помощник (если включен)
   - Анимированные иконки или 3D-миниатюры

4. **Примеры работ** (Gallery Section, опционально)
   - Слайдер с фото/3D-моделями выполненных заказов
   - Данные загружаются из админки (content management)

5. **FAQ** (Accordion Section)
   - Использовать `UiAccordion`
   - Вопросы: форматы файлов, сроки, оплата, доставка

6. **CTA Footer**
   - "Готовы начать?" + кнопка "Рассчитать заказ"

**Компоненты:**
- `ThreeText3D.vue` для hero
- `PrinterAnimation.vue` (опционально)
- `UiCard`, `UiButton`, `UiAccordion` из UI Kit

---

### 4.2 Calculator Page (`/print/calculator`)

**Макет:**

```
┌──────────────────────────────────────────────────────────┐
│  Navbar (главного сайта)                                 │
├──────────────────────────────────────────────────────────┤
│  Breadcrumbs: Главная > Печать > Калькулятор             │
├────────────────────┬─────────────────────────────────────┤
│                    │                                     │
│  Upload Zone       │  3D Viewer                          │
│  (Drag&drop STL)   │  (ModelViewer3D.vue)                │
│                    │                                     │
│  + Upload from URL │  Controls: Rotate/Zoom/Reset        │
│                    │  Dimensions: 100×80×50 mm           │
│                    │  Volume: 125 cm³                    │
├────────────────────┴─────────────────────────────────────┤
│  Model List (если загружено несколько)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ model1.stl | 100×80×50 | 125cm³ | Qty: [2] | ⚙ │ 🗑 │
│  └──────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────┤
│  Параметры печати                                        │
│  ┌──────────────────┬────────────────┬─────────────────┐ │
│  │ Материал         │ Цвет           │ Качество         │ │
│  │ [PLA ▼]          │ [Black ▼]      │ Время ◄─●──► Качество │
│  │                  │                │ [Standard]       │ │
│  └──────────────────┴────────────────┴─────────────────┘ │
│                                                           │
│  Advanced (Accordion, collapsed by default)              │
│  ├─ Infill: [20]% slider                                 │
│  ├─ Supports: [✓] checkbox                               │
│  ├─ Shells: [3] number input                             │
│  └─ Постобработка: [None ▼]                              │
├──────────────────────────────────────────────────────────┤
│  Расчет стоимости (real-time update)                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Стоимость: ₽1,250.50  ≈                            │  │
│  │ Срок: 3-5 дней                                      │  │
│  │                                                     │  │
│  │ Подробнее (Accordion)                               │  │
│  │  • Материал: ₽450                                   │  │
│  │  • Печать: ₽600 (12 ч × ₽50/ч)                     │  │
│  │  • Труд: ₽100                                       │  │
│  │  • Маржа: ₽100.50                                   │  │
│  │                                                     │  │
│  │ [Получить точный расчет] (если slicing=true)        │  │
│  │  → Запустит slicing job, покажет skeleton loader    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  [Добавить в заказ]  [Оформить заказ сейчас]             │
└──────────────────────────────────────────────────────────┘
```

**Компоненты:**
- `UiFileUpload.vue`
- `ModelViewer3D.vue` (Three.js STLLoader + OrbitControls)
- `UiSelect`, `UiSlider`, `UiInput`
- `UiAccordion`
- `UiCard`, `UiButton`
- `UiSkeleton` для loading states

---

### 4.3 Checkout Page (`/print/checkout`)

**Макет:**

```
┌──────────────────────────────────────────────────────────┐
│  Stepper: [1.Модель]→[2.Контакты]→[3.Доставка]→[4.Оплата]│
├─────────────────────────────┬────────────────────────────┤
│  Контактная информация      │  Итого                     │
│  ┌─────────────────────────┐│  ┌──────────────────────┐ │
│  │ UiFormField (Name)      ││  │ 2 × model.stl        │ │
│  │ UiFormField (Email)     ││  │ PLA Black, Standard  │ │
│  │ UiFormField (Phone)     ││  │ ₽1,250 × 2           │ │
│  └─────────────────────────┘│  ├──────────────────────┤ │
│                              │  │ Товары: ₽2,500       │ │
│  Доставка                    │  │ Доставка: ₽300       │ │
│  ┌─────────────────────────┐│  │ Итого: ₽2,800        │ │
│  │ Radio: Самовывоз (₽0)   ││  └──────────────────────┘ │
│  │ Radio: Курьер (₽300)    ││                            │
│  │ Radio: Почта (₽450)     ││  [Оформить заказ]          │
│  └─────────────────────────┘│                            │
│                              │                            │
│  Адрес (если курьер/почта)   │                            │
│  ┌─────────────────────────┐│                            │
│  │ UiFormField (City)      ││                            │
│  │ UiFormField (Street)    ││                            │
│  │ ...                     ││                            │
│  └─────────────────────────┘│                            │
└─────────────────────────────┴────────────────────────────┘
```

**Компоненты:**
- `UiStepper.vue`
- `UiFormField`, `UiInput`, `UiSelect`
- `UiCard`, `UiButton`

---

### 4.4 User Dashboard (`/print/orders`)

**Макет:**

```
┌──────────────────────────────────────────────────────────┐
│  Tabs: [Мои заказы] [2D→3D заявки] (если ai=true)       │
├──────────────────────────────────────────────────────────┤
│  Список заказов (UiTable или карточки)                   │
│  ┌────────────────────────────────────────────────────┐  │
│  │ OP-2026-00100 | В производстве | ₽2,800 | 10.01.26│  │
│  │ OP-2026-00099 | Доставлен      | ₽1,500 | 05.01.26│  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  [+ Новый заказ] (→ /print/calculator)                   │
└──────────────────────────────────────────────────────────┘
```

**Детали заказа (отдельная страница `/print/orders/:id`):**

```
┌──────────────────────────────────────────────────────────┐
│  Заказ OP-2026-00100                                     │
│  UiBadge: [В производстве]                               │
├──────────────────────────────────────────────────────────┤
│  Статус-линия (Timeline)                                 │
│  ●──────●──────●──────○──────○                           │
│  Создан Подтв. Печать Готов Доставлен                   │
├──────────────────────────────────────────────────────────┤
│  Товары                                                   │
│  • model.stl × 2 (PLA Black, Standard) ₽2,500            │
│                                                           │
│  Доставка: Курьер (₽300)                                 │
│  Адрес: ...                                               │
│  Трек-номер: RU123456789                                  │
├──────────────────────────────────────────────────────────┤
│  Сообщения (чат с менеджером)                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Клиент: Можно ли ускорить?                         │  │
│  │ Админ: Постараемся сделать за 2 дня.               │  │
│  └────────────────────────────────────────────────────┘  │
│  [Отправить сообщение...]                                │
└──────────────────────────────────────────────────────────┘
```

**Компоненты:**
- `UiTabs.vue`
- `UiTable.vue` или карточки (`UiCard`)
- `UiBadge.vue`
- Timeline (создать кастомный компонент `UiTimeline.vue`)
- Чат (создать `ChatMessages.vue`)

---

### 4.5 Admin Panel (`/print/admin/*`)

**Структура:**

```
/print/admin/
  /dashboard      — Дашборд с KPI
  /orders         — Список заказов (UiTable)
  /queue          — Очередь производства (UiTable + Kanban?)
  /settings       — Настройки (UiTabs):
    /materials
    /printers
    /profiles
    /pricing
    /shipping
    /emails
    /features
```

**Компоненты:**
- `UiTable.vue` (сортировка, фильтры, пагинация)
- `UiTabs.vue`
- `UiModal.vue` для редактирования
- `UiFormField`, `UiInput`, `UiSelect`, `UiTextarea`
- `UiBadge.vue` для статусов
- `UiButton.vue` (actions: edit, delete, assign)

---

## 5. Responsive Design

**Брейкпоинты (предположительно из существующего проекта):**
```scss
$breakpoint-mobile: 640px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;
$breakpoint-wide: 1280px;
```

**Стратегия:**
- **Mobile-first**: базовые стили для мобильных, media queries для десктопа
- **Calculator**: на мобилке 3D Viewer и Upload в collapsed tabs (UiTabs)
- **Admin Panel**: на мобилке боковое меню → гамбургер-меню
- **3D Landing**: на мобилке упрощенные анимации (или fallback на статику)

---

## 6. Accessibility (A11y)

**Обязательные требования:**

1. **Keyboard Navigation:**
   - Все интерактивные элементы доступны через Tab/Shift+Tab
   - Focus indicators (outline) четко видны
   - Модальные окна: trap focus внутри, Esc для закрытия

2. **ARIA Labels:**
   - `aria-label` для иконочных кнопок
   - `aria-describedby` для tooltips
   - `role="status"` для live regions (уведомления, прогресс)

3. **Screen Reader Support:**
   - Альтернативные тексты для изображений
   - Объявления об изменениях (например, "Файл загружен")

4. **Color Contrast:**
   - Проверить контраст текста и фона (WCAG AA: 4.5:1 для обычного текста)

---

## 7. План реализации UI Kit расширений

**Фаза 1 (MVP):**
1. `UiFileUpload.vue`
2. `UiSlider.vue`
3. `UiBadge.vue`
4. `UiSkeleton.vue`
5. `UiTooltip.vue`

**Фаза 2:**
6. `UiTable.vue`
7. `UiTabs.vue`
8. `UiAccordion.vue`
9. `UiStepper.vue`
10. `UiTimeline.vue`

**Фаза 3 (Post-MVP):**
11. `UiNotification.vue` / Toast system
12. Расширения существующих компонентов (например, UiModal с draggable)

---

**TODO для владельца бизнеса:**
1. Предоставить доступ к brand guidelines (логотип, фирменные цвета, шрифты) если есть дополнительные требования
2. Уточнить примеры работ для Gallery Section (фото/модели) или можно начать с placeholder-контента
3. Одобрить UI-концепции страниц (можно создать mockups в Figma или прототипы в коде)
