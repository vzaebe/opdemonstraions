<template>
  <section class="advantages-section">
    <h2 class="advantages-title">Наши преимущества</h2>
    <div class="advantages-grid">
      <div class="advantage">
        <span class="advantage-icon">🏭</span>
        <h3>Реальное производство</h3>
        <p>Нашими партнерами являются производственные компании, производящие реальную продукцию</p>
      </div>
      <div class="advantage">
        <span class="advantage-icon">🔓</span>
        <h3>Открытость решений</h3>
        <p>Все наши решения, материалы, разработки вы можете получить напрямую</p>
      </div>
      <div class="advantage">
        <span class="advantage-icon">📚</span>
        <h3>Доступность информации</h3>
        <p>Все наши материалы переведены на жестовый язык и доступны на сайте</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AdvantagesSection'
}
</script>

<style lang="scss" scoped>
.advantages-section {
  width: 100%;
  height: 580px;
  background-color: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 6rem 14rem;
  gap: 3.5rem;
}

.advantages-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  text-align: center;
  color: $primary-indigo;
  margin: 0;
}

.advantages-grid {
  display: inline-flex;
  gap: 5rem;
  align-items: flex-start;
  justify-content: flex-start;
  width: 964px;
  height: 279px;
}

.advantage {
  display: inline-flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  justify-content: flex-start;
  width: 16rem;
  height: 100%;
}

.advantage-icon {
  font-size: $text-6xl;
  line-height: $leading-10;
  text-align: center;
  color: $primary-yellow;
}

.advantage h3 {
  font-size: $text-xl;
  font-weight: 500;
  line-height: $leading-loose;
  text-align: center;
  color: $primary-indigo;
  margin: 0;
}

.advantage p {
  font-size: $text-base;
  line-height: $leading-relaxed;
  text-align: center;
  color: $gray-900;
  opacity: $opacity-40;
  margin: 0;
}

@media (max-width: $breakpoint-lg) {
  .advantages-section {
    height: auto;
    padding: 4rem 2rem;
  }
  
  .advantages-grid {
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 2rem;
  }
  
  .advantage {
    width: 100%;
    height: auto;
  }
}
</style> 