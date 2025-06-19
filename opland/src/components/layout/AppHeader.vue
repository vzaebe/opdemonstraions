<template>
  <!-- Главная навигация сайта -->
  <header class="header">
    <!-- Контейнер навигации с зеленым фоном -->
    <div class="nav-container">
      <!-- Логотип и название -->
      <div class="logo-section">
        <!-- Повернутый квадрат с розовым фоном -->
        <div class="logo-square"></div>
        <!-- Название организации -->
        <h1 class="logo-text">Открытые<br/>Перспективы</h1>
      </div>
      
      <!-- Пустое пространство для баланса -->
      <div class="spacer"></div>
      
      <!-- Навигационное меню -->
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
          <span class="search-placeholder">Поиск</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  // Компонент не требует дополнительной логики
}
</script>

<style lang="scss" scoped>
.header {
  // Контейнер для всей навигации
  width: 100%;
  height: 100px;
  background-color: $primary-green;
}

.nav-container {
  // Основной контейнер навигации
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2.25rem; // space-x-9
  padding: 0 7rem 0.75rem 7rem; // px-28 py-3
  width: $container-width;
  height: $container-height;
  background-color: $primary-green;
}

.logo-section {
  // Секция с логотипом и названием
  display: inline-flex;
  flex-direction: column;
  gap: 24rem; // space-y-96
  align-items: flex-end;
  justify-content: center;
  flex: 1;
  padding-bottom: 0.75rem; // pb-3
}

.logo-square {
  // Повернутый квадрат логотипа
  transform: rotate(-90deg);
  width: 5rem; // w-20
  height: 5rem; // h-20
  background-color: $primary-pink;
  opacity: 0.5; // bg-opacity-50
  border: 4px solid transparent; // border-4
  border-radius: $border-radius-lg; // rounded-lg
}

.logo-text {
  // Текст названия организации
  width: 8rem; // w-32
  font-size: $text-xl;
  font-weight: 500; // font-medium
  color: $white;
  line-height: 1.5;
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
  // Навигационное меню
  display: flex;
  gap: 0.5rem; // space-x-2
  align-items: flex-start;
  justify-content: flex-start;
  width: 404px;
  height: 26px;
}

.nav-link {
  // Ссылки в навигации
  font-size: $text-base;
  line-height: $leading-relaxed;
  color: $white;
  text-decoration: none;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
}

.search-container {
  // Контейнер поисковой строки
  width: 16.666667%; // w-1/6
  height: 2.5rem; // h-10
}

.search-input {
  // Поле поиска
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  height: 100%;
  padding: 0.625rem 8rem 0.5rem 1rem; // pt-2.5 pb-2 pl-4 pr-32
  border: 2px solid $white; // border-2
  border-radius: $border-radius-full; // rounded-full
}

.search-placeholder {
  // Плейсхолдер поиска
  opacity: $opacity-40;
  font-size: $text-base;
  font-weight: 500; // font-medium
  line-height: $leading-snug;
  color: $white;
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
    flex-direction: row;
    gap: 1rem;
    align-items: center;
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
  }
  
  .search-input {
    width: 100%;
  }
}

// Адаптивность для маленьких экранов
@media (max-width: $breakpoint-sm) {
  .nav-container {
    padding: 0.5rem;
  }
  
  .logo-text {
    font-size: $text-lg;
  }
  
  .nav-link {
    font-size: $text-sm;
  }
}
</style> 