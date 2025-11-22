<template>
  <div class="partner-card">
    <div class="partner-card__header">
      <div class="partner-card__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="partner-card__name">{{ name }}</h3>
    </div>
    <div class="partner-card__body">
      <div class="partner-card__info">
        <span class="partner-card__label">Тип:</span>
        <span class="partner-card__value">{{ type === 'company' ? 'Компания' : 'Частное лицо' }}</span>
      </div>
      <div class="partner-card__info">
        <span class="partner-card__label">Город:</span>
        <span class="partner-card__value">{{ city }}</span>
      </div>
      <div class="partner-card__info">
        <span class="partner-card__label">Принтер:</span>
        <span class="partner-card__value">{{ printerModel }}</span>
      </div>
      <div class="partner-card__materials">
        <span v-for="mat in capabilities" :key="mat" class="partner-card__tag">{{ mat }}</span>
      </div>
    </div>
    <div class="partner-card__footer">
      <span class="partner-card__stat">
        <strong>{{ completedWorks }}</strong> работ выполнено
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  type: string
  printerModel: string
  capabilities: string[]
  completedWorks: number
  city: string
}>()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.partner-card {
  background: $white;
  border: 1px solid $gray-200;
  border-radius: $border-radius-lg;
  padding: $spacing-5;
  transition: all $transition-normal;

  &:hover {
    border-color: $primary-teal;
    box-shadow: $shadow-md;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-3;
    margin-bottom: $spacing-4;
  }

  &__icon {
    width: 40px;
    height: 40px;
    background: rgba($primary-teal, 0.1);
    color: $primary-teal;
    border-radius: $border-radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__name {
    font-size: $text-lg;
    font-weight: 600;
    color: $gray-900;
    margin: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $spacing-2;
    margin-bottom: $spacing-4;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    font-size: $text-sm;
  }

  &__label {
    color: $gray-500;
  }

  &__value {
    color: $gray-800;
    font-weight: 500;
  }

  &__materials {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-2;
    margin-top: $spacing-2;
  }

  &__tag {
    background: $gray-100;
    color: $gray-600;
    padding: 0.25rem 0.5rem;
    border-radius: $border-radius-sm;
    font-size: $text-xs;
  }

  &__footer {
    border-top: 1px solid $gray-100;
    padding-top: $spacing-3;
    text-align: center;
  }

  &__stat {
    color: $primary-teal;
    font-size: $text-sm;
    
    strong {
      font-size: $text-lg;
    }
  }
}
</style>




