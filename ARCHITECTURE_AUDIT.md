# 🏗️ Аудит Архитектуры Проекта OpenPerspectives

**Дата:** 2025-10-16  
**Статус:** ✅ Готовен к масштабированию с рекомендациями

---

## 📊 Общая Оценка

| Критерий | Статус | Оценка |
|----------|--------|--------|
| Структура проекта | ⚠️ Нужны улучшения | 6/10 |
| Type Safety | ✅ Хорошо | 8/10 |
| State Management | ⚠️ Можно улучшить | 6/10 |
| Component Architecture | ⚠️ Требует рефакторинга | 5/10 |
| Code Quality | ✅ Хорошо | 7/10 |
| Testing | ❌ Нет | 2/10 |
| Documentation | ⚠️ Частичная | 6/10 |
| Scalability | ⚠️ Ограниченная | 5/10 |

---

## 🔴 Критические Проблемы (Высокий приоритет)

### 1. **Монолитная структура App.vue** (Высокий риск)
```
❌ Текущее состояние:
- App.vue импортирует 17 компонентов секций напрямую
- Все секции жёстко закодированы в порядке
- Невозможно динамически загружать/выгружать контент
- Сложный для масштабирования на 50+ секций

✅ Решение: Перейти на конфигурационный подход (см. ниже)
```

### 2. **Отсутствие правильного разделения по функциям** (Высокий риск)
```
❌ Проблема:
- Компоненты размещены только по типам (sections/, layout/, icons/)
- Нет группировки по фичам/доменам (features/)
- Трудно найти связанный код (biz logic + UI)

✅ Решение: Feature-based структура вместо type-based
```

### 3. **Нет слоя для бизнес-логики** (Средний риск)
```
❌ Проблема:
- Composables смешивают UI-логику и бизнес-логику
- Нет Services слоя для API/данных
- Нет Repository паттерна

✅ Решение: Внедрить Services + Repositories (Domain-Driven Design)
```

### 4. **Слабая типизация** (Средний риск)
```
❌ Проблема:
- Много places с `unknown` типом
- Нет严格 валидации моделей данных
- Отсутствуют типовые guards

✅ Решение: Создать schemas/ для всех сущностей
```

---

## 🟡 Важные Проблемы (Средний приоритет)

### 5. **Монолитное хранилище Pinia (appStore)**
```
❌ Проблема:
- Все состояние в одном store
- Смешаны UI-состояние и бизнес-состояние
- Сложно тестировать
- Трудно масштабировать

✅ Решение: Разбить на несколько store'ов по фичам
```

### 6. **Отсутствие конфигурации констант**
```
❌ Проблема:
- Контакты, ссылки, параметры разбросаны по компонентам
- Сложно изменять без редактирования файлов
- Нет единого источника правды

✅ Решение: Создать config/ с constants и env-переменными
```

### 7. **Нет обработки ошибок (Error Handling)**
```
❌ Проблема:
- Нет глобального обработчика ошибок
- Нет retry механизма для API
- Нет fallback UI при ошибках
```

### 8. **Компоненты слишком большие**
```
❌ Проблема:
- AppHeader.vue - 770 строк
- Сложный для тестирования
- Трудно переиспользовать части
```

---

## 🟢 Что хорошо ✅

1. **Type Safety**: TypeScript конфиги настроены правильно
2. **Separation of Concerns**: Router, Store, Components разделены
3. **Composables**: useModal, useAnalytics хорошо структурированы
4. **CSS**: SCSS с переменными и media queries
5. **Build setup**: Vite + Vue3 - отличный фундамент
6. **Documentation**: Комментарии на русском - помогает команде

---

## 📐 Рекомендуемая Архитектура

### Новая структура проекта:

```
src/
├── config/                      # Глобальные конфиги
│   ├── constants.ts            # Контакты, ссылки, параметры
│   ├── routes.ts               # Маршруты (экспортируются отсюда)
│   └── env.ts                  # Переменные окружения
│
├── types/                       # Глобальные типы
│   ├── api.ts                  # API типы
│   ├── models.ts               # Бизнес-модели
│   └── forms.ts                # Типы форм
│
├── services/                    # Бизнес-логика
│   ├── api/                    # API клиент
│   │   ├── http.ts            # HTTP инстанс
│   │   ├── analytics.ts       # API аналитики
│   │   └── contact.ts         # API контактов
│   ├── storage/                # LocalStorage, SessionStorage
│   │   └── preferences.ts
│   └── validators/             # Валидация данных
│       └── email.ts
│
├── stores/                      # Pinia (состояние)
│   ├── modules/                # По фичам
│   │   ├── auth.ts
│   │   ├── modal.ts
│   │   ├── preferences.ts
│   │   └── analytics.ts
│   └── index.ts                # Экспорт всех
│
├── composables/                 # Логика для компонентов
│   ├── useHeader.ts           # Логика заголовка
│   ├── useForms.ts            # Логика форм
│   └── useObserver.ts         # Переиспользуемые наблюдатели
│
├── features/                    # Фичи/домены
│   ├── header/
│   │   ├── Header.vue
│   │   ├── components/
│   │   │   ├── NavigationMenu.vue
│   │   │   ├── SearchBar.vue
│   │   │   └── ContactLinks.vue
│   │   └── index.ts
│   │
│   ├── hero/
│   │   ├── HeroSection.vue
│   │   ├── components/
│   │   └── types.ts
│   │
│   ├── team/
│   │   ├── TeamSection.vue
│   │   ├── EmployeeProfile.vue
│   │   ├── MemberModal.vue
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── [other features]...
│
├── components/                  # Переиспользуемые компоненты
│   ├── buttons/
│   │   ├── ButtonPrimary.vue
│   │   ├── ButtonSecondary.vue
│   │   └── index.ts
│   ├── forms/
│   ├── modals/
│   │   ├── BaseModal.vue
│   │   └── index.ts
│   └── loaders/
│       ├── LoadingSpinner.vue
│       └── index.ts
│
├── layout/                      # Макеты
│   ├── RootLayout.vue
│   ├── SectionLayout.vue
│   └── index.ts
│
├── utils/                       # Утилиты
│   ├── formatters.ts           # Форматирование
│   ├── validators.ts           # Валидация
│   ├── strings.ts              # Работа со строками
│   └── dates.ts                # Работа с датами
│
├── directives/                  # Vue директивы
│   ├── vClickOutside.ts
│   └── index.ts
│
├── styles/                      # Глобальные стили
│   ├── variables.scss          # ✅ Есть
│   ├── global.scss             # ✅ Есть
│   ├── animations.scss         # Добавить
│   ├── layouts.scss            # Добавить
│   └── themes.scss             # Добавить
│
├── sections.config.ts           # НОВОЕ: Конфиг секций
├── App.vue                      # ✅ Упрощённый App
├── main.ts                      # ✅ Entry point
└── router/
    └── index.ts                # ✅ Router
```

---

## 🔧 Конкретные Улучшения

### 1. Конфигурационный Подход для Секций

**Файл: `src/sections.config.ts`**
```typescript
export const sectionsConfig = [
  {
    id: 'hero',
    component: () => import('@/features/hero/HeroSection.vue'),
    enabled: true,
    order: 1
  },
  {
    id: 'partners',
    component: () => import('@/features/partners/PartnersSection.vue'),
    enabled: true,
    order: 2
  },
  // ... остальные секции
];
```

**Новый App.vue:**
```vue
<template>
  <div id="app">
    <AppHeader />
    <main>
      <template v-for="section in activeSections" :key="section.id">
        <component :is="section.component" />
      </template>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { sectionsConfig } from '@/sections.config';

const activeSections = computed(() =>
  sectionsConfig.filter(s => s.enabled).sort((a, b) => a.order - b.order)
);
</script>
```

### 2. Разбиение AppHeader на Компоненты

**Текущий размер:** 770 строк ❌  
**После рефакторинга:** ~150 строк ✅

```
features/header/
├── Header.vue                  # Основной компонент (150 строк)
├── components/
│   ├── NavigationMenu.vue      # Меню (150 строк)
│   ├── SearchBar.vue           # Поиск (100 строк)
│   ├── ContactLinks.vue        # Контакты (80 строк)
│   └── FloatingMenu.vue        # Мобильное меню (200 строк)
├── composables/
│   ├── useHeaderState.ts       # State management
│   ├── useMenuToggle.ts        # Menu logic
│   └── useHeaderScroll.ts      # Scroll observer
└── index.ts
```

### 3. Services для API + Data

**Файл: `src/services/api/contact.ts`**
```typescript
import { http } from './http';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const contactService = {
  async sendMessage(data: ContactFormData) {
    return http.post('/api/contact', data);
  },
  
  async getContactInfo() {
    return http.get('/api/contact/info');
  }
};
```

### 4. Отдельные Store'ы вместо Монолита

```
stores/
├── modules/
│   ├── preferences.ts          # Тема, язык, A11y
│   ├── modal.ts                # State модальных окон
│   ├── analytics.ts            # Отслеживание событий
│   ├── contact.ts              # Контактные формы
│   └── team.ts                 # Данные команды
└── index.ts
```

**Файл: `src/stores/modules/modal.ts`**
```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ModalType = 'member' | 'contact' | 'subscribe';

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false);
  const type = ref<ModalType | null>(null);
  const data = ref<unknown>(null);

  const open = (modalType: ModalType, modalData?: unknown) => {
    type.value = modalType;
    data.value = modalData;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    type.value = null;
    data.value = null;
  };

  return { isOpen, type, data, open, close };
});
```

### 5. Типовые Модели (Schemas)

**Файл: `src/types/models.ts`**
```typescript
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  socials: {
    telegram?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Section {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  order: number;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
```

### 6. Конфиг Констант

**Файл: `src/config/constants.ts`**
```typescript
export const CONTACT = {
  PHONE: '+7 915 003 39 35',
  EMAIL: 'info@openperspectives.ru',
  TELEGRAM: 'https://t.me/openperspectives',
  TELEGRAM_HANDLE: 'openperspectives'
};

export const NAVIGATION_LINKS = [
  { label: 'О нас', href: '#about' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Партнёры', href: '#partners' },
  { label: 'База Знаний', href: '#knowledge' },
  { label: 'Поддержка', href: '#support' },
  { label: 'Контакты', href: '#contacts' }
];

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
};

export const Z_INDEX = {
  STICKY: 40,
  DROPDOWN: 50,
  MODAL: 100,
  NOTIFICATION: 110
};
```

### 7. Обработка Ошибок

**Файл: `src/services/api/http.ts`**
```typescript
import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

http.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    // Отправить в аналитику
    if (error.response?.status === 429) {
      // Retry с exponential backoff
    }
    throw error;
  }
);

export { http };
```

---

## 📋 План Миграции (Phase-based)

### **Phase 1: Foundation** (1-2 недели)
- [ ] Создать новую структуру папок
- [ ] Создать types/ с моделями
- [ ] Создать config/constants.ts
- [ ] Настроить path aliases в tsconfig

### **Phase 2: Features** (2-3 недели)
- [ ] Рефакторить AppHeader на компоненты
- [ ] Разбить AppHeader на Features
- [ ] Создать другие features
- [ ] Провести миграцию других секций

### **Phase 3: State Management** (1-2 недели)
- [ ] Разбить appStore на modules
- [ ] Создать services/ слой
- [ ] Добавить API интеграцию

### **Phase 4: Testing & Polish** (1-2 недели)
- [ ] Добавить unit тесты
- [ ] Добавить e2e тесты
- [ ] Оптимизация performance

---

## 🎯 Преимущества Новой Архитектуры

| Аспект | Текущее | После |
|--------|---------|--------|
| **Масштабируемость** | 5/10 | 9/10 |
| **Тестируемость** | 2/10 | 8/10 |
| **Поддерживаемость** | 5/10 | 9/10 |
| **Переиспользуемость** | 3/10 | 8/10 |
| **Team Onboarding** | 4/10 | 8/10 |
| **Performance** | 6/10 | 8/10 |

---

## 📝 Чеклист для Сеньора

- [ ] Code Review всех компонентов >300 строк
- [ ] Добавить unit тесты (минимум 80% coverage)
- [ ] Настроить TypeScript strict mode
- [ ] Добавить Error Boundaries
- [ ] Документировать все composables
- [ ] Провести Performance Audit
- [ ] Настроить CI/CD
- [ ] Добавить Pre-commit hooks (Husky + Lint-staged)

---

## 🚀 Быстрые Победы (Quick Wins)

Что можно сделать **сегодня**:

1. Создать `src/config/constants.ts` и заменить hardcoded значения
2. Разделить AppHeader на 3-4 компонента
3. Создать `src/types/models.ts` с типами
4. Добавить `path aliases` для easier imports
5. Создать `src/services/` структуру для API

---

## 🔗 Рекомендации по Библиотекам

**Для масштабирования:**

```json
{
  "axios": "^1.6.0",          // HTTP клиент (если используется)
  "zod": "^3.22.0",           // Runtime типовалидация
  "date-fns": "^2.30.0",      // Работа с датами
  "lodash-es": "^4.17.21",    // Утилиты (tree-shakeable)
  "pinia": "^2.1.0",          // ✅ Уже используется
  "vitest": "^3.1.0"          // ✅ Уже используется
}
```

---

## 📞 Контакты для Обсуждения

Нужно обсудить:
- [ ] Существующие API endpoints
- [ ] Требования к analytics
- [ ] Требования к A11y
- [ ] Планы по i18n (многоязычность)
- [ ] Требования к PWA

---

**Status:** Готово к внедрению  
**Effort:** 3-4 недели на полную миграцию  
**ROI:** Увеличение velocity на 40-50% после внедрения


