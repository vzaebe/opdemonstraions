<template>
  <div class="charity-fundraising">
    <!-- Hero Section -->
    <div class="fundraising-hero">
      <div class="fundraising-hero-background">
        <div class="fundraising-hero-pattern"></div>
      </div>
      <div class="fundraising-hero-content">
        <div class="fundraising-hero-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Вместе мы сильнее</span>
        </div>
        <h1 class="fundraising-hero-title">Целевые сборы</h1>
        <p class="fundraising-hero-subtitle">
          На этой странице мы публикуем текущие потребности проекта. 
          Каждое пожертвование приближает нас к цели и помогает делать изделия для тех, кому нужна поддержка.
        </p>
      </div>
    </div>

    <UiSection>

      <div class="goals-header">
        <h2 class="section-title">Активные сборы</h2>
        <p class="section-subtitle">Помогите нам достичь наших целей</p>
      </div>

      <div class="goals-list">
        <div v-for="(goal, index) in store.fundraisingGoals" :key="goal.id" class="goal-card" :style="{ animationDelay: `${index * 0.15}s` }">
          <div class="goal-card__image" v-if="goal.image">
            <div class="image-placeholder">
              <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
              </svg>
              <span class="placeholder-letter">{{ goal.title[0] }}</span>
            </div>
            <div class="goal-badge" :class="getBadgeClass(goal.current_amount, goal.target_amount)">
              {{ getBadgeText(goal.current_amount, goal.target_amount) }}
            </div>
          </div>
          <div class="goal-card__content">
            <div class="goal-header">
              <h2 class="goal-title">{{ goal.title }}</h2>
              <div class="goal-meta">
                <span class="goal-meta-item">
                  <svg class="meta-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Активно
                </span>
              </div>
            </div>
            <p class="goal-desc">{{ goal.description }}</p>
            
            <div class="goal-progress">
              <div class="progress-labels">
                <span class="progress-label">
                  <svg class="label-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Собрано: <strong>{{ formatMoney(goal.current_amount) }}</strong>
                </span>
                <span class="progress-label">
                  <svg class="label-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Цель: <strong>{{ formatMoney(goal.target_amount) }}</strong>
                </span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: calculateProgress(goal.current_amount, goal.target_amount) + '%' }"
                  >
                    <div class="progress-shimmer"></div>
                  </div>
                </div>
                <div class="progress-percent">
                  {{ calculateProgress(goal.current_amount, goal.target_amount) }}%
                </div>
              </div>
              <div class="progress-stats">
                <span class="stat">Осталось: <strong>{{ formatMoney(goal.target_amount - goal.current_amount) }}</strong></span>
              </div>
            </div>

            <div class="goal-actions">
              <UiButton size="lg" class="donate-button">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                </svg>
                Пожертвовать
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import { UiButton } from '@/ui'

const store = useCharityStore()

onMounted(() => {
  store.fetchFundraisingGoals()
})

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount)
}

const calculateProgress = (current: number, target: number) => {
  const percent = Math.round((current / target) * 100)
  return Math.min(percent, 100)
}

const getBadgeClass = (current: number, target: number) => {
  const progress = calculateProgress(current, target)
  if (progress >= 100) return 'badge-complete'
  if (progress >= 75) return 'badge-almost'
  if (progress >= 50) return 'badge-halfway'
  return 'badge-active'
}

const getBadgeText = (current: number, target: number) => {
  const progress = calculateProgress(current, target)
  if (progress >= 100) return '✓ Достигнуто'
  if (progress >= 75) return '🔥 Почти у цели'
  if (progress >= 50) return '⚡ На полпути'
  return '🎯 Активно'
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.charity-fundraising {
  overflow: hidden;
}

.fundraising-hero {
  position: relative;
  background: linear-gradient(135deg, #ff5a1f 0%, #fbbf24 100%);
  color: $white;
  padding: $spacing-16 $spacing-4 $spacing-20;
  text-align: center;
  overflow: hidden;
}

.fundraising-hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
}

.fundraising-hero-pattern {
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, $white 1px, transparent 1px);
  background-size: 30px 30px;
  animation: patternMove 30s linear infinite;
}

@keyframes patternMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, 30px); }
}

.fundraising-hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fundraising-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba($white, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.5rem;
  border-radius: $border-radius-full;
  margin-bottom: $spacing-6;
  font-size: $text-sm;
  font-weight: 600;
  border: 1px solid rgba($white, 0.3);
}

.badge-icon {
  width: 20px;
  height: 20px;
}

.fundraising-hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: $spacing-4;
  font-weight: 800;
}

.fundraising-hero-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto;
}

.goals-header {
  text-align: center;
  margin-bottom: $spacing-12;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: $gray-900;
  margin-bottom: $spacing-3;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #ff5a1f, #fbbf24);
    border-radius: 2px;
  }
}

.section-subtitle {
  font-size: $text-lg;
  color: $gray-600;
  margin-top: $spacing-6;
  line-height: $leading-relaxed;
}

.goals-list {
  display: grid;
  gap: $spacing-10;
  max-width: 1000px;
  margin: 0 auto;
}

.goal-card {
  background: $white;
  border-radius: $border-radius-xl;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease;
  border: 2px solid transparent;
  animation: fadeInScale 0.6s ease-out both;
  
  @media (min-width: $breakpoint-md) {
    flex-direction: row;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border-color: rgba(#ff5a1f, 0.3);
  }

  &__image {
    position: relative;
    width: 100%;
    height: 250px;
    background: linear-gradient(135deg, rgba(#ff5a1f, 0.1), rgba(#fbbf24, 0.2));
    display: flex;
    align-items: center;
    justify-content: center;
    
    @media (min-width: $breakpoint-md) {
      width: 350px;
      height: auto;
    }
    
    .image-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-4;
    }

    .placeholder-icon {
      width: 80px;
      height: 80px;
      color: $primary-orange;
    }

    .placeholder-letter {
      font-size: 3rem;
      color: $primary-orange;
      font-weight: 800;
    }
  }

  &__content {
    padding: $spacing-8;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.goal-badge {
  position: absolute;
  top: $spacing-4;
  right: $spacing-4;
  padding: 0.5rem 1rem;
  border-radius: $border-radius-full;
  font-size: $text-xs;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  &.badge-complete {
    background: linear-gradient(135deg, #0e9f6e, #0694a2);
    color: $white;
  }

  &.badge-almost {
    background: linear-gradient(135deg, #ff5a1f, #ff9068);
    color: $white;
  }

  &.badge-halfway {
    background: linear-gradient(135deg, #fbbf24, #fcd34d);
    color: $gray-900;
  }

  &.badge-active {
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
    color: $white;
  }
}

.goal-header {
  margin-bottom: $spacing-4;
}

.goal-title {
  font-size: $text-2xl;
  margin-bottom: $spacing-3;
  color: $gray-900;
  font-weight: 800;
}

.goal-meta {
  display: flex;
  gap: $spacing-3;
  flex-wrap: wrap;
}

.goal-meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: $text-xs;
  color: $gray-600;
  background: $gray-100;
  padding: 0.25rem 0.75rem;
  border-radius: $border-radius-full;
  font-weight: 600;
}

.meta-icon {
  width: 14px;
  height: 14px;
}

.goal-desc {
  color: $gray-600;
  margin-bottom: $spacing-8;
  line-height: $leading-relaxed;
  font-size: $text-base;
}

.goal-progress {
  margin-bottom: $spacing-6;
  background: $gray-50;
  padding: $spacing-6;
  border-radius: $border-radius-lg;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-4;
  gap: $spacing-4;
  flex-wrap: wrap;
}

.progress-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: $text-sm;
  color: $gray-700;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: $primary-orange;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  margin-bottom: $spacing-3;
}

.progress-bar {
  flex: 1;
  height: 16px;
  background: $gray-200;
  border-radius: $border-radius-full;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  position: relative;
  height: 100%;
  background: linear-gradient(90deg, #ff5a1f, #fbbf24);
  border-radius: $border-radius-full;
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.progress-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba($white, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.progress-percent {
  font-size: $text-sm;
  color: $primary-orange;
  font-weight: 800;
  min-width: 50px;
  text-align: right;
}

.progress-stats {
  font-size: $text-sm;
  color: $gray-600;
}

.goal-actions {
  margin-top: auto;
  display: flex;
  gap: $spacing-4;
}

.donate-button {
  flex: 1;
}

.btn-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}
</style>




