<template>
  <!-- Главная навигация сайта -->
  <header ref="headerEl" class="header">
    <!-- Контейнер навигации с зеленым фоном -->
    <div class="nav-container">
      <!-- Логотип в левом углу -->
      <div class="logo-section">
        <LogoOPIcon class="logo-icon" />
      </div>

      <!-- Навигационное меню по центру -->
      <nav :class="['nav-menu', { open: isMenuOpen }]">
        <a href="#about" class="nav-link" @click="closeMenu">О нас</a>
        <a href="#projects" class="nav-link" @click="closeMenu">Проекты</a>
        <a href="#partners" class="nav-link" @click="closeMenu">Партнёры</a>
        <a href="#knowledge" class="nav-link" @click="closeMenu">База Знаний</a>
        <a href="#support" class="nav-link" @click="closeMenu">Поддержать</a>
        <a href="#contacts" class="nav-link" @click="closeMenu">Контакты</a>
      </nav>

      <!-- Правая секция: поиск и контакты -->
      <div class="right-section">
        <!-- Поисковая строка -->
        <div class="search-container">
          <div class="search-input">
            <input
              type="text"
              class="search-field"
              placeholder="Поиск"
              @focus="onSearchFocus"
              @blur="onSearchBlur"
              v-model="searchQuery"
            />
            <button class="search-button" @click="performSearch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Контактная информация -->
        <div class="contact-container">
          <a href="tel:+79999999999" class="contact-link" aria-label="Телефон">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.9 19.9 0 0 1-8.63-3.06 19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 1 4.18 2 2 0 0 1 3 2h4.09a2 2 0 0 1 2 1.72c.12.81.34 1.6.66 2.35a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l2.73-2.73a2 2 0 0 1 2.11-.45c.75.32 1.54.54 2.35.66a2 2 0 0 1 1.72 2.03z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="mailto:info@example.com" class="contact-link" aria-label="Email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="https://t.me/username" target="_blank" rel="noopener" class="contact-link" aria-label="Telegram">
            <TgIcon :width="18" :height="18" />
          </a>
        </div>

        <!-- Кнопка бургера (видна только на мобильных) -->
        <button class="burger-button" @click="toggleMenu" aria-label="Открыть меню">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Плавающая кнопка-бургер (видима, когда шапка вышла из области видимости) -->
  <button
    class="floating-burger"
    v-show="showFloatingBurger"
    @click="toggleMenu"
    aria-label="Меню"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <!-- Оверлей: прозрачный фон + само меню -->
  <div
    v-if="isMenuOpen && showFloatingBurger"
    class="overlay-backdrop"
    @click.self="closeMenu"
  >
    <nav class="overlay-menu" @click.stop>
      <!-- Кнопка закрытия -->
      <button class="close-button" @click="closeMenu" aria-label="Закрыть меню">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <a href="#about" class="nav-link" @click="closeMenu">О нас</a>
      <a href="#projects" class="nav-link" @click="closeMenu">Проекты</a>
      <a href="#partners" class="nav-link" @click="closeMenu">Партнёры</a>
      <a href="#knowledge" class="nav-link" @click="closeMenu">База Знаний</a>
      <a href="#support" class="nav-link" @click="closeMenu">Поддержать</a>
      <a href="#contacts" class="nav-link" @click="closeMenu">Контакты</a>
    </nav>
  </div>
</template>

<script lang="ts">
/**
 * Компонент «AppHeader» — верхняя шапка сайта с навигацией, строкой поиска
 * и контактами. Поддерживает адаптивное меню «бургер» и плавающую кнопку,
 * которая появляется, когда шапка выходит из зоны видимости (scroll).
 *
 * Основные элементы:
 *  - Логотип (LogoOPIcon)
 *  - Навигационные ссылки (anchor ссылки на секции лендинга)
 *  - Строка поиска (v-model="searchQuery")
 *  - Контакты: телефон, email, Telegram
 *  - Burger-меню для мобильных + плавное появление плавающей кнопки
 */
import LogoOPIcon from '../icons/LogoOPIcon.vue'
import TgIcon from '../icons/TgIcon.vue'

export default {
  name: 'AppHeader',
  components: {
    LogoOPIcon,
    TgIcon
  },
  data() {
    return {
      searchQuery: '',
      isSearchFocused: false,
      isMenuOpen: false,
      showFloatingBurger: false,
      headerObserver: null as IntersectionObserver | null
    }
  },
  mounted() {
    const header = this.$refs.headerEl as HTMLElement | undefined
    if (header) {
      this.headerObserver = new IntersectionObserver(
        ([entry]) => {
          this.showFloatingBurger = !entry.isIntersecting
          if (!entry.isIntersecting) {
            // когда шапка вне зоны видимости закрываем меню, чтобы не мешало
            this.isMenuOpen = false
          }
        },
        { threshold: 0 }
      )
      this.headerObserver.observe(header)
    }
  },
  beforeUnmount() {
    if (this.headerObserver) {
      this.headerObserver.disconnect()
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    },
    onSearchFocus() {
      this.isSearchFocused = true
    },
    onSearchBlur() {
      this.isSearchFocused = false
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        // Здесь можно добавить логику поиска
        console.log('Поиск:', this.searchQuery)
        // Например, эмит события для родительского компонента
        this.$emit('search', this.searchQuery)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  // Контейнер для всей навигации
  width: 100%;
  height: 100px;
  background-color: $primary-teal;
}

.nav-container {
  // Основной контейнер навигации
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap; // разрешаем перенос элементов при нехватке места
  gap: 3rem;
  padding: 0.75rem 5vw; // top/right/bottom/left
  width: 100%;
  height: $container-height;
  background-color: $primary-teal;
}

.logo-section {
  // Секция с логотипом в левом углу
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon {
  // Логотип OP
  width: 180px;
  height: auto;
  max-height: 60px;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

.spacer {
  // Пустое пространство для баланса
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 20%; // w-1/5
  height: 25%; // h-1/4
}

.nav-menu {
  // Навигационное меню по центру
  display: flex;
  flex-wrap: wrap; // разрешаем перенос ссылок
  gap: 2rem;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  min-width: 0;
}

.nav-link {
  // Ссылки в навигации
  font-size: clamp(0.9rem, 2vw, 1.15rem);
  line-height: $leading-relaxed;
  color: $white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: $border-radius-md;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;

  // Hover эффект убран здесь; применяется общий глобальный (мягкий) эффект
  &:hover,
  &:focus-visible {
    background-color: transparent;
  }
}

.search-container {
  // Контейнер поисковой строки
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.search-input {
  // Поле поиска
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: clamp(180px, 20vw, 280px);
  height: 2.5rem;
  padding: 0 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: $border-radius-full;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.8);
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }
}

.search-field {
  // Поле ввода поиска
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: $white;
  font-size: $text-base;
  font-weight: 500;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    transition: opacity 0.3s ease;
  }

  &:focus::placeholder {
    opacity: 0;
  }
}

.search-button {
  // Кнопка поиска
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: $border-radius-sm;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: $white;
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

// Контейнер для контактной информации
.contact-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.contact-link {
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease, transform 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
}

// Правая секция (поиск + контакты)
.right-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
  justify-content: center;
}

// Адаптивность для планшетов
@media (max-width: $breakpoint-xl) {
  .nav-menu {
    gap: 1.5rem;
  }
}

@media (max-width: $breakpoint-lg) {
  .right-section {
    order: 1; // переносим под меню
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
    gap: 1rem;
  }
  .nav-container {
    gap: 1.5rem;
    height: auto; // увеличиваем высоту под два ряда
  }
}

// Адаптивность для мобильных устройств
@media (max-width: $breakpoint-md) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 1rem;
  }

  .logo-section {
    order: -1; // Перемещаем логотип в начало на мобильных
    margin-left: 0;
    margin-bottom: 1rem;
  }

  .spacer {
    display: none;
  }

  .nav-menu {
    display: none; // скрыто по умолчанию
    position: absolute;
    top: 100%;
    right: 1rem;
    background: $primary-teal;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: $border-radius-md;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
    width: max-content;
  }

  .nav-menu.open {
    display: flex;
  }

  .right-section {
    width: 100%;
    justify-content: space-between;
  }

  .search-input {
    width: 100%;
  }

  .logo-icon {
    width: 120px;
  }

  .burger-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// Адаптивность для маленьких экранов
@media (max-width: $breakpoint-sm) {
  .nav-container {
    padding: 0.5rem;
  }

  .nav-link {
    font-size: clamp(0.7rem, 4vw, 0.95rem);
  }

  .logo-icon {
    width: 100px;
  }
}

.burger-button {
  background: none;
  border: none;
  color: $white;
  display: none;
  padding: 0.5rem;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* Плавающая кнопка-бургер */
.floating-burger {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: $primary-teal;
  border: none;
  color: $white;
  padding: 0.5rem;
  border-radius: $border-radius-md;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-sticky;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: $primary-mint;
    transform: scale(1.05);
  }
}

/* Оверлей-меню, появляющееся из правого края */
.overlay-menu {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 260px;
  background: $primary-teal;
  padding: 4rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: $z-sticky;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.25);

  /* плавное появление — можно добавить по желанию */
  animation: slide-in 0.3s ease forwards;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Скрываем бургер-кнопку внутри шапки, если она есть, на больших экранах */
@media (min-width: $breakpoint-md) {
  .burger-button {
    display: none;
  }
}

/* Прозрачный фон для клика вне меню */
.overlay-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent; // можно чуть затемнить, если нужно
  z-index: ($z-sticky - 1);
}

/* Кнопка закрытия внутри меню */
.close-button {
  background: none;
  border: none;
  color: $white;
  align-self: flex-end;
  margin-bottom: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: $border-radius-sm;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
