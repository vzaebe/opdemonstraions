<template>
  <!-- Секция героя с фоновым изображением -->
  <section class="hero-section">
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
      
      <!-- Дополнительная надпись -->
      <div class="hero-caption-container">
        <p class="hero-caption">
          Узнайте больше о наших возможностях
        </p>
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
  height: 100vh;
  background-image: url('@/assets/images/VideoInFuture.jpg');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: $white;
  padding: 0 1rem;
}

.hero-title-container {
  margin-bottom: 2rem;
}

.hero-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-tight;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.play-button-container {
  margin-bottom: 2rem;
}

.play-button {
  width: 5rem;
  height: 5rem;
  border-radius: $border-radius-full;
  background-color: rgba(220, 38, 38, 0.8);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: rgba(220, 38, 38, 1);
    transform: scale(1.1);
  }
}

.play-icon {
  font-size: $text-2xl;
  color: $white;
  line-height: 1;
  margin-left: 0.25rem;
}

.hero-caption {
  font-size: $text-lg;
  font-weight: 400;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

// Адаптивность
@media (max-width: $breakpoint-md) {
  .hero-title {
    font-size: $text-4xl;
  }

  .play-button {
    width: 4.5rem;
    height: 4.5rem;
  }

  .play-icon {
    font-size: $text-xl;
  }

  .hero-caption {
    font-size: $text-base;
  }
}

@media (max-width: $breakpoint-sm) {
  .hero-title {
    font-size: $text-3xl;
  }

  .play-button {
    width: 4rem;
    height: 4rem;
  }

  .play-icon {
    font-size: $text-lg;
  }
}
</style> 