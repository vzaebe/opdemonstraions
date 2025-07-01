<template>
  <section class="best-section">
    <div class="best-content">
      <h2 class="best-title">Лучшее, что может человек</h2>
      <p class="best-description">
        Наши мероприятия посвящены реальному производству<br />от самолетостроения до разработки и
        эксплуатации нефтяных скважин и подкреплены опытом ведущих университетов страны и
        отраслевых компаний
      </p>
      <div class="best-cards">
        <div class="best-card">
          <h3>Профориентация в университетах</h3>
          <p>Лаборатории, макеты, условия поступления в ведущие университеты страны</p>
          <button class="best-button">Больше</button>
        </div>
        <div class="best-card">
          <h3>Экскурсии на предприятия</h3>
          <p>Знакомство, лекции и стажировки в российских промышленных компаниях</p>
          <button class="best-button">Больше</button>
        </div>
      </div>
    </div>
    <div class="best-image">
      <img src="@/assets/png/TheBestOfMan.png" alt="Два инженера у самолета" />
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'BestSection'
}
</script>

<style lang="scss" scoped>
.best-section {
  display: flex;
  width: 100%;
  height: 700px;
  background-color: $primary-teal;
  color: $white;
}

.best-content {
  flex: 1;
  padding: 0 3rem 0 6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  align-items: flex-start;
}

.best-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  margin: 0;
  max-width: 900px;
}

.best-description {
  font-size: $text-xl;
  font-weight: 500;
  line-height: $leading-loose;
  max-width: 900px;
  margin: 0;
}

.best-cards {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 900px;
  margin-top: 2rem;
}

.best-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  max-width: 400px;
}

.best-card h3 {
  font-size: $text-sm;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: $leading-relaxed;
  text-transform: uppercase;
  margin: 0;
}

.best-card p {
  font-size: $text-base;
  line-height: $leading-relaxed;
  margin: 0;
  flex-grow: 1;
}

.best-button {
  width: fit-content;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.75rem;
  border: 2px solid $white;
  border-radius: $border-radius-full;
  background: transparent;
  color: $white;
  font-size: $text-base;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.best-image {
  width: 30%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@media (max-width: $breakpoint-lg) {
  .best-section {
    flex-direction: column;
    height: auto;
    padding: 4rem 2rem;
  }

  .best-content {
    order: 2;
    padding: 0;
    width: 100%;
  }

  .best-title {
    width: 100%;
    font-size: $text-3xl;
  }

  .best-description {
    width: 100%;
  }

  .best-cards {
    flex-direction: column;
    gap: 3rem;
  }

  .best-card {
    width: 100%;
    max-width: none;
  }

  .best-image {
    order: 1;
    width: 100%;
    height: 300px;
    margin-bottom: 2rem;
  }
}
</style> 