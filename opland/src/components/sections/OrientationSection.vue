<template>
  <!-- Секция "Содействуем профориентации" -->
  <section class="orientation-section">
    <!-- Основной контент секции -->
    <div class="orientation-content">
      <!-- Заголовок секции -->
      <h2 class="orientation-title">
        Содействуем профориентации<br/>и интеграции в производство
      </h2>
      
      <!-- Изображение с кнопкой воспроизведения -->
      <div class="orientation-image-container">
        <div class="image-wrapper">
          <!-- Заглушка для основного изображения -->
          <img 
            class="orientation-image" 
            src="@/assets/images/placeholder.svg"
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
            <span class="icon">📋</span>
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
            <span class="icon">💻</span>
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

<script>
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
  height: 1020px;
  background-color: $primary-green;
}

.orientation-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.orientation-title {
  position: absolute;
  left: 347px;
  top: 96px;
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  text-align: center;
  color: $white;
  width: 707px;
  margin: 0;
}

.orientation-image-container {
  position: absolute;
  left: 315px;
  top: 214px;
  width: 828px;
  height: 600px;
}

.image-wrapper {
  position: relative;
  width: 828px;
  height: 600px;
}

.orientation-image {
  position: absolute;
  left: 71px;
  top: 0;
  width: 629px;
  height: 535px;
  border-radius: $border-radius-lg;
  object-fit: cover;
}

.play-button-overlay {
  position: absolute;
  left: 350px;
  top: 221px;
  width: 4rem;
  height: 4rem;
}

.play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  padding: 1.75rem 1.5rem 1.5rem 1.75rem;
  background-color: $primary-yellow;
  border: none;
  border-radius: $border-radius-full;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.play-icon {
  flex: 1;
  height: 100%;
  font-size: $text-xl;
  text-align: center;
  color: $white;
  line-height: 1;
}

.services-blocks {
  position: absolute;
  left: 255px;
  top: 777px;
  display: inline-flex;
  gap: 3.5rem;
  align-items: center;
  justify-content: flex-end;
  width: 938px;
  height: 117px;
}

.service-block {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: flex-end;
  width: 445px;
  height: 117px;
}

.service-icon {
  width: 11rem;
  height: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: $border-radius;
  
  .icon {
    font-size: $text-xl;
    color: $white;
  }
}

.service-content {
  display: inline-flex;
  flex-direction: column;
  gap: 0.625rem;
  align-items: center;
  justify-content: flex-end;
  width: 15rem;
  height: 7rem;
}

.service-title {
  width: 13rem;
  font-size: $text-sm;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: $leading-relaxed;
  color: $white;
  text-transform: uppercase;
  margin: 0;
}

.service-description {
  opacity: $opacity-70;
  width: 100%;
  font-size: $text-base;
  line-height: $leading-relaxed;
  color: $white;
  margin: 0;
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
    margin-bottom: 3rem;
  }
  
  .orientation-image-container {
    position: static;
    width: 100%;
    margin-bottom: 3rem;
  }
  
  .services-blocks {
    position: static;
    width: 100%;
    flex-direction: column;
    gap: 2rem;
  }
  
  .service-block {
    width: 100%;
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
  }
}
</style> 