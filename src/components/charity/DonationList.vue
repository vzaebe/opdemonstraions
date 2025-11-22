<template>
  <div class="donation-list">
    <div class="donation-column">
      <h3 class="donation-title">Финансовая помощь</h3>
      <ul class="donation-items">
        <li v-for="d in financial" :key="d.id" class="donation-item">
          <div class="donation-item__content">
            <span class="donation-item__name">{{ d.name }}</span>
            <span class="donation-item__date">{{ formatDate(d.date) }}</span>
          </div>
          <span class="donation-item__amount">{{ formatMoney(d.amount || 0) }}</span>
        </li>
      </ul>
    </div>
    <div class="donation-column">
      <h3 class="donation-title">Материалы и оборудование</h3>
      <ul class="donation-items">
        <li v-for="d in material" :key="d.id" class="donation-item">
          <div class="donation-item__content">
            <span class="donation-item__name">{{ d.name }}</span>
            <span class="donation-item__date">{{ formatDate(d.date) }}</span>
          </div>
          <span class="donation-item__item">{{ d.item }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  financial: Array<{ id: number, name: string, amount?: number, date: string }>
  material: Array<{ id: number, name: string, item?: string, date: string }>
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU')
}

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.donation-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-8;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: 1fr 1fr;
  }
}

.donation-column {
  background: $white;
  padding: $spacing-6;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
}

.donation-title {
  font-size: $text-xl;
  color: $primary-teal;
  margin-bottom: $spacing-6;
  padding-bottom: $spacing-4;
  border-bottom: 2px solid rgba($primary-teal, 0.1);
}

.donation-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.donation-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: $spacing-3;
  border-bottom: 1px solid $gray-100;

  &:last-child {
    border-bottom: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-weight: 600;
    color: $gray-800;
  }

  &__date {
    font-size: $text-xs;
    color: $gray-400;
    margin-top: 0.25rem;
  }

  &__amount {
    font-weight: 700;
    color: $primary-orange;
  }

  &__item {
    font-weight: 500;
    color: $primary-mint;
    text-align: right;
    max-width: 50%;
  }
}
</style>




