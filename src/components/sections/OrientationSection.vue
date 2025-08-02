<template>
  <!-- Секция "Содействуем профориентации" -->
  <section class="orientation-section">
    <!-- Основной контент секции -->
    <div class="orientation-content">
      <!-- Заголовок секции -->
      <h2 class="orientation-title">
        Содействуем профориентации и адаптации молодежи
        из уязвимых слоев, включая людей с нарушением слуха
        в производство
      </h2>

      <!-- Изображение с кнопкой воспроизведения -->
      <div class="orientation-image-container">
        <div class="image-wrapper">
          <!-- Основное изображение -->
          <img
            class="orientation-image"
            src="@/assets/png/goodGuy.png"
            alt="Профориентация"
          />
        </div>

        <!-- Кнопка воспроизведения поверх изображения -->
        <div class="play-button-overlay">
          <button class="play-button" @click="handlePlayClick">
            <span class="play-icon">▶</span>
          </button>
        </div>
      </div>

      <!-- Блоки с описанием услуг -->
      <div class="services-blocks">
        <!-- Блок "Наши рекомендации" -->
        <div class="service-block">
          <div class="service-icon">
            <img
              src="@/assets/png/ourRecomendations.png"
              alt="Наши рекомендации"
              class="service-image"
            />
          </div>
          <div class="service-content">
            <h3 class="service-title">Наши рекомендации</h3>
            <p class="service-description">
              Подходят для работодателей, которые принимают людей с инвалидностью
            </p>
          </div>
        </div>

        <!-- Блок "Разработка ПО" -->
        <div class="service-block">
          <div class="service-icon">
            <img
              src="@/assets/png/software.png"
              alt="Разработка ПО"
              class="service-image"
            />
          </div>
          <div class="service-content">
            <h3 class="service-title">Разработка ПО</h3>
            <p class="service-description">
              Программные решения для обеспечения доступности
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/**
 * Секция «Содействуем профориентации» (OrientationSection).
 * Показывает описание направления, изображение с play-кнопкой и два блока
 * услуг (рекомендации, разработка ПО). Кнопка пока логирует событие.
 */
export default {
  name: 'OrientationSection',
  methods: {
    handlePlayClick() {
      console.log('Кнопка воспроизведения нажата');
    }
  }
}
</script>

<style lang="scss" scoped>
.orientation-section {
  position: relative;
  width: 100%;
  height: 1200px;
  background-color: $primary-teal;
  padding: 0 2rem;
}

.orientation-content {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.orientation-title {
  position: absolute;
  left: 50%;
  top: 120px;
  transform: translateX(-50%);
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  text-align: center;
  color: $white;
  width: 1200px;
  margin: 0;
}

.orientation-image-container {
  position: absolute;
  left: 50%;
  top: 280px;
  transform: translateX(-50%);
  width: 900px;
  height: 650px;
}

.image-wrapper {
  position: relative;
  width: 900px;
  height: 650px;
}

.orientation-image {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 700px;
  height: 580px;
  border-radius: $border-radius-xl;
  object-fit: cover;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.play-button-overlay {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 6rem;
  height: 6rem;
}

.play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: $border-radius-full;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(29, 233, 182, 0.35);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, $primary-mint, $primary-cyan);
    transform: scale(1.1);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

.play-icon {
  font-size: $text-3xl;
  color: $white;
  line-height: 1;
  margin-left: 0.5rem;
}

.services-blocks {
  position: absolute;
  left: 50%;
  top: 950px;
  transform: translateX(-50%);
  display: flex;
  gap: 6rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  height: 180px;
}

.service-block {
  display: flex;
  gap: 3rem;
  align-items: center;
  justify-content: center;
  width: 520px;
  height: 180px;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: $border-radius-xl;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.4s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
}

.service-icon {
  width: 14rem;
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: $border-radius-xl;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: $border-radius-lg;
  transition: transform 0.3s ease;
}

.service-block:hover .service-image {
  transform: scale(1.05);
}

.service-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  height: 100%;
}

.service-title {
  font-size: $text-base;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: $leading-relaxed;
  color: $white;
  text-transform: uppercase;
  margin: 0;
}

.service-description {
  opacity: 0.85;
  font-size: $text-sm;
  line-height: $leading-relaxed;
  color: $white;
  margin: 0;
  max-width: 100%;
}

// Адаптивность
@media (max-width: $breakpoint-lg) {
  .orientation-section {
    height: auto;
    padding: 4rem 2rem;
  }

  .orientation-title {
    position: static;
    width: 100%;
    transform: none;
    margin-bottom: 4rem;
  }

  .orientation-image-container {
    position: static;
    width: 100%;
    max-width: 600px;
    transform: none;
    margin: 0 auto 4rem;
  }

  .image-wrapper {
    width: 100%;
    height: auto;
  }

  .orientation-image {
    position: relative;
    width: 100%;
    height: auto;
    transform: none;
    left: 0;
  }

  .services-blocks {
    position: static;
    width: 100%;
    flex-direction: column;
    gap: 3rem;
    transform: none;
  }

  .service-block {
    width: 100%;
    max-width: 500px;
    justify-content: center;
  }
}

@media (max-width: $breakpoint-md) {
  .orientation-title {
    font-size: $text-3xl;
  }

  .service-block {
    flex-direction: column;
    text-align: center;
    height: auto;
    padding: 2rem 1.5rem;
  }

  .service-content {
    align-items: center;
  }

  .play-button-overlay {
    width: 5rem;
    height: 5rem;
  }

  .play-icon {
    font-size: $text-2xl;
  }

  .service-icon {
    width: 12rem;
    height: 8rem;
  }
}
</style>
