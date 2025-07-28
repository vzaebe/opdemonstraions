# Руководство по проекту «Opland» для Ананко Матвея

> Это краткое, но исчерпывающее введение в кодовую базу и процессы Front-end-проекта «Opland». Документ создан специально для ускорения онбординга и дальнейшей эффективной работы.

---

## 1. Общая информация о проекте

**Opland** — образовательная платформа, направленная на поддержку инклюзивного обучения людей с ограниченными возможностями. Клиентская часть написана на **Vue 3 + TypeScript** и собирается инструментом **Vite**. Проект следует принципам *Accessibility-first* (WCAG 2.1 AA), *Mobile-first* и модульной архитектуре *Component-driven UI*.

Основные фичи:
1. Адаптивный лендинг со множеством тематических секций.
2. Проработанная дизайн-система на SCSS-переменных (цвета, типографика, брейк-поинты).
3. State-management на **Pinia**.
4. Роутинг на **Vue Router**.
5. Юнит-тесты (**Vitest**) и E2E-тесты (**Cypress**).

---

## 2. Структура репозитория

```
portal/
├── public/                  # Статические ресурсы, favicon
├── src/
│   ├── assets/              # Изображения, шрифты, global.scss, variables.scss
│   ├── components/
│   │   ├── layout/          # Header, Footer
│   │   ├── sections/        # Секции лендинга (Hero, About, Partners …)
│   │   ├── icons/           # SVG-иконки как Vue-компоненты
│   │   └── __tests__/       # Юнит-тесты компонентов
│   ├── router/              # Файлы маршрутизации
│   ├── stores/              # Pinia-stores
│   ├── views/               # Страницы (Home, About)
│   ├── App.vue              # Корневой компонент
│   └── main.{js,ts}         # Точка входа
├── cypress/                 # E2E-тесты, фикстуры, кастомные команды
├── *.config.*               # Vite, ESLint, Cypress, Vitest, TS configs
└── README.md                # Подробная документация
```

> Совет: для быстрой навигации установи расширение VS Code — **“Vue VSCode Snippets”** и **“Path Intellisense”**.

---

## 3. Как всё работает (High-level flow)

1. В `main.ts` подключаются `createApp(App)` и глобально монтируются `router` + `pinia`.
2. Компоненты-секции объявлены в каталоге `src/components/sections` и импортируются на главной странице (`HomeView.vue`).
3. Общие стили импортируются через опцию `additionalData` в `vite.config.ts`, поэтому во всех `*.vue` можно писать SCSS без дополнительных импортов.
4. Билд формируется командой `npm run build` → папка `dist/` готова к деплою (Netlify, Vercel, GitHub Pages).

---

## 4. UI / UX правила

1. **Цвета**: используем SCSS-переменные из `assets/styles/variables.scss`. Для Telegram-секции всегда применяй официальные Telegram-цвета (#0088CC) вместо произвольного синего.
2. **Типографика**: размеры и line-height заданы переменными `$text-*`, `$leading-*`; нельзя жёстко прописывать px.
3. **Grid / Flex**: сперва mobile-layout (0-640 px), затем MD ≥ 768 px, LG ≥ 1024 px и т.д.
4. **Accessibility**:
   • Контраст ≥ 4.5:1;
   • Все интерактивные элементы фокусируются; 
   • Используем `aria-label`, `role` где требуется.
5. **Анимации**: только лёгкие CSS-transition ≤ 200 ms; убираем при `prefers-reduced-motion`.
6. **Компонентный подход**: 1 компонент — 1 ответственность. Логику выносим в `setup()` / композиционные функции.
7. **Code style**: ESLint + Prettier автозапуск через `npm run lint` / `npm run format`.

---

## 5. Установка зависимостей

Минимальные требования:
- **Node.js** ≥ 18
- **npm** ≥ 9

Основные runtime-зависимости (package.json → `dependencies`):
- vue ^3.4.0
- pinia ^3.0.1
- vue-router ^4.5.0
- js-cookie ^3.0.5

Dev-dependencies (самое важное):
- vite, @vitejs/plugin-vue, vite-plugin-vue-devtools
- typescript, vue-tsc, @vue/tsconfig
- vitest + @vue/test-utils, cypress
- eslint, @vue/eslint-config-(typescript|prettier), prettier, sass

Установка:
```bash
# 1. Клонировать репозиторий
$ git clone <repo-url>
$ cd portal

# 2. Установить пакеты
$ npm install

# 3. Запустить dev-сервер
$ npm run dev  # localhost:5173
```

---

## 6. Полезные npm-скрипты

| Скрипт              | Описание                           |
|---------------------|-------------------------------------|
| `npm run dev`       | Dev-сервер (HMR)                    |
| `npm run build`     | Продакшен-сборка (`dist/`)          |
| `npm run preview`   | Локальный preview собранной версии  |
| `npm run test:unit` | Юнит-тесты (Vitest)                 |
| `npm run test:e2e`  | E2E-тесты (Cypress + SSR)           |
| `npm run lint`      | ESLint с автофиксом                 |
| `npm run format`    | Prettier форматирование             |
| `npm run type-check`| Проверка типов TypeScript           |

---

## 7. Рекомендации по дальнейшей работе

1. Перед созданием новой фичи создай ветку `feature/<имя-фичи>`.
2. Соблюдай Conventional Commits (`feat:`, `fix:`, `docs:` …).
3. Покрывай изменения тестами, проверяй `npm run test:unit && npm run lint`.
4. Для визуальной регрессии можно подключить **Percy** или **Cypress-image-snapshot**.
5. При правках Telegram-блока проверяй соответствие бренд-гайду Telegram.

---

👍 На этом всё! Если возникнут вопросы — пиши в **Telegram @opland** или обращайся к команде. Добро пожаловать в проект! 🎉 

---

## 8. Стандарты кодовой базы

### 8.1 Именование и структура файлов
- **Компоненты** — `PascalCase.vue` (например `UserCard.vue`).
- **Composables** — префикс `use` (`useAuth.ts`).
- **Stores (Pinia)** — суффикс `Store` (`userStore.ts`).
- **Тесты** — файл рядом с кодом в каталоге `__tests__`, имя как у тестируемого файла + `.spec.ts`.
- **SCSS** — BEM-блоки, один компонент — один файл, утилитарные классы в `global.scss`.

### 8.2 Правила ESLint/Prettier
- Одинарные кавычки, трейлинг-запятая `all`, max-len 100.
- Запуск `npm run lint` обязателен перед PR.

### 8.3 Vue best practices
- Использовать Composition API + `<script setup>`.
- Пропсы всегда типизировать (`defineProps<{ label: string }>()`).
- События описывать через `defineEmits<{(e:'submit', payload:FormData):void}>()`.
- Внешние эффекты изолировать в composables.

---

## 9. Тестирование и покрытие

| Слой        | Инструмент | Цель                                |
|-------------|------------|--------------------------------------|
| Unit        | Vitest     | Логика компонентов / composables     |
| Component   | Vue Test Utils | Взаимодействие UI-составляющих   |
| E2E         | Cypress    | Сквозные сценарии пользователя       |

1. **Порог покрытия** (Vitest): 80 % lines/branches. Проверяется в CI.
2. **Снепшоты** хранятся рядом с тестами, пересоздавать — только при изменении макета.
3. **Accessibility-тесты**: подключить `@axe-core/vue` в unit-тестах, прогонять `axe(wrapper.element)`.

---

## 10. CI / CD и Git flow

1. **Ветки**:
   - `main` – стабильная продакшен-ветка
   - `landing` – текущий лендинг (по умолчанию)
   - `feature/*`, `fix/*`, `chore/*` – рабочие ветки
2. **GitHub Actions** (`.github/workflows/ci.yml` — планируется):
   - `npm ci`
   - `npm run lint`
   - `npm run type-check`
   - `npm run test:unit`
   - `npm run build` (bundle-size report)
3. **PR-шаблон**: описание фич, тест-кейс, скриншоты, чек-лист.
4. Авто-деплой на Vercel из `main`.

---

## 11. Управление зависимостями

- Используем **semver**: `^` для minor, `~` для patch.
- Для проверки уязвимостей: `npm audit`.
- Обновление: `npm outdated` → `npm update` → `npm run test:unit && npm run build`.
- Раз в месяц проводить ревизию major-версий (Vue, Vite и проч.) в отдельной ветке.

---

## 12. Производительность и оптимизация

1. **Code-splitting**: динамические импорты для тяжёлых секций.
2. **Lazy Hydration**: директива `v-lazy` (можно добавить в будущем).
3. **Изображения**: использовать `.webp`/`.avif`, проводить компрессию (Squoosh).
4. **Bundle analyzer**: `npm i -D rollup-plugin-visualizer` и `vite build --plugin visualizer` для анализа.
5. **Performance budget**: bundle ≤ 250 kB gzip.

---

## 13. Чек-лист доступности (WCAG 2.1 AA)

- Альтернативный текст для изображений.
- Фокус-индикатор для интерактивов.
- Контраст текста ≥ 4.5:1.
- Использовать `lang="ru"` в `index.html`.
- Проверка Lighthouse ≥ 90 баллов по *Accessibility*.

---

## 14. Добавление новой секции / компонента

1. Создать файл в `src/components/sections` (`MyAwesomeSection.vue`).
2. Описать пропсы + эмиты, соблюсти дизайн-систему.
3. Подключить секцию в `HomeView.vue`.
4. Добавить SCSS в `<style lang="scss" scoped>` или импортировать частный файл.
5. Написать unit-тест + E2E-сценарий (если секция интерактивна).
6. Обновить документацию, если секция влияет на пользовательский путь.

--- 

## 15. Гайд по вёрстке (HTML / SCSS)

### 15.1 Слой шаблона (template)

````vue
<!-- Пример базовой секции -->
<section class="about grid lg:grid-cols-2 gap-8 py-24" id="about">
  <div>
    <h2 class="text-4xl font-bold mb-6">Кто мы?</h2>
    <p class="text-lg leading-relaxed text-gray-700">
      Платформа «Opland» создана для …
    </p>
    <ButtonPrimary label="Узнать больше" class="mt-8" />
  </div>
  <img src="@/assets/images/hero.svg" alt="Иллюстрация" class="w-full h-auto rounded-xl shadow-md" />
</section>
````

*Разбор:*
- `section`   — семантический контейнер с id для навигации;
- `grid lg:grid-cols-2` — mobile-first: одна колонка на мобилке, две ≥ 1024 px;
- `gap-8` — утилита из `global.scss` (2 rem между колонками);
- `py-24` — вертикальные отступы 6 rem на всех экранах;
- `text-4xl / font-bold / mb-6` — утилитарные классы типографики и отступов;
- Картинка имеет `alt` + декоративные классы (rounded + shadow).

### 15.2 Utility-first approach

Мы используем смесь **BEM** + собственные утилитарные классы, сгенерированные в `global.scss` (аналог Tailwind):
- **Spacing**: `px-8`, `pt-20`, `space-y-4` …
- **Flex / Grid**: `flex`, `items-center`, `justify-between`, `grid`, `lg:grid-cols-3` …
- **Размеры**: `w-1/2`, `h-96`, `max-w-4xl` …
- **Типографика**: `text-xl`, `leading-snug`, `tracking-widest`, `uppercase` …
- **Цвета и фон**: `text-primary`, `bg-gradient-primary` …

Если утилиты не покрывают кейс — добавляй SCSS-селекторы внутри блока компонента с `scoped` или расширяй `global.scss`.

### 15.3 Breakpoints & responsive

Переменные:
```scss
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

Пример миксина:
```scss
@mixin respond($breakpoint) {
  @if $breakpoint == sm { @media (min-width: $breakpoint-sm) { @content; } }
  @else if $breakpoint == md { @media (min-width: $breakpoint-md) { @content; } }
  @else if $breakpoint == lg { @media (min-width: $breakpoint-lg) { @content; } }
}
```

Использование:
```scss
.card {
  padding: $spacing-6;
  @include respond(lg) { padding: $spacing-12; }
}
```

### 15.4 Сетка и контейнеры

- Глобальный контейнер: `max-width: var(--container-width)` + `margin: 0 auto; padding: 0 1rem;`.
- Для сложных блоков применяем CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`).
- Избегаем фреймворков Bootstrap/Bulma — используем нативный Grid/Flex.

### 15.5 Переменные и mixins

- Все переменные хранятся в `variables.scss` и импортируются во все компоненты через Vite (`additionalData`).
- Миксин `ellipsis($lines:1)` для обрезки текста:
  ```scss
  @mixin ellipsis($lines:1) {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: $lines;
  }
  ```

### 15.6 Изображения и SVG

1. Иконки — отдельные Vue-компоненты в `src/components/icons`, чтобы можно было задавать `fill`/`stroke` через props.
2. Фото — храним в `assets/images/`, экспортируем через `import` для обработки Vite.
3. Для веса ≤ 30 kB используем `avif`/`webp`; фоллбэк `jpg/png` не обязателен в современных браузерах.
4. Для background-image применяем `v-bind('url(@/assets/…')`).

### 15.7 Анимации и взаимодействия

- Все transition-ы используют переменные `$transition-fast`, `$transition-normal`.
- Hover-эффект описан единожды в `global.scss` (`.interactive-hover`). Компоненту достаточно добавить класс `interactive-hover` вместо своего `:hover` CSS.
- Для scroll-анимаций планируем подключать **AOS** или контекстный IntersectionObserver.

### 15.8 Линтинг стилей

- В проект по умолчанию подключен **stylelint** (TODO, можно добавить).
- Перед merge — проверка ошибок SCSS-синтаксиса (`scss lint` планируется).

--- 