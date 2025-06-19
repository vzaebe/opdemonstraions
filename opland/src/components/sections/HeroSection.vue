<template>
  <!-- Секция героя с фоновым изображением -->
  <section class="hero-section">
    <!-- Фоновое изображение -->
    <div class="hero-background">
      <!-- Заглушка для фонового изображения -->
      <img 
        class="hero-bg-image" 
        src="@/assets/images/hero.svg" 
        alt="Фоновое изображение"
      />
    </div>
    
    <!-- Основной контент секции -->
    <div class="hero-content">
      <!-- Главный заголовок -->
      <div class="hero-title-container">
        <h2 class="hero-title">
          Передовые способы интеграции в реальный сектор экономики России
        </h2>
      </div>
      
      <!-- Кнопка воспроизведения -->
      <div class="play-button-container">
        <button class="play-button" @click="handlePlayClick">
          <span class="play-icon">▶</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  methods: {
    // Обработчик клика по кнопке воспроизведения
    handlePlayClick() {
      console.log('Кнопка воспроизведения нажата');
      // Здесь можно добавить логику для воспроизведения видео
    }
  }
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '@/assets/styles/variables.scss' as *;
.hero-section {
  position: relative;
  width: 100%;
  height: 800px;
  background-color: $primary-indigo;
  overflow: hidden;
}

.hero-background {
  // Контейнер для фонового изображения
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1; // Размещаем под контентом
}

.hero-bg-image {
  // Фоновое изображение
  width: 100%;
  height: 100%;
  object-fit: cover; // Растягиваем изображение на весь контейнер
  object-position: center; // Центрируем изображение
}

.hero-content {
  // Контейнер для основного контента
  position: relative;
  z-index: 2; // Размещаем поверх фона
  width: 100%;
  height: 100%;
}

.hero-title-container {
  // Контейнер для заголовка
  position: absolute;
  left: 285px;
  top: 167px;
  display: inline-flex;
  flex-direction: column;
  gap: 14rem; // space-y-56
  align-items: center;
  justify-content: flex-end;
  width: 830.01px;
  height: 512px;
}

.hero-title {
  // Главный заголовок секции
  font-size: $text-6xl;
  font-weight: 700; // font-bold
  line-height: $leading-10;
  text-align: center;
  color: $white;
  width: 830.01px;
  height: 211px;
  margin: 0;
}

.play-button-container {
  // Контейнер для кнопки воспроизведения
  position: absolute;
  left: 665px;
  top: 464px;
  width: 4rem; // w-16
  height: 4rem; // h-16
}

.play-button {
  // Кнопка воспроизведения
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  padding: 1.75rem 1.5rem 1.5rem 1.75rem; // pt-7 pb-6 pl-7 pr-6
  background-color: $primary-red;
  border: none;
  border-radius: $border-radius-full; // rounded-full
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    background-color: color.adjust($primary-red, $lightness: -10%);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.play-icon {
  // Иконка воспроизведения
  flex: 1;
  height: 100%;
  font-size: $text-xl;
  text-align: center;
  color: $white;
  line-height: 1;
}

// Адаптивность для больших экранов
@media (max-width: $breakpoint-xl) {
  .hero-title-container {
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 830px;
  }
  
  .hero-title {
    width: 100%;
    font-size: $text-5xl;
  }
  
  .play-button-container {
    left: 50%;
    transform: translateX(-50%);
  }
}

// Адаптивность для планшетов
@media (max-width: $breakpoint-lg) {
  .hero-section {
    height: 600px;
  }
  
  .hero-title-container {
    top: 100px;
    width: 95%;
  }
  
  .hero-title {
    font-size: $text-4xl;
    height: auto;
  }
  
  .play-button-container {
    top: 350px;
  }
}

// Адаптивность для мобильных устройств
@media (max-width: $breakpoint-md) {
  .hero-section {
    height: 500px;
  }
  
  .hero-title-container {
    top: 50px;
    width: 100%;
    padding: 0 1rem;
  }
  
  .hero-title {
    font-size: $text-3xl;
    line-height: 1.3;
  }
  
  .play-button-container {
    top: 300px;
  }
  
  .play-button {
    width: 3rem;
    height: 3rem;
    padding: 1rem;
  }
  
  .play-icon {
    font-size: $text-lg;
  }
}

// Адаптивность для маленьких экранов
@media (max-width: $breakpoint-sm) {
  .hero-section {
    height: 400px;
  }
  
  .hero-title-container {
    top: 30px;
  }
  
  .hero-title {
    font-size: $text-2xl;
  }
  
  .play-button-container {
    top: 250px;
  }
  
  .play-button {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.75rem;
  }
  
  .play-icon {
    font-size: $text-base;
  }
}
</style> 