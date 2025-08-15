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
          <a href="tel:+79150033935" class="contact-link" aria-label="Телефон">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.9 19.9 0 0 1-8.63-3.06 19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 1 4.18 2 2 0 0 1 3 2h4.09a2 2 0 0 1 2 1.72c.12.81.34 1.6.66 2.35a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l2.73-2.73a2 2 0 0 1 2.11-.45c.75.32 1.54.54 2.35.66a2 2 0 0 1 1.72 2.03z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="mailto:info@openperspectives.ru" class="contact-link" aria-label="Email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="https://t.me/openperspectives" target="_blank" rel="noopener" class="contact-link" aria-label="Telegram">
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

      <!-- Мобильный поиск -->
      <div class="mobile-search">
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

      <!-- Навигационные ссылки -->
      <a href="#about" class="nav-link" @click="closeMenu">О нас</a>
      <a href="#projects" class="nav-link" @click="closeMenu">Проекты</a>
      <a href="#partners" class="nav-link" @click="closeMenu">Партнёры</a>
      <a href="#knowledge" class="nav-link" @click="closeMenu">База Знаний</a>
      <a href="#support" class="nav-link" @click="closeMenu">Поддержать</a>
      <a href="#contacts" class="nav-link" @click="closeMenu">Контакты</a>

      <!-- Контактная информация в мобильном меню -->
      <div class="mobile-contacts">
        <div class="contact-links">
          <a href="tel:+79150033935" class="mobile-contact-link" @click="closeMenu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.9 19.9 0 0 1-8.63-3.06 19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 1 4.18 2 2 0 0 1 3 2h4.09a2 2 0 0 1 2 1.72c.12.81.34 1.6.66 2.35a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l2.73-2.73a2 2 0 0 1 2.11-.45c.75.32 1.54.54 2.35.66a2 2 0 0 1 1.72 2.03z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>+7 915 003 39 35</span>
          </a>
          <a href="mailto:info@openperspectives.ru" class="mobile-contact-link" @click="closeMenu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>info@openperspectives.ru</span>
          </a>
          <a href="https://t.me/openperspectives" target="_blank" rel="noopener" class="mobile-contact-link" @click="closeMenu">
            <TgIcon :width="18" :height="18" />
            <span>Telegram</span>
          </a>
        </div>
      </div>
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
  position: sticky; // Делаем заголовок липким
  top: 0;
  z-index: $z-sticky;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  .header {
    height: auto;
    min-height: 100px;
  }

  .nav-container {
    flex-direction: row;
    flex-wrap: wrap;
    height: auto;
    min-height: 100px;
    padding: 1rem;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
  }

  .logo-section {
    order: 0;
    margin: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .spacer {
    display: none;
  }

  .nav-menu {
    display: none; // скрыто по умолчанию
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: $primary-teal;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem 1rem;
    border-radius: 0 0 $border-radius-md $border-radius-md;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
    width: 100%;
    z-index: $z-dropdown;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
  }

  .nav-menu.open {
    display: flex;
    opacity: 1;
    transform: translateY(0);
  }

  .nav-link {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
    width: 100%;
    text-align: center;
    border-radius: $border-radius-sm;
    display: block;
    text-decoration: none;
    color: $white;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateX(5px);
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    order: 1;
    flex-shrink: 0;
  }

  .search-container {
    display: none; // Скрываем поиск на мобильных для экономии места
  }

  .logo-icon {
    width: 180px;
    max-height: 60px;
  }

  // Мобильный поиск в overlay меню
  .mobile-search {
    display: block;
    width: 100%;
    margin-bottom: 1.5rem;

    .search-input {
      width: 100%;
      margin: 0;
    }

    .search-field {
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: $white;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .search-button {
      background-color: rgba(255, 255, 255, 0.1);
      color: $white;

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .contact-container {
    display: flex;
    gap: 0.75rem;
  }

  .contact-link {
    padding: 0.5rem;
    border-radius: $border-radius-sm;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .logo-icon {
    width: 140px;
    max-height: 50px;
  }

  .burger-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    min-width: 44px; // Минимальный размер для touch
    min-height: 44px;
  }
}

// Адаптивность для маленьких экранов
@media (max-width: $breakpoint-sm) {
  .nav-container {
    padding: 0.75rem 0.5rem;
  }

  .nav-link {
    font-size: 0.95rem;
    padding: 1rem 1.5rem;
  }

  .logo-icon {
    width: 220px;
    max-height: 80px;
  }

  .contact-container {
    gap: 0.5rem;
  }

  .contact-link {
    padding: 0.4rem;
    min-width: 40px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .burger-button {
    min-width: 40px;
    min-height: 40px;
    padding: 0.5rem;
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
  padding: 0.75rem;
  min-width: 48px;
  min-height: 48px;
  border-radius: $border-radius-lg;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal; // Увеличен z-index для правильного отображения
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &:hover {
    background: $primary-mint;
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  // Дополнительная touch-область для мобильных
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: transparent;
  }

  // Анимация появления
  opacity: 0;
  transform: translateY(-100%);
  animation: slide-down 0.3s ease forwards;
}

@keyframes slide-down {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Оверлей-меню, появляющееся из правого края */
.overlay-menu {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(320px, 85vw);
  background: $primary-teal;
  padding: 4rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: $z-modal;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.25);
  overflow-y: auto;

  /* плавное появление */
  animation: slide-in 0.3s ease forwards;

  .nav-link {
    font-size: 1.1rem;
    padding: 1rem 1.5rem;
    text-align: center;
    border-radius: $border-radius-md;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateX(-5px);
    }
  }

  .mobile-contacts {
    margin-top: auto;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .contact-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .mobile-contact-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: $border-radius-md;
    color: $white;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateX(-3px);
    }

    span {
      font-size: 0.9rem;
    }
  }
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
  background: rgba(0, 0, 0, 0.5); // Затемняем фон для лучшего UX
  z-index: ($z-modal - 1);
  backdrop-filter: blur(4px);
  animation: fade-in 0.3s ease forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
