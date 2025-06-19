# 🚀 Opland - Инклюзивная Платформа Образования

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-1.89.2-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-14.2.1-17202C?style=for-the-badge&logo=cypress&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

**Создаём инклюзивное будущее вместе!** 🌟

[Демо](#) • [Документация](#документация) • [Вклад в проект](#-вклад-в-проект) • [Поддержка](#-поддержка)

</div>

---

## 📋 Содержание

- [О проекте](#-о-проекте)
- [🚀 Быстрый старт](#-быстрый-старт)
- [🏗️ Архитектура](#️-архитектура)
- [📁 Структура проекта](#-структура-проекта)
- [🎨 Дизайн-система](#-дизайн-система)
- [🧩 Компоненты](#-компоненты)
- [🔧 Разработка](#-разработка)
- [🧪 Тестирование](#-тестирование)
- [📦 Развертывание](#-развертывание)
- [🤝 Вклад в проект](#-вклад-в-проект)
- [📞 Поддержка](#-поддержка)

## 🎯 О проекте

**Opland** - это современная веб-платформа, созданная для поддержки инклюзивного образования и интеграции людей с ограниченными возможностями в образовательный процесс. Проект реализован с использованием Vue 3, TypeScript, SCSS и Vite, обеспечивая высокую производительность, типобезопасность и отличный пользовательский опыт.

### 🌟 Ключевые особенности

- **♿ Инклюзивность**: Полная поддержка доступности (WCAG 2.1 AA)
- **📱 Адаптивность**: Современный responsive дизайн для всех устройств
- **⚡ Производительность**: Оптимизированная сборка с Vite
- **🔒 Типобезопасность**: TypeScript для надежного кода
- **🎨 Дизайн-система**: Консистентный UI с SCSS переменными
- **🧪 Тестирование**: Unit и E2E тесты с Vitest и Cypress
- **📊 SEO-оптимизация**: Готовность к поисковым системам

### 🎯 Миссия проекта

- Создание доступной образовательной среды для всех
- Поддержка людей с нарушениями слуха и другими особенностями
- Интеграция современных технологий в образовательный процесс
- Развитие инклюзивных проектов и сообществ

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** версии 18.0.0 или выше
- **npm** версии 9.0.0 или выше
- **Git** для работы с репозиторием

### Установка и запуск

```bash
# Клонирование репозитория
git clone https://github.com/your-username/opland.git
cd opland

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

### Доступные команды

```bash
# Разработка
npm run dev              # Запуск dev-сервера
npm run build            # Сборка для продакшена
npm run preview          # Предварительный просмотр сборки

# Тестирование
npm run test:unit        # Unit тесты (Vitest)
npm run test:e2e         # E2E тесты (Cypress)
npm run test:e2e:dev     # E2E тесты в dev режиме

# Качество кода
npm run lint             # Линтинг с автоисправлением
npm run format           # Форматирование кода
npm run type-check       # Проверка типов TypeScript
```

## 🏗️ Архитектура

### Технологический стек

#### Frontend
- **Vue 3.4.0** - Прогрессивный JavaScript фреймворк
- **TypeScript 5.8.0** - Типизированный JavaScript
- **Vue Router 4.5.0** - Официальный роутер для Vue
- **Pinia 3.0.1** - State management для Vue 3

#### Стилизация
- **SCSS 1.89.2** - Препроцессор CSS с переменными
- **CSS Grid & Flexbox** - Современная верстка
- **CSS Custom Properties** - Динамические переменные

#### Инструменты разработки
- **Vite 5.0.0** - Быстрый сборщик модулей
- **ESLint 9.22.0** - Линтер кода
- **Prettier 3.5.3** - Форматировщик кода
- **Vue DevTools** - Инструменты разработчика

#### Тестирование
- **Vitest 3.1.1** - Unit тестирование
- **Cypress 14.2.1** - E2E тестирование
- **Vue Test Utils 2.4.6** - Утилиты для тестирования Vue

### Архитектурные принципы

- **Компонентный подход** - Переиспользуемые Vue компоненты
- **Composition API** - Современный API Vue 3
- **TypeScript-first** - Типобезопасность с самого начала
- **Mobile-first** - Адаптивный дизайн от мобильных устройств
- **Accessibility-first** - Доступность как приоритет

## 📁 Структура проекта

```
opland/
├── 📁 src/                          # Исходный код приложения
│   ├── 📁 assets/                   # Статические ресурсы
│   │   ├── 📁 styles/              # Глобальные стили
│   │   │   ├── variables.scss      # Дизайн-система и переменные
│   │   │   └── global.scss         # Глобальные стили и утилиты
│   │   ├── 📁 images/              # Изображения
│   │   │   ├── avatar.svg          # Аватары
│   │   │   ├── hero.svg            # Главное изображение
│   │   │   ├── icon.svg            # Иконки
│   │   │   └── placeholder.svg     # Заглушки
│   │   ├── base.css                # Базовые стили
│   │   ├── logo.svg                # Логотип
│   │   └── main.css                # Основные стили
│   ├── 📁 components/              # Vue компоненты
│   │   ├── 📁 layout/              # Компоненты макета
│   │   │   ├── AppHeader.vue       # Шапка сайта с навигацией
│   │   │   └── AppFooter.vue       # Подвал сайта
│   │   ├── 📁 sections/            # Секции главной страницы
│   │   │   ├── HeroSection.vue     # Главная секция с призывом к действию
│   │   │   ├── PartnersSection.vue # Секция партнеров
│   │   │   ├── OrientationSection.vue # Секция ориентации
│   │   │   ├── GallerySection.vue  # Галерея проектов
│   │   │   ├── AboutSection.vue    # О нас
│   │   │   ├── ServicesSection.vue # Услуги
│   │   │   ├── AdvantagesSection.vue # Преимущества
│   │   │   ├── BestSection.vue     # Лучшие проекты
│   │   │   ├── RegistrationSection.vue # Регистрация
│   │   │   ├── TestimonialsSection.vue # Отзывы
│   │   │   ├── ServicesCardsSection.vue # Карточки услуг
│   │   │   ├── ProjectsSection.vue # Основные проекты
│   │   │   ├── SocialMediaSection.vue # Социальные сети
│   │   │   ├── TeamSection.vue     # Команда
│   │   │   ├── ContactSection.vue  # Контакты
│   │   │   └── SupportSection.vue  # Поддержка
│   │   ├── 📁 icons/               # Иконки
│   │   │   ├── IconCommunity.vue   # Иконка сообщества
│   │   │   ├── IconDocumentation.vue # Иконка документации
│   │   │   ├── IconEcosystem.vue   # Иконка экосистемы
│   │   │   ├── IconSupport.vue     # Иконка поддержки
│   │   │   └── IconTooling.vue     # Иконка инструментов
│   │   ├── 📁 __tests__/           # Тесты компонентов
│   │   │   └── HelloWorld.spec.ts  # Тест компонента HelloWorld
│   │   ├── HelloWorld.vue          # Пример компонента
│   │   ├── TheWelcome.vue          # Компонент приветствия
│   │   └── WelcomeItem.vue         # Элемент приветствия
│   ├── 📁 router/                  # Роутинг
│   │   └── index.ts                # Конфигурация роутера
│   ├── 📁 stores/                  # State management (Pinia)
│   │   └── counter.ts              # Пример store
│   ├── 📁 views/                   # Страницы приложения
│   │   ├── AboutView.vue           # Страница "О нас"
│   │   └── HomeView.vue            # Главная страница
│   ├── App.vue                     # Главный компонент приложения
│   ├── main.js                     # Точка входа (JavaScript)
│   └── main.ts                     # Точка входа (TypeScript)
├── 📁 public/                      # Публичные файлы
│   └── favicon.ico                 # Иконка сайта
├── 📁 cypress/                     # E2E тестирование (Cypress)
│   ├── 📁 e2e/                     # E2E тесты
│   │   └── example.cy.ts           # Пример E2E теста
│   ├── 📁 fixtures/                # Фикстуры для тестов
│   │   └── example.json            # Пример данных
│   ├── 📁 support/                 # Поддержка тестов
│   │   ├── commands.ts             # Пользовательские команды
│   │   └── e2e.ts                  # Конфигурация E2E
│   └── tsconfig.json               # TypeScript конфигурация для Cypress
├── 📁 opland/                      # Дублирующая структура (для совместимости)
├── index.html                      # HTML шаблон
├── package.json                    # Зависимости и скрипты
├── package-lock.json               # Lock файл зависимостей
├── vite.config.js                  # Конфигурация Vite (JavaScript)
├── vite.config.ts                  # Конфигурация Vite (TypeScript)
├── eslint.config.js                # Конфигурация ESLint
├── vitest.config.ts                # Конфигурация Vitest
├── tsconfig.json                   # Основная TypeScript конфигурация
├── tsconfig.app.json               # TypeScript конфигурация для приложения
├── tsconfig.node.json              # TypeScript конфигурация для Node.js
├── tsconfig.vitest.json            # TypeScript конфигурация для Vitest
├── cypress.config.ts               # Конфигурация Cypress
├── env.d.ts                        # TypeScript декларации окружения
└── README.md                       # Документация проекта
```

## 🎨 Дизайн-система

### Цветовая палитра

#### Основные цвета
```scss
$primary-green: #4ade80;    // Основной зеленый
$primary-indigo: #3730a3;   // Основной индиго
$primary-yellow: #ca8a04;   // Основной желтый
$primary-red: #dc2626;      // Основной красный
$primary-pink: #831843;     // Основной розовый
```

#### Нейтральные цвета
```scss
$white: #ffffff;
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;
$gray-800: #1f2937;
$gray-900: #111827;
```

#### Прозрачности
```scss
$opacity-10: 0.1;
$opacity-20: 0.2;
$opacity-30: 0.3;
$opacity-40: 0.4;
$opacity-50: 0.5;
$opacity-60: 0.6;
$opacity-70: 0.7;
$opacity-80: 0.8;
$opacity-90: 0.9;
```

### Типографика

#### Размеры шрифтов
```scss
$text-xs: 0.75rem;    // 12px
$text-sm: 0.875rem;   // 14px
$text-base: 1rem;     // 16px
$text-lg: 1.125rem;   // 18px
$text-xl: 1.25rem;    // 20px
$text-2xl: 1.5rem;    // 24px
$text-3xl: 1.875rem;  // 30px
$text-4xl: 2.25rem;   // 36px
$text-5xl: 3rem;      // 48px
$text-6xl: 3.75rem;   // 60px
```

#### Межстрочные интервалы
```scss
$leading-none: 1;
$leading-tight: 1.25;
$leading-snug: 1.375;
$leading-normal: 1.5;
$leading-relaxed: 1.625;
$leading-loose: 2;
```

### Компоненты дизайн-системы

#### Радиусы скругления
```scss
$border-radius-sm: 0.125rem;   // 2px
$border-radius: 0.25rem;       // 4px
$border-radius-md: 0.375rem;   // 6px
$border-radius-lg: 0.5rem;     // 8px
$border-radius-xl: 0.75rem;    // 12px
$border-radius-2xl: 1rem;      // 16px
$border-radius-3xl: 1.5rem;    // 24px
$border-radius-full: 9999px;   // Полное скругление
```

#### Тени
```scss
$shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
$shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
$shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
$shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
$shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

#### Брейкпоинты
```scss
$breakpoint-sm: 640px;   // Мобильные устройства
$breakpoint-md: 768px;   // Планшеты
$breakpoint-lg: 1024px;  // Малые десктопы
$breakpoint-xl: 1280px;  // Средние десктопы
$breakpoint-2xl: 1536px; // Большие десктопы
```

## 🧩 Компоненты

### Layout Components

#### AppHeader.vue
**Расположение**: `src/components/layout/AppHeader.vue`

**Функциональность**:
- Навигационное меню с логотипом
- Адаптивное меню для мобильных устройств
- Плавные переходы и анимации
- Фиксированное позиционирование

**Основные элементы**:
- Логотип "Открытые Перспективы"
- Навигационные ссылки
- Кнопка регистрации
- Мобильное меню-бургер

**Использование**:
```vue
<template>
  <AppHeader />
</template>
```

#### AppFooter.vue
**Расположение**: `src/components/layout/AppFooter.vue`

**Функциональность**:
- Информация о проекте
- Ссылки на социальные сети
- Контактная информация
- Правовая информация

### Section Components

#### HeroSection.vue
**Расположение**: `src/components/sections/HeroSection.vue`

**Описание**: Главная секция с призывом к действию
- Заголовок и подзаголовок
- Кнопки действий
- Фоновое изображение
- Адаптивный дизайн

#### PartnersSection.vue
**Расположение**: `src/components/sections/PartnersSection.vue`

**Описание**: Секция с логотипами партнеров
- Сетка логотипов
- Hover-эффекты
- Адаптивная сетка

#### OrientationSection.vue
**Расположение**: `src/components/sections/OrientationSection.vue`

**Описание**: Секция ориентации и навигации
- Информационные карточки
- Иконки и описания
- Интерактивные элементы

#### GallerySection.vue
**Расположение**: `src/components/sections/GallerySection.vue`

**Описание**: Галерея проектов и достижений
- Сетка изображений
- Lightbox-функциональность (готово к реализации)
- Фильтрация по категориям

#### AboutSection.vue
**Расположение**: `src/components/sections/AboutSection.vue`

**Описание**: Информация о проекте
- Миссия и цели
- Статистика и достижения
- История проекта

#### ServicesSection.vue
**Расположение**: `src/components/sections/ServicesSection.vue`

**Описание**: Список услуг
- Карточки услуг
- Описания и иконки
- Ссылки на подробности

#### AdvantagesSection.vue
**Расположение**: `src/components/sections/AdvantagesSection.vue`

**Описание**: Преимущества проекта
- Список преимуществ
- Иконки и описания
- Анимации при скролле

#### BestSection.vue
**Расположение**: `src/components/sections/BestSection.vue`

**Описание**: Лучшие проекты и достижения
- Выделенные проекты
- Статистика
- Отзывы участников

#### RegistrationSection.vue
**Расположение**: `src/components/sections/RegistrationSection.vue`

**Описание**: Форма регистрации
- Поля ввода данных
- Валидация форм
- Отправка данных

#### TestimonialsSection.vue
**Расположение**: `src/components/sections/TestimonialsSection.vue`

**Описание**: Отзывы участников
- Аватары пользователей
- Тексты отзывов
- Рейтинги

#### ServicesCardsSection.vue
**Расположение**: `src/components/sections/ServicesCardsSection.vue`

**Описание**: Карточки услуг в сетке
- Интерактивные карточки
- Hover-эффекты
- Категоризация услуг

#### ProjectsSection.vue
**Расположение**: `src/components/sections/ProjectsSection.vue`

**Описание**: Основные проекты
- Детальная информация о проектах
- Изображения и описания
- Ссылки на подробности

#### SocialMediaSection.vue
**Расположение**: `src/components/sections/SocialMediaSection.vue`

**Описание**: Ссылки на социальные сети
- Иконки соцсетей
- Ссылки на профили
- Интерактивные кнопки

#### TeamSection.vue
**Расположение**: `src/components/sections/TeamSection.vue`

**Описание**: Команда проекта
- Фотографии участников
- Роли и описания
- Контактная информация

#### ContactSection.vue
**Расположение**: `src/components/sections/ContactSection.vue`

**Описание**: Контактная информация и форма
- Контактные данные
- Интерактивная форма
- Валидация и отправка

#### SupportSection.vue
**Расположение**: `src/components/sections/SupportSection.vue`

**Описание**: Способы поддержки проекта
- Волонтерство
- Партнерство
- Пожертвования

## 🔧 Разработка

### Конфигурация Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  }
})
```

### Конфигурация ESLint

```javascript
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import prettier from '@vue/eslint-config-prettier'

export default [
  js.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      vue
    },
    rules: {
      ...vue.configs.base.rules,
      ...vue.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules
    }
  },
  prettier
]
```

### Конфигурация TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Конфигурация Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### Конфигурация Cypress

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true
  }
})
```

## 🧪 Тестирование

### Unit тестирование (Vitest)

```bash
# Запуск всех unit тестов
npm run test:unit

# Запуск тестов в watch режиме
npm run test:unit -- --watch

# Запуск тестов с покрытием
npm run test:unit -- --coverage
```

**Пример unit теста**:
```typescript
// src/components/__tests__/HelloWorld.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
```

### E2E тестирование (Cypress)

```bash
# Запуск E2E тестов
npm run test:e2e

# Запуск E2E тестов в dev режиме
npm run test:e2e:dev
```

**Пример E2E теста**:
```typescript
// cypress/e2e/example.cy.ts
describe('Example Test', () => {
  it('should visit the homepage', () => {
    cy.visit('/')
    cy.get('h1').should('contain', 'Opland')
  })
})
```

### Тестирование доступности

```bash
# Установка axe-core для тестирования доступности
npm install --save-dev @axe-core/vue

# Добавление в тесты
import { axe } from '@axe-core/vue'
```

## 📦 Развертывание

### Подготовка к продакшену

```bash
# Сборка проекта
npm run build

# Предварительный просмотр сборки
npm run preview
```

### Развертывание на Vercel

1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Подключите GitHub репозиторий
3. Настройте переменные окружения (если необходимо)
4. Vercel автоматически развернет проект

### Развертывание на Netlify

1. Создайте аккаунт на [Netlify](https://netlify.com)
2. Подключите GitHub репозиторий
3. Настройте команды сборки:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Настройте переменные окружения

### Развертывание на GitHub Pages

```bash
# Установка gh-pages
npm install --save-dev gh-pages

# Добавление скрипта в package.json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}

# Развертывание
npm run build
npm run deploy
```

## 🤝 Вклад в проект

### Как внести изменения

1. **Форк репозитория**
   ```bash
   git clone https://github.com/your-username/opland.git
   cd opland
   ```

2. **Создание ветки для новой функции**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Внесение изменений**
   - Следуйте стандартам кода
   - Добавьте тесты для новой функциональности
   - Обновите документацию

4. **Коммит изменений**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push в репозиторий**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Создание Pull Request**
   - Перейдите на GitHub
   - Создайте Pull Request
   - Опишите изменения

### Стандарты кода

#### Commit сообщения
Используйте [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: maintenance tasks
```

#### Vue компоненты
- Используйте Composition API
- Следуйте Vue 3 Style Guide
- Используйте TypeScript для типизации
- Добавляйте JSDoc комментарии

#### Стили
- Используйте SCSS переменные из дизайн-системы
- Следуйте BEM методологии
- Обеспечивайте адаптивность
- Тестируйте доступность

### Процесс ревью

1. **Автоматические проверки**
   - ESLint проверка
   - TypeScript проверка типов
   - Unit тесты
   - E2E тесты

2. **Ручное ревью**
   - Код ревью от команды
   - Проверка доступности
   - Тестирование функциональности

3. **Слияние**
   - После одобрения PR будет слит в main ветку
   - Автоматическое развертывание

## 📞 Поддержка

### Команда разработки

- **Email**: info@opland.ru
- **Телефон**: +7 (495) 123-45-67
- **Адрес**: г. Москва, ул. Примерная, д. 123

### Социальные сети

- **Telegram**: [@opland](https://t.me/opland)
- **VK**: [Открытые Перспективы](https://vk.com/opland)
- **YouTube**: [Opland Channel](https://youtube.com/opland)

### Документация

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)

### Сообщество

- **Discord**: [Opland Community](https://discord.gg/opland)
- **GitHub Discussions**: [Обсуждения проекта](https://github.com/your-username/opland/discussions)
- **Issues**: [Отчеты об ошибках](https://github.com/your-username/opland/issues)

## 📄 Лицензия

Проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

```
MIT License

Copyright (c) 2024 Opland Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Благодарности

Спасибо всем участникам и партнерам проекта "Открытые Перспективы" за поддержку и вклад в развитие инклюзивного образования.

### Основные партнеры

- **Министерство образования РФ** - Поддержка образовательных инициатив
- **Российская ассоциация глухих** - Экспертиза в области доступности
- **Технологические партнеры** - Предоставление инструментов разработки

### Open Source сообщество

- **Vue.js Team** - Замечательный фреймворк
- **Vite Team** - Быстрый сборщик модулей
- **TypeScript Team** - Типобезопасный JavaScript
- **Cypress Team** - Отличные инструменты тестирования

---

<div align="center">

**Opland** - Создаём инклюзивное будущее вместе! 🌟

[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg?style=for-the-badge)](https://github.com/your-username/opland)

</div>
