<template>
  <section class="best-section">
    <div class="best-content">
      <h2 class="best-title">Лучшее, что может человек</h2>
      <p class="best-description">
        Наши мероприятия посвящены реальному производству<br/>от самолетостроения до разработки и эксплуатации нефтяных скважин и подкреплены опытом ведущих университетов страны и отраслевых компаний
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
      <img src="@/assets/images/placeholder.svg" alt="Изображение" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'BestSection'
}
</script>

<style lang="scss" scoped>
.best-section {
  position: relative;
  width: 100%;
  height: 700px;
  background-color: $primary-green;
}

.best-content {
  position: absolute;
  left: 115px;
  top: 100px;
  width: 715px;
  height: 208px;
  display: inline-flex;
  flex-direction: column;
  gap: 1.75rem;
  align-items: flex-start;
  justify-content: flex-end;
}

.best-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $white;
  width: 715px;
  margin: 0;
}

.best-description {
  font-size: $text-xl;
  font-weight: 500;
  line-height: $leading-loose;
  color: $white;
  width: 675px;
  margin: 0;
}

.best-cards {
  position: absolute;
  left: 115px;
  top: 406px;
  display: flex;
  gap: 2rem;
}

.best-card {
  display: inline-flex;
  flex-direction: column;
  gap: 2.25rem;
  align-items: center;
  justify-content: flex-start;
  width: 24rem;
  height: 12rem;
  color: $white;
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
}

.best-button {
  width: 33.333333%;
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
  position: absolute;
  right: 0;
  top: 0;
  width: 385px;
  height: 700px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@media (max-width: $breakpoint-lg) {
  .best-section {
    height: auto;
    padding: 4rem 2rem;
  }
  
  .best-content {
    position: static;
    width: 100%;
    height: auto;
    margin-bottom: 3rem;
  }
  
  .best-title {
    width: 100%;
    font-size: $text-3xl;
  }
  
  .best-description {
    width: 100%;
  }
  
  .best-cards {
    position: static;
    flex-direction: column;
    gap: 2rem;
  }
  
  .best-card {
    width: 100%;
    height: auto;
  }
  
  .best-image {
    position: static;
    width: 100%;
    height: 300px;
    margin-top: 2rem;
  }
}
</style> 