<template>
  <section class="services-section">
    <h2 class="services-title animate-title">Что мы делаем?</h2>
    <div class="services-table">
      <div class="table-header">
        <div class="header-cell service-name">Мероприятия</div>
        <div class="header-cell description"></div>
        <div class="header-cell audience">Целевая аудитория</div>
      </div>
      <div class="table-row animate-row" style="animation-delay: 0.1s">
        <div class="cell service-name">Профориентация</div>
        <div class="cell description">Приглашаем в университеты, на предприятия, приезжаем с мастер-классами</div>
        <div class="cell audience">Глухие, сироты</div>
      </div>
      <div class="table-row animate-row" style="animation-delay: 0.2s">
        <div class="cell service-name">Трудоустройство</div>
        <div class="cell description">Содействуем в поиске работы и адаптации в производство</div>
        <div class="cell audience">Глухие, сироты</div>
      </div>
      <div class="table-row animate-row" style="animation-delay: 0.3s">
        <div class="cell service-name">Рекомендации</div>
        <div class="cell description">Проводим тренинги для комфортной работы в коллективе</div>
        <div class="cell audience">Предприятия</div>
      </div>
      <div class="table-row animate-row" style="animation-delay: 0.4s">
        <div class="cell service-name">Разработка ПО</div>
        <div class="cell description">Разрабатываем решения для обеспечения информационной доступности</div>
        <div class="cell audience">Предприятия</div>
      </div>
      <div class="table-row animate-row" style="animation-delay: 0.5s">
        <div class="cell service-name">Консультации</div>
        <div class="cell description">Содействуем в вопросах, связанных с интеграцией в рабочие процессы</div>
        <div class="cell audience">Кадровые службы</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'ServicesSection'
}
</script>

<style lang="scss" scoped>
.services-section {
  width: 100%;
  min-height: 650px;
  background-color: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  gap: 3rem;
}

.services-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  text-align: center;
  color: $primary-teal;
  margin: 0;
}

.animate-title {
  animation: fadeInDown 0.8s ease-out;
}

.services-table {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.04);
  background: transparent;
}

.table-header {
  display: grid;
  grid-template-columns: 1.2fr 2.5fr 1.2fr;
  background: transparent;
  color: $gray-400;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 15px;
  padding: 0 32px;
  margin-bottom: 8px;
  user-select: none;
}

.header-cell {
  padding: 24px 0 12px 0;
  text-align: left;
  &:last-child {
    text-align: right;
  }
}

.table-row {
  display: grid;
  grid-template-columns: 1.2fr 2.5fr 1.2fr;
  align-items: center;
  background: transparent;
  padding: 0 32px;
  min-height: 56px;
  border-radius: 12px;
  margin-bottom: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;

  &:nth-child(even) {
    background: #f7f6fa;
  }
  &:nth-child(odd) {
    background: transparent;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
}

.animate-row {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.cell {
  padding: 18px 0;
  font-size: 18px;
  background: none;
  border: none;
  box-shadow: none;
  transition: none;
  display: flex;
  align-items: center;
  
  &.service-name {
    color: $primary-teal;
    font-weight: 700;
    font-size: 18px;
  }
  &.description {
    color: $gray-500;
    font-weight: 400;
    font-size: 17px;
    opacity: 0.95;
  }
  &.audience {
    color: $primary-orange;
    font-weight: 700;
    font-size: 17px;
    justify-content: flex-end;
    text-align: right;
    width: 100%;
  }
}

@media (max-width: $breakpoint-lg) {
  .services-section {
    padding: 3rem 1rem;
    gap: 2rem;
  }
  .services-title {
    font-size: $text-3xl;
  }
  .services-table {
    border-radius: 12px;
  }
  .table-header, .table-row {
    grid-template-columns: 1fr;
    padding: 0 12px;
  }
  .header-cell, .cell {
    text-align: left !important;
    justify-content: flex-start !important;
    padding: 14px 0;
  }
  .cell.audience {
    text-align: left !important;
    justify-content: flex-start !important;
  }
}

@media (max-width: $breakpoint-md) {
  .services-section {
    padding: 2rem 1rem;
  }
  .services-title {
    font-size: $text-2xl;
  }
  .cell.description {
    font-size: 15px;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-title,
  .animate-row,
  .table-row {
    animation: none !important;
    transition: none !important;
  }
}
</style> 