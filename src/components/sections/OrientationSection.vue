<template>
  <section class="orientation-section">
    <div class="container">
      <!-- Заголовок -->
      <header class="section-header">
        <h2 class="section-title">
          Содействуем профориентации и адаптации молодежи
          из уязвимых слоев, включая людей с нарушением слуха
          в производство
        </h2>
      </header>

      <!-- Основной контент -->
      <div class="main-content">
        <!-- Видео блок -->
        <div class="video-block">
          <div class="video-container">
            <img
              class="video-preview"
              :src="goodGuy"
              alt="Профориентация"
            />
            <PlayButton
              :overlay="true"
              @click="handlePlayClick"
            />
          </div>
        </div>

        <!-- Блоки услуг -->
        <div class="services-grid">
          <article class="service-card">
            <div class="service-media">
              <img
                :src="ourRecomendations"
                alt="Наши рекомендации"
                class="service-image"
              />
            </div>
            <div class="service-info">
              <h3 class="service-title">Наши рекомендации</h3>
              <p class="service-description">
                Подходят для работодателей, которые принимают людей с инвалидностью
              </p>
            </div>
          </article>

          <article class="service-card">
            <div class="service-media">
              <img
                :src="software"
                alt="Разработка ПО"
                class="service-image"
              />
            </div>
            <div class="service-info">
              <h3 class="service-title">Разработка ПО</h3>
              <p class="service-description">
                Программные решения для обеспечения доступности
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import PlayButton from '@/components/PlayButton.vue'

/**
 * Секция «Содействуем профориентации» (OrientationSection).
 * Показывает описание направления, изображение с play-кнопкой и два блока
 * услуг (рекомендации, разработка ПО). Кнопка пока логирует событие.
 */
export default {
  name: 'OrientationSection',
  components: {
    PlayButton
  },
  methods: {
    handlePlayClick() {
      console.log('Кнопка воспроизведения нажата');
    }
  }
}
</script>
<script lang="ts" setup>
const goodGuy = new URL('../../assets/png/goodGuy.png', import.meta.url).href
const ourRecomendations = new URL('../../assets/png/ourRecomendations.png', import.meta.url).href
const software = new URL('../../assets/png/software.png', import.meta.url).href
</script>

<style lang="scss" scoped>
// Основная секция
.orientation-section {
  background-color: $primary-teal;
  padding: 5rem 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

// Контейнер
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
}

// Заголовок секции
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp($text-3xl, 4vw, $text-5xl);
  font-weight: 700;
  line-height: 1.2;
  color: $white;
  margin: 0;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

// Основной контент
.main-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;
}

// Видео блок
.video-block {
  display: flex;
  justify-content: center;
}

.video-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16/10;
  border-radius: $border-radius-2xl;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
}

.video-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}



// Сетка услуг
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

// Карточка услуги
.service-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $border-radius-2xl;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
}

.service-media {
  flex-shrink: 0;
  width: 120px;
  height: 90px;
  border-radius: $border-radius-xl;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.service-card:hover .service-image {
  transform: scale(1.05);
}

.service-info {
  flex: 1;
}

.service-title {
  font-size: $text-lg;
  font-weight: 700;
  color: $white;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.service-description {
  font-size: $text-base;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

// Адаптивность
@media (max-width: $breakpoint-lg) {
  .container {
    padding: 0 1.5rem;
  }

  .main-content {
    gap: 3rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .service-card {
    padding: 1.5rem;
    gap: 1rem;
  }

  .service-media {
    width: 100px;
    height: 75px;
  }
}

@media (max-width: $breakpoint-md) {
  .orientation-section {
    padding: 4rem 0;
    min-height: auto;
  }

  .container {
    padding: 0 1rem;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .main-content {
    gap: 2.5rem;
  }

  .video-container {
    max-width: 600px;
  }



  .service-card {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1.5rem;
  }

  .service-media {
    width: 140px;
    height: 105px;
  }

  .service-info {
    text-align: center;
  }
}

@media (max-width: $breakpoint-sm) {
  .orientation-section {
    padding: 3rem 0;
  }

  .container {
    padding: 0 0.75rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .main-content {
    gap: 2rem;
  }

  .video-container {
    max-width: 100%;
  }



  .services-grid {
    gap: 1rem;
  }

  .service-card {
    padding: 1.5rem 1rem;
  }

  .service-media {
    width: 120px;
    height: 90px;
  }

  .service-title {
    font-size: $text-base;
  }

  .service-description {
    font-size: $text-sm;
  }
}
</style>
