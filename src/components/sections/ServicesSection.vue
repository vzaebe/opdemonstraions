<template>
  <section class="services-section">
    <h2 class="services-title">Что мы делаем?</h2>
    <div class="services-table">
      <div class="table-header">
        <span>Мероприятия</span>
        <span>Целевая аудитория</span>
      </div>
      <div class="table-row">
        <span>Профориентация</span>
        <span>Приглашаем в университеты, на предприятия, приезжаем с мастер-классами</span>
        <span>Глухие, сироты</span>
      </div>
      <div class="table-row">
        <span>Трудоустройство</span>
        <span>Содействуем в поиске работы и адаптации в производство</span>
        <span>Глухие, сироты</span>
      </div>
      <div class="table-row">
        <span>Рекомендации</span>
        <span>Проводим тренинги для комфортной работы в коллективе</span>
        <span>Предприятия</span>
      </div>
      <div class="table-row">
        <span>Разработка ПО</span>
        <span>Разрабатываем решения для обеспечения информационной доступности</span>
        <span>Предприятия</span>
      </div>
      <div class="table-row">
        <span>Консультации</span>
        <span>Содействуем в вопросах, связанных с интеграцией в рабочие процессы</span>
        <span>Кадровые службы</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ServicesSection'
}
</script>

<style lang="scss" scoped>
.services-section {
  width: 100%;
  height: 650px;
  background-color: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 5rem 13rem;
  gap: 2.5rem;
}

.services-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  text-align: center;
  color: $primary-indigo;
  margin: 0;
}

.services-table {
  width: 970px;
  height: 390px;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.table-header {
  display: flex;
  gap: 24rem;
  align-items: center;
  justify-content: flex-end;
  width: 940px;
  height: 26px;
  
  span {
    font-size: $text-sm;
    font-weight: 700;
    letter-spacing: 0.1em;
    line-height: $leading-relaxed;
    color: $gray-900;
    opacity: $opacity-40;
    text-transform: uppercase;
  }
}

.table-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1.5rem 2rem 1.25rem 2rem;
  gap: 1rem;
  width: 970px;
  height: 70px;
  background-color: $gray-200;
  border-radius: $border-radius;
  
  &:nth-child(even) {
    background-color: transparent;
  }
  
  span {
    font-size: $text-base;
    line-height: $leading-relaxed;
    color: $primary-indigo;
    
    &:nth-child(2) {
      color: $gray-900;
      opacity: $opacity-40;
    }
  }
}

@media (max-width: $breakpoint-lg) {
  .services-section {
    height: auto;
    padding: 3rem 2rem;
  }
  
  .services-table {
    width: 100%;
    height: auto;
  }
  
  .table-header,
  .table-row {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style> 