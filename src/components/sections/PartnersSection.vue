<template>
  <!-- Секция с генеральными партнерами -->
  <section class="partners-section">
    <!-- Контейнер секции -->
    <div class="partners-container">
      <!-- Заголовок секции -->
      <div class="partners-header">
        <h2 class="partners-title">Наши партнеры</h2>
        <p class="partners-subtitle">
          Организации, которые сотрудничают с нами в области профориентации и интеграции молодежи из незащищённых слоёв населения в производство
        </p>
      </div>

      <!-- Сетка логотипов партнеров -->
      <div class="partners-grid">
        <!-- Партнер 1 - Techencon -->
        <div class="partner-card">
          <div class="partner-logo-container">
            <img
              class="partner-logo"
              src="@/assets/images/partners/techencon.svg"
              alt="Techencon"
            />
          </div>
        </div>

        <!-- Партнер 2 - COG -->
        <div class="partner-card">
          <div class="partner-logo-container">
            <img
              class="partner-logo"
              src="@/assets/images/partners/cog.svg"
              alt="COG"
            />
          </div>
        </div>

        <!-- Партнер 3 - ПКБ МГТУ -->
        <div class="partner-card">
          <div class="partner-logo-container">
            <img
              class="partner-logo"
              src="@/assets/images/partners/pkbmstu.svg"
              alt="ПКБ МГТУ"
            />
          </div>
        </div>

        <!-- Партнер 4 - МСС (текст) -->
        <div class="partner-card">
          <div class="partner-logo-container partner-text-container">
            <span class="partner-text">МСС</span>
          </div>
        </div>

        <!-- Партнер 5 - Simtech -->
        <div class="partner-card">
          <div class="partner-logo-container">
            <img
              class="partner-logo"
              src="@/assets/images/partners/simtech.svg"
              alt="Simtech"
            />
          </div>
        </div>

        <!-- Партнер 6 - Akzent -->
        <div class="partner-card">
          <div class="partner-logo-container">
            <img
              class="partner-logo"
              src="@/assets/images/partners/akzent.svg"
              alt="Akzent"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/**
 * Секция «Партнёры» (PartnersSection).
 * Отображает сетку логотипов/названий организаций-партнёров. Каждая карточка
 * реагирует на hover, применяя градиент и трансформацию.
 */
export default {
  name: 'PartnersSection'
}
</script>

<style lang="scss" scoped>
.partners-section {
  width: 100%;
  max-width: 100vw; // Предотвращаем горизонтальное переполнение
  min-height: 800px;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 50%, rgba(29, 233, 182, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 20%, rgba(24, 255, 255, 0.1) 0%, transparent 50%);
    animation: float 6s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-20px, -20px) rotate(1deg);
  }
}

.partners-container {
  width: 100%;
  max-width: $container-width;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
}

.partners-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  max-width: 800px;
}

.partners-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $white;
  margin: 0;
}

.partners-subtitle {
  opacity: $opacity-70;
  font-size: $text-lg;
  font-weight: 500;
  line-height: $leading-7;
  color: $white;
  margin: 0;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
}

.partner-card {
  width: 100%;
  height: 160px;
}

.partner-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px solid $white;
  border-radius: $border-radius;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.05) translateY(-5px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(29, 233, 182, 0.1));
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    border-color: $primary-cyan;
  }

  &:nth-child(odd):hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(203, 136, 22, 0.1));
    border-color: $primary-orange;
  }

  &:nth-child(even):hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 82, 82, 0.1));
    border-color: $primary-coral;
  }
}

.partner-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.partner-text-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-text {
  font-size: 3rem;
  font-weight: 700;
  color: $white;
  text-align: center;
  letter-spacing: 0.1em;
}

@media (max-width: $breakpoint-lg) {
  .partners-section {
    padding: 5rem 2rem;
  }

  .partners-container {
    gap: 3rem;
  }

  .partners-header {
    gap: 1.5rem;
  }

  .partners-title {
    font-size: $text-4xl;
  }

  .partners-subtitle {
    font-size: $text-base;
  }

  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .partner-card {
    height: 140px;
  }

  .partner-text {
    font-size: 2.5rem;
  }
}

@media (max-width: $breakpoint-md) {
  .partners-section {
    padding: 4rem 1rem;
  }

  .partners-container {
    gap: 2.5rem;
  }

  .partners-grid {
    gap: 1.5rem;
  }

  .partner-card {
    height: 120px;
  }

  .partner-logo-container {
    padding: 1rem;
  }

  .partner-text {
    font-size: 2rem;
  }
}

@media (max-width: $breakpoint-sm) {
  .partners-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .partner-card {
    height: 100px;
  }

  .partner-text {
    font-size: 1.8rem;
  }
}
</style>
