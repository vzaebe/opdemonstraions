<template>
  <!-- Главная навигация сайта -->
  <header class="header">
    <!-- Контейнер навигации с зеленым фоном -->
    <div class="nav-container">
      <!-- Логотип в левом углу -->
      <div class="logo-section">
        <LogoOPIcon class="logo-icon" />
      </div>
      
      <!-- Навигационное меню по центру -->
      <nav class="nav-menu">
        <a href="#contacts" class="nav-link">Контакты</a>
        <a href="#projects" class="nav-link">Проекты</a>
        <a href="#partners" class="nav-link">Партнёры</a>
        <a href="#about" class="nav-link">О нас</a>
        <a href="#knowledge" class="nav-link">База Знаний</a>
      </nav>
      
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
    </div>
  </header>
</template>

<script>
import LogoOPIcon from '@/components/icons/LogoOPIcon.vue'

export default {
  name: 'AppHeader',
  components: {
    LogoOPIcon
  },
  data() {
    return {
      searchQuery: '',
      isSearchFocused: false
    }
  },
  methods: {
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
  justify-content: space-between;
  gap: 3rem;
  padding: 0 3rem 0.75rem 3rem;
  width: $container-width;
  height: $container-height;
  background-color: $primary-teal;
}

.logo-section {
  // Секция с логотипом в левом углу
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
  gap: 2rem;
  align-items: center;
  justify-content: center;
  flex: 1 1 0%;
  min-width: 0;
}

.nav-link {
  // Ссылки в навигации
  font-size: clamp(0.9rem, 2vw, 1.15rem);
  line-height: $leading-relaxed;
  color: $white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: $border-radius-md;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: $white;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover::after {
    width: 80%;
  }
}

.search-container {
  // Контейнер поисковой строки
  flex-shrink: 0;
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.search-input {
  // Поле поиска
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 280px;
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

// Адаптивность для планшетов
@media (max-width: $breakpoint-lg) {
  .nav-container {
    width: 100%;
    padding: 0 2rem 0.75rem 2rem;
    gap: 1rem;
  }
  
  .nav-menu {
    width: auto;
    flex-wrap: wrap;
  }
  
  .search-container {
    width: auto;
    min-width: 200px;
  }
  
  .logo-icon {
    width: 140px;
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
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .search-container {
    width: 100%;
    margin-left: 0;
    justify-content: flex-end;
  }
  
  .search-input {
    width: 100%;
  }
  
  .logo-icon {
    width: 120px;
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
</style> 