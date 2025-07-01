<template>
  <section class="services-cards-section">
    <div class="services-cards-container">
      <div class="service-card">
        <div class="service-info">
          <span class="service-category">Для компаний</span>
          <h3 class="service-title">Мастер-классы</h3>
        </div>
        <img class="service-image" src="@/assets/png/SpecialCards/Product image-3.png" alt="Мастер-классы" />
      </div>
      <div class="service-card active">
        <div class="service-info">
          <span class="service-category">Для разработчиков</span>
          <h3 class="service-title">Проект Адаптатион</h3>
        </div>
        <img class="service-image" src="@/assets/png/SpecialCards/Product image-2.png" alt="Проект Адаптация" />
      </div>
      <div class="service-card">
        <div class="service-info">
          <span class="service-category">для глухих инженеров</span>
          <h3 class="service-title">База знаний</h3>
        </div>
        <img class="service-image" src="@/assets/png/SpecialCards/Product image-1.png" alt="База знаний" />
      </div>
      <div class="service-card">
        <div class="service-info">
          <span class="service-category">Для трудоустройства</span>
          <h3 class="service-title">Список вакансий</h3>
        </div>
        <img class="service-image" src="@/assets/png/SpecialCards/Product image.png" alt="Список вакансий" />
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
  background-color: $white;
  padding: 40px 0;
}

.services-cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: $white;
  border: 2px solid $gray-200;
  border-radius: $border-radius-2xl;
  padding: 40px 32px;
  min-height: 260px;
  transition: box-shadow 0.2s, border-color 0.2s;
  box-sizing: border-box;

  &.active {
    border-color: $primary-mint;
  }

  &:hover {
    box-shadow: $shadow-md;
  }
}

.service-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1 1 0;
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
  margin-bottom: 8px;
}

.service-title {
  font-size: $text-2xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $primary-teal;
  text-decoration: underline;
  margin: 0;
}

.service-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: $border-radius-lg;
  margin-left: 32px;
  flex-shrink: 0;
  background: #f8f8f8;
}

@media (max-width: $breakpoint-lg) {
  .services-cards-container {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    gap: 24px;
  }
  .service-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 16px;
    min-height: 200px;
  }
  .service-image {
    width: 100%;
    height: 160px;
    margin-left: 0;
    margin-top: 16px;
  }
}
</style> 