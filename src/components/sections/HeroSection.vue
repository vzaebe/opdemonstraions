<template>
  <!-- Секция героя с фоновым изображением -->
  <section class="hero-section">
    <!-- Основной контент секции -->
    <div class="hero-content">
      <!-- Главный заголовок -->
      <div class="hero-title-container">
        <h2 class="hero-title">
          Передовые способы интеграции молодежи в реальный сектор экономики России
        </h2>
      </div>

      <!-- Кнопка воспроизведения -->
      <div class="play-button-container">
        <PlayButton @click="handlePlayClick" />
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

<script lang="ts">
/**
 * Секция «Hero» — первый экран лендинга.
 * Здесь располагается фон-видео/изображение, главный продающий заголовок
 * и кнопка действия (Play). По клику на кнопку можно запустить видео-презентацию
 * или скроллинг к нужному разделу.
 *
 * ✅ Особенности реализации
 *  - Используется фиксированный фон (background-attachment: fixed) для эффекта параллакса.
 *  - Кнопка имеет градиентный фон и лёгкую анимацию при ховере.
 *  - Размеры и шрифты адаптируются через @media.
 */
import PlayButton from '@/components/PlayButton.vue'

export default {
  name: 'HeroSection',
  components: {
    PlayButton
  },
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
  height: 70vh;
  min-height: 500px;
  background-image: url('@/assets/images/VideoInFuture.jpg');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 0;

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
  max-width: 900px;
}

.hero-title-container {
  margin-bottom: 2rem;
}

.hero-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-tight;
  color: $primary-mint;
  text-shadow: none;
}

.play-button-container {
  margin-bottom: 2rem;
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



  .hero-caption {
    font-size: $text-base;
  }
}

// Мобильная адаптация
@media (max-width: $breakpoint-sm) {
  .hero-section {
    // Убираем фиксированный фон на мобильных из-за проблем с производительностью
    background-attachment: scroll;
    height: calc(100vh - 100px);
    min-height: 400px;
    padding: 2rem 1rem;
  }

  .hero-content {
    padding: 0 0.5rem;
    max-width: 100%;
  }

  .hero-title {
    font-size: $text-2xl;
    line-height: $leading-snug;
    margin-bottom: 1rem;
  }

  .hero-title-container {
    margin-bottom: 1.5rem;
  }

  .play-button-container {
    margin-bottom: 1.5rem;
  }

  .play-button {
    width: 4rem;
    height: 4rem;
    // Увеличиваем touch-область для лучшего мобильного UX
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: transparent;
    }
  }

  .play-icon {
    font-size: $text-lg;
  }

  .hero-caption {
    font-size: $text-sm;
    padding: 0 1rem;
    line-height: $leading-relaxed;
  }
}
</style>
