<template>
  <div class="charity-fundraising">
    <UiSection>
      <h1 class="page-title">Целевые сборы</h1>
      <p class="page-subtitle">
        На этой странице мы публикуем текущие потребности проекта. 
        Вы можете помочь нам достичь этих целей, сделав пожертвование.
      </p>

      <div class="goals-list">
        <div v-for="goal in store.fundraisingGoals" :key="goal.id" class="goal-card">
          <div class="goal-card__image" v-if="goal.image">
            <!-- Placeholder for image -->
            <div class="image-placeholder">{{ goal.title[0] }}</div>
          </div>
          <div class="goal-card__content">
            <h2 class="goal-title">{{ goal.title }}</h2>
            <p class="goal-desc">{{ goal.description }}</p>
            
            <div class="goal-progress">
              <div class="progress-labels">
                <span>Собрано: <strong>{{ formatMoney(goal.current_amount) }}</strong></span>
                <span>Цель: <strong>{{ formatMoney(goal.target_amount) }}</strong></span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: calculateProgress(goal.current_amount, goal.target_amount) + '%' }"
                ></div>
              </div>
              <div class="progress-percent">
                {{ calculateProgress(goal.current_amount, goal.target_amount) }}%
              </div>
            </div>

            <div class="goal-actions">
              <ButtonPrimary size="md">Пожертвовать</ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const store = useCharityStore()

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount)
}

const calculateProgress = (current: number, target: number) => {
  const percent = Math.round((current / target) * 100)
  return Math.min(percent, 100)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.page-title {
  font-size: $text-3xl;
  text-align: center;
  margin-bottom: $spacing-4;
}

.page-subtitle {
  text-align: center;
  color: $gray-600;
  max-width: 600px;
  margin: 0 auto $spacing-10;
}

.goals-list {
  display: grid;
  gap: $spacing-8;
  max-width: 800px;
  margin: 0 auto;
}

.goal-card {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (min-width: $breakpoint-md) {
    flex-direction: row;
  }

  &__image {
    width: 100%;
    height: 200px;
    background: $gray-200;
    display: flex;
    align-items: center;
    justify-content: center;
    
    @media (min-width: $breakpoint-md) {
      width: 300px;
      height: auto;
    }
    
    .image-placeholder {
      font-size: $text-4xl;
      color: $gray-400;
      font-weight: 700;
    }
  }

  &__content {
    padding: $spacing-6;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
}

.goal-title {
  font-size: $text-xl;
  margin-bottom: $spacing-2;
  color: $gray-900;
}

.goal-desc {
  color: $gray-600;
  margin-bottom: $spacing-6;
  line-height: $leading-relaxed;
}

.goal-progress {
  margin-bottom: $spacing-6;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-2;
  font-size: $text-sm;
  color: $gray-700;
}

.progress-bar {
  height: 10px;
  background: $gray-100;
  border-radius: $border-radius-full;
  overflow: hidden;
  margin-bottom: $spacing-1;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary-teal, $primary-mint);
  border-radius: $border-radius-full;
  transition: width 1s ease-in-out;
}

.progress-percent {
  text-align: right;
  font-size: $text-xs;
  color: $gray-500;
  font-weight: 600;
}

.goal-actions {
  margin-top: auto;
  text-align: right;
}
</style>




