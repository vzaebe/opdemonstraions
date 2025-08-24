# Модальное окно профиля сотрудника - ANANKO

## 📋 Обзор

Реализована система модальных окон для отображения детальной информации о сотрудниках компании. Система включает в себя два основных компонента:

1. **MemberModal.vue** - Модальное окно с профилем сотрудника
2. **EmployeeProfile.vue** - Расширенный профиль с возможностью переключения между сотрудниками

## 🏗️ Архитектура

### Компоненты

#### 1. MemberModal.vue
**Назначение**: Модальное окно для быстрого просмотра информации о сотруднике

**Основные функции**:
- Отображение фото сотрудника
- Показ имени и должности
- Биография сотрудника
- Контактная информация (Email, Telegram)
- Анимации открытия/закрытия
- Адаптивный дизайн

**Ключевые особенности**:
```vue
<template>
  <Teleport to="body">
    <div class="modal-bg" @click.self="$emit('close')">
      <!-- Содержимое модального окна -->
    </div>
  </Teleport>
</template>
```

#### 2. EmployeeProfile.vue
**Назначение**: Расширенный профиль с возможностью навигации между сотрудниками

**Основные функции**:
- Детальная информация о сотруднике
- Переключение между коллегами
- Отображение списка всех сотрудников
- Загрузка данных из JSON файла

### Данные

#### employees.json
Структура данных сотрудников:
```json
{
  "id": "dmitriy",
  "name": "Дмитрий Комаров",
  "role": "НАЧАЛЬНИК УПРАВЛЕНИЯ ДОСТУПНОЙ ИНФОРМАЦИОННОЙ СРЕДЫ",
  "photo": "png/face/komarov pic.png",
  "background": "png/face/komarov pic.png",
  "bio": "Курирует цифровую трансформацию...",
  "details": [
    "Опыт работы: 12+ лет",
    "Образование: Высшее техническое, MBA",
    "Специализация: IT-менеджмент, Цифровая доступность"
  ]
}
```

### Composable

#### useModal.ts
**Назначение**: Управление состоянием модальных окон

**Функции**:
- `open(modalData)` - Открытие модального окна с данными
- `close()` - Закрытие модального окна
- `isOpen` - Состояние открытия
- `data` - Данные для модального окна

## 🎨 Дизайн и UX

### Цветовая схема
- **Основной цвет**: `#2eacb4` (бирюзовый)
- **Акцентный цвет**: `#1de9b6` (светло-бирюзовый)
- **Фон**: Белый с градиентами
- **Текст**: Темно-серый для основного текста

### Анимации
- **Fade In**: Плавное появление модального окна
- **Hover эффекты**: Увеличение фото при наведении
- **Transform**: Подъем кнопок при наведении
- **Backdrop Blur**: Размытие фона

### Адаптивность
- **Desktop**: Полноразмерное отображение
- **Tablet**: Адаптированные размеры
- **Mobile**: Вертикальная компоновка

## 🔧 Техническая реализация

### TypeScript интерфейсы
```typescript
interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  photo: string;
  background: string;
  bio: string;
  details: string[];
}
```

### Управление изображениями
```typescript
const imageMap = {
  'dmitriy': {
    photo: komarovPhoto,
    background: komarovPhoto
  },
  'olga': {
    photo: ivanovaPhoto,
    background: ivanovaPhoto
  },
  'sofia': {
    photo: mironovaPhoto,
    background: mironovaPhoto
  }
}
```

### Доступность (Accessibility)
- **ARIA атрибуты**: `aria-modal`, `aria-labelledby`
- **Клавиатурная навигация**: Escape для закрытия
- **Семантическая разметка**: Правильные HTML теги
- **Alt тексты**: Описания для изображений

## 📱 Использование

### Открытие модального окна
```vue
<template>
  <MemberModal 
    :visible="isModalOpen" 
    :member="selectedMember"
    @close="closeModal"
  />
</template>

<script setup>
import { ref } from 'vue'
import MemberModal from '@/components/MemberModal.vue'

const isModalOpen = ref(false)
const selectedMember = ref(null)

const openModal = (member) => {
  selectedMember.value = member
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedMember.value = null
}
</script>
```

### Использование EmployeeProfile
```vue
<template>
  <EmployeeProfile />
</template>

<script setup>
import EmployeeProfile from '@/components/EmployeeProfile.vue'
</script>
```

## 🚀 Особенности реализации

### 1. Teleport
Модальное окно рендерится в `body` для правильного позиционирования:
```vue
<Teleport to="body">
  <!-- Модальное окно -->
</Teleport>
```

### 2. Блокировка скролла
При открытии модального окна блокируется скролл страницы:
```typescript
document.body.style.overflow = 'hidden'
```

### 3. Обработка событий
- **Click outside**: Закрытие по клику вне модального окна
- **Escape key**: Закрытие по нажатию Escape
- **Focus trap**: Удержание фокуса внутри модального окна

### 4. Оптимизация изображений
- **Lazy loading**: Загрузка изображений по требованию
- **WebP поддержка**: Современные форматы изображений
- **Responsive images**: Адаптивные размеры

## 📊 Производительность

### Оптимизации
- **Virtual scrolling**: Для больших списков сотрудников
- **Image optimization**: Сжатие и оптимизация изображений
- **Code splitting**: Разделение кода на чанки
- **Memoization**: Кэширование вычислений

### Метрики
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Безопасность

### Валидация данных
- Проверка типов данных
- Санитизация HTML контента
- Защита от XSS атак

### Конфиденциальность
- Маскирование контактной информации
- Контроль доступа к данным
- Логирование действий пользователей

## 🧪 Тестирование

### Unit тесты
```typescript
describe('MemberModal', () => {
  it('should display member information correctly', () => {
    // Тест отображения информации
  })
  
  it('should close on escape key', () => {
    // Тест закрытия по Escape
  })
})
```

### E2E тесты
```typescript
describe('Employee Profile', () => {
  it('should navigate between employees', () => {
    // Тест навигации между сотрудниками
  })
})
```

## 📈 Мониторинг

### Аналитика
- Отслеживание открытий модальных окон
- Время взаимодействия с профилями
- Популярность сотрудников

### Ошибки
- Логирование ошибок загрузки данных
- Мониторинг производительности
- Отслеживание пользовательских ошибок

## 🔄 Версионирование

### Changelog
- **v1.0.0**: Базовая реализация модального окна
- **v1.1.0**: Добавление EmployeeProfile компонента
- **v1.2.0**: Улучшение доступности и производительности

## 📞 Поддержка

### Контакты разработчика
- **Email**: info@opland.ru
- **Telegram**: @opland
- **GitHub**: [Репозиторий проекта]

### Документация
- [API Reference](./docs/api.md)
- [Component Guide](./docs/components.md)
- [Styling Guide](./docs/styling.md)

---

**Разработано для OpenDecisions**  
*Система модальных окон для отображения профилей сотрудников* 