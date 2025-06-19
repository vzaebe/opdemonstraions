<template>
  <section class="services-cards-section">
    <div class="services-cards-container">
      <div class="service-card">
        <img class="service-image" src="@/assets/images/placeholder.svg" alt="Мастер-классы" />
        <div class="service-info">
          <span class="service-category">Для компаний</span>
          <h3 class="service-title">Мастер-классы</h3>
        </div>
      </div>
      <div class="service-card active">
        <img class="service-image" src="@/assets/images/placeholder.svg" alt="Проект Адаптация" />
        <div class="service-info">
          <span class="service-category">Для разработчиков</span>
          <h3 class="service-title">Проект Адаптация</h3>
        </div>
      </div>
      <div class="service-card">
        <img class="service-image" src="@/assets/images/placeholder.svg" alt="База знаний" />
        <div class="service-info">
          <span class="service-category">для глухих инженеров</span>
          <h3 class="service-title">База знаний</h3>
        </div>
      </div>
      <div class="service-card">
        <img class="service-image" src="@/assets/images/placeholder.svg" alt="Список вакансий" />
        <div class="service-info">
          <span class="service-category">Для трудоустройства</span>
          <h3 class="service-title">Список вакансий</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ServicesCardsSection'
}
</script>

<style lang="scss" scoped>
.services-cards-section {
  width: 100%;
  height: 726px;
  background-color: $white;
  position: relative;
}

.services-cards-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.service-card {
  position: absolute;
  background-color: $white;
  border: 2px solid $gray-200;
  border-radius: $border-radius-2xl;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-md;
  }
  
  &.active {
    border-color: $primary-indigo;
  }
  
  &:nth-child(1) {
    width: 498.58px;
    height: 262.41px;
    left: 188.06px;
    top: 87.47px;
  }
  
  &:nth-child(2) {
    width: 436.11px;
    height: 262.46px;
    left: 713px;
    top: 87px;
  }
  
  &:nth-child(3) {
    width: 499px;
    height: 230px;
    left: 188px;
    top: 376px;
  }
  
  &:nth-child(4) {
    width: 436.11px;
    height: 229.53px;
    left: 712.88px;
    top: 376.12px;
  }
}

.service-image {
  position: absolute;
  border-radius: $border-radius-lg;
  object-fit: cover;
  
  .service-card:nth-child(1) & {
    width: 11rem;
    height: 14rem;
    left: 300.02px;
    top: 19.24px;
  }
  
  .service-card:nth-child(2) & {
    width: 10rem;
    height: 14rem;
    left: 262.43px;
    top: 19.25px;
  }
  
  .service-card:nth-child(3) & {
    width: 11rem;
    height: 12rem;
    left: 300.35px;
    top: 16.83px;
  }
  
  .service-card:nth-child(4) & {
    width: 10rem;
    height: 12rem;
    left: 262.43px;
    top: 16.83px;
  }
}

.service-info {
  position: absolute;
  left: 35px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.service-category {
  font-size: $text-xs;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: $leading-snug;
  color: $gray-900;
  opacity: $opacity-40;
  text-transform: uppercase;
  text-decoration: underline;
}

.service-title {
  font-size: $text-2xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $primary-indigo;
  text-decoration: underline;
  margin: 0;
}

@media (max-width: $breakpoint-lg) {
  .services-cards-section {
    height: auto;
    padding: 4rem 2rem;
  }
  
  .services-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    position: static;
    width: 100%;
    height: auto;
  }
  
  .service-card {
    position: static;
    width: 100%;
    height: 300px;
  }
  
  .service-image {
    position: static;
    width: 100%;
    height: 200px;
    margin-bottom: 1rem;
  }
  
  .service-info {
    position: static;
    padding: 1rem;
  }
}

@media (max-width: $breakpoint-md) {
  .services-cards-container {
    grid-template-columns: 1fr;
  }
}
</style> 