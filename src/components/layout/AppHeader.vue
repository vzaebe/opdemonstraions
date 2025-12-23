<template>
  <!-- Главная навигация сайта -->
  <header ref="headerEl" class="header">
    <!-- Контейнер навигации с зеленым фоном -->
    <div class="nav-container">
      <!-- Логотип в левом углу -->
      <div class="logo-section">
        <router-link :to="{ name: 'home' }">
          <LogoOPIcon class="logo-icon" />
        </router-link>
      </div>

      <!-- Навигационное меню по центру -->
      <nav :class="['nav-menu', { open: isMenuOpen }]">
        <router-link :to="{ name: 'about' }" class="nav-link" @click="closeMenu">О нас</router-link>
        <router-link :to="{ name: 'organization-projects' }" class="nav-link" @click="closeMenu">Проекты</router-link>
        
        <!-- Социальная 3D-печать с выпадающим меню -->
        <div class="nav-dropdown" @mouseenter="showCharityDropdown = true" @mouseleave="showCharityDropdown = false">
          <router-link :to="{ name: 'charity' }" class="nav-link" @click="closeMenu">
            Социальная 3D-печать
            <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </router-link>
          <transition name="dropdown-fade">
            <div v-if="showCharityDropdown" class="dropdown-menu">
              <div class="dropdown-header">
                <h3>Ресурсы</h3>
                <p>Статьи, видео и материалы</p>
              </div>
              <router-link :to="{ name: 'charity-articles' }" class="dropdown-item" @click="closeMenu">
                <div class="item-icon articles">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="item-content">
                  <span class="item-title">Статьи</span>
                  <span class="item-description">Полезные публикации</span>
                </div>
              </router-link>
              <router-link :to="{ name: 'charity-videos' }" class="dropdown-item" @click="closeMenu">
                <div class="item-icon videos">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="item-content">
                  <span class="item-title">Видео</span>
                  <span class="item-description">Видеоматериалы</span>
                </div>
              </router-link>
              <router-link :to="{ name: 'charity-materials' }" class="dropdown-item" @click="closeMenu">
                <div class="item-icon materials">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="item-content">
                  <span class="item-title">Материалы</span>
                  <span class="item-description">Файлы для скачивания</span>
                </div>
              </router-link>
              <router-link :to="{ name: 'charity-models' }" class="dropdown-item" @click="closeMenu">
                <div class="item-icon models">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="item-content">
                  <span class="item-title">3D Модели</span>
                  <span class="item-description">STL файлы для печати</span>
                </div>
              </router-link>
              <router-link :to="{ name: 'charity-projects' }" class="dropdown-item" @click="closeMenu">
                <div class="item-icon projects">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="item-content">
                  <span class="item-title">Проекты</span>
                  <span class="item-description">Наши инициативы</span>
                </div>
              </router-link>
            </div>
          </transition>
        </div>
        
        <router-link :to="{ name: 'partners' }" class="nav-link" @click="closeMenu">Партнёры</router-link>
        <router-link :to="{ name: 'knowledge' }" class="nav-link" @click="closeMenu">База Знаний</router-link>
        <router-link :to="{ name: 'support' }" class="nav-link" @click="closeMenu">Поддержка</router-link>
        <router-link :to="{ name: 'contacts' }" class="nav-link" @click="closeMenu">Контакты</router-link>
      </nav>

      <!-- Правая секция: поиск и контакты -->
      <div class="right-section">
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
        <button
          class="burger-button"
          @click="toggleMenu"
          :aria-label="isMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              v-if="!isMenuOpen"
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
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
    :aria-label="isMenuOpen ? 'Закрыть меню' : 'Меню'"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        v-if="!isMenuOpen"
        d="M3 6h18M3 12h18M3 18h18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        v-else
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  <!-- Оверлей: прозрачный фон + само меню -->
  <div
    v-if="isMenuOpen && showFloatingBurger"
    class="overlay-backdrop"
    @click.self="closeMenu"
  >
    <nav class="overlay-menu" @click.stop>
      <!-- Навигационные ссылки -->
      <router-link :to="{ name: 'about' }" class="nav-link" @click="closeMenu">О нас</router-link>
      <router-link :to="{ name: 'organization-projects' }" class="nav-link" @click="closeMenu">Проекты</router-link>
      
      <!-- Социальная 3D-печать с подменю -->
      <div class="mobile-nav-section">
        <router-link :to="{ name: 'charity' }" class="nav-link" @click="closeMenu">Социальная 3D-печать</router-link>
        <div class="mobile-submenu">
          <router-link :to="{ name: 'charity-articles' }" class="submenu-link" @click="closeMenu">• Статьи</router-link>
          <router-link :to="{ name: 'charity-videos' }" class="submenu-link" @click="closeMenu">• Видео</router-link>
          <router-link :to="{ name: 'charity-materials' }" class="submenu-link" @click="closeMenu">• Материалы</router-link>
          <router-link :to="{ name: 'charity-models' }" class="submenu-link" @click="closeMenu">• Список моделей</router-link>
          <router-link :to="{ name: 'charity-projects' }" class="submenu-link" @click="closeMenu">• Проекты</router-link>
        </div>
      </div>
      
      <router-link :to="{ name: 'partners' }" class="nav-link" @click="closeMenu">Партнёры</router-link>
      <router-link :to="{ name: 'knowledge' }" class="nav-link" @click="closeMenu">База Знаний</router-link>
      <router-link :to="{ name: 'support' }" class="nav-link" @click="closeMenu">Поддержка</router-link>
      <router-link :to="{ name: 'contacts' }" class="nav-link" @click="closeMenu">Контакты</router-link>

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
      isMenuOpen: false,
      showFloatingBurger: false,
      showCharityDropdown: false,
      headerObserver: null as IntersectionObserver | null,
      keydownHandler: null as ((e: KeyboardEvent) => void) | null
    }
  },
  mounted() {
    const header = this.$refs.headerEl as HTMLElement | undefined
    if (header) {
      this.headerObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry) return
          this.showFloatingBurger = !entry.isIntersecting
          if (!entry.isIntersecting) {
            this.isMenuOpen = false
          }
        },
        { threshold: 0 }
      )
      this.headerObserver.observe(header)
    }

    // Закрытие меню по ESC
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu()
      }
    }
    document.addEventListener('keydown', this.keydownHandler)
  },
  beforeUnmount() {
    if (this.headerObserver) {
      this.headerObserver.disconnect()
    }
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler)
      this.keydownHandler = null
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    },
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 100px;
  background-color: $primary-teal;
  position: sticky;
  top: 0;
  z-index: $z-sticky;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3rem;
  padding: 0.75rem 5vw;
  width: 100%;
  height: $container-height;
  background-color: $primary-teal;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon {
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

.nav-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  min-width: 0;
}

.nav-link {
  font-size: clamp(0.9rem, 2vw, 1.15rem);
  line-height: $leading-relaxed;
  color: $white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: $border-radius-md;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover,
  &:focus-visible {
    background-color: transparent;
    // Optionally add an underline or highlight effect
    // border-bottom: 2px solid $white; 
  }
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  margin-left: 0.25rem;
}

.nav-dropdown {
  position: relative;
  display: flex;
  align-items: center;

  &:hover .dropdown-arrow {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 1rem;
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  min-width: 320px;
  z-index: $z-dropdown;
  border: 1px solid rgba($primary-teal, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid $white;
  }
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px) scale(0.95);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-5px) scale(0.98);
}

.dropdown-header {
  padding: 0.5rem 1rem;
  margin-bottom: 0.75rem;
  border-bottom: 2px solid $primary-orange;

  h3 {
    font-size: 1.1rem;
    color: $primary-teal;
    margin: 0 0 0.25rem 0;
    font-weight: 600;
  }

  p {
    font-size: 0.8rem;
    color: $gray-500;
    margin: 0;
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  color: $gray-700;
  text-decoration: none;
  border-radius: $border-radius-md;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0.25rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: $primary-orange;
    transform: scaleY(0);
    transition: transform 0.25s ease;
  }

  &:hover {
    background: linear-gradient(135deg, rgba($primary-teal, 0.08) 0%, rgba($primary-mint, 0.12) 100%);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba($primary-teal, 0.15);

    &::before {
      transform: scaleY(1);
    }

    .item-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .item-title {
      color: $primary-teal;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.item-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-md;
  transition: all 0.25s ease;

  &.articles {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    color: #1976d2;
  }

  &.videos {
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
    color: #7b1fa2;
  }

  &.materials {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    color: #388e3c;
  }

  &.models {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    color: #f57c00;
  }

  &.projects {
    background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
    color: #c2185b;
  }

  svg {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: $gray-800;
  transition: color 0.25s ease;
}

.item-description {
  font-size: 0.8rem;
  color: $gray-500;
  line-height: 1.2;
}

.search-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.search-input {
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

.right-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
  justify-content: center;
}

@media (max-width: $breakpoint-xl) {
  .nav-menu {
    gap: 1.5rem;
  }
}

@media (max-width: $breakpoint-lg) {
  .right-section {
    order: 1;
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
    gap: 1rem;
  }
  .nav-container {
    gap: 1.5rem;
    height: auto;
  }
}

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

  .nav-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: $primary-teal;
    flex-direction: column;
    align-items: flex-start;
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

  .nav-dropdown {
    width: 100%;
    flex-direction: column;
    align-items: stretch;

    .nav-link {
      justify-content: center;
    }
  }

  .dropdown-menu {
    position: static;
    margin-top: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
    width: 100%;
    transform: none;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &::before {
      display: none;
    }
  }

  .dropdown-header {
    border-bottom-color: $primary-orange;

    h3, p {
      color: $white;
    }
  }

  .dropdown-item {
    color: $white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: $white;

      .item-title {
        color: $white;
      }
    }

    &::before {
      background: $primary-orange;
    }
  }

  .item-title {
    color: rgba(255, 255, 255, 0.95);
  }

  .item-description {
    color: rgba(255, 255, 255, 0.7);
  }

  .dropdown-arrow {
    display: none;
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
  z-index: $z-modal;
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

  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: transparent;
  }

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

.mobile-nav-section {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.mobile-submenu {
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  margin-top: 0.5rem;
  gap: 0.25rem;
}

.submenu-link {
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  border-radius: $border-radius-sm;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: $white;
    transform: translateX(3px);
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

@media (max-width: $breakpoint-md) {
  .burger-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.overlay-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
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

</style>
