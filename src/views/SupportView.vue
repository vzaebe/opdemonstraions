<template>
  <div class="support-page">
    <!-- Hero Section -->
    <div class="support-hero">
      <div class="support-hero-background">
        <div class="support-hero-pattern"></div>
      </div>
      <div class="support-hero-content">
        <div class="support-hero-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Поддержите нашу работу</span>
        </div>
        <h1 class="support-hero-title">Страница Поддержки</h1>
        <p class="support-hero-subtitle">
          Ваша поддержка помогает нам развивать проекты, организовывать мероприятия 
          и создавать доступную среду для людей с ограниченными возможностями слуха. 
          Каждое пожертвование имеет значение и приближает нас к нашим целям.
        </p>
        <div class="support-hero-stats">
          <div class="stat-item">
            <div class="stat-value">{{ totalGoals }}</div>
            <div class="stat-label">Направлений</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatShortMoney(totalCollected) }}</div>
            <div class="stat-label">Собрано</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatShortMoney(totalTarget) }}</div>
            <div class="stat-label">Цель</div>
          </div>
        </div>
      </div>
    </div>

    <UiSection>
      <div class="goals-header">
        <h2 class="section-title">Направления поддержки</h2>
        <p class="section-subtitle">Выберите направление, которое вам близко, и помогите нам реализовать наши планы</p>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >
          Все направления
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'high' }"
          @click="activeFilter = 'high'"
        >
          🔥 Приоритетные
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'medium' }"
          @click="activeFilter = 'medium'"
        >
          ⚡ Важные
        </button>
      </div>

      <!-- Goals Grid -->
      <div class="goals-grid">
        <div 
          v-for="(goal, index) in filteredGoals" 
          :key="goal.id" 
          class="goal-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="goal-card-header">
            <div class="goal-icon">{{ goal.icon }}</div>
            <div class="goal-priority" :class="`priority-${goal.priority}`">
              {{ getPriorityLabel(goal.priority) }}
            </div>
          </div>
          
          <div class="goal-card-content">
            <h3 class="goal-title">{{ goal.title }}</h3>
            <p class="goal-description">{{ goal.description }}</p>
            
            <!-- Examples -->
            <div v-if="goal.examples && goal.examples.length" class="goal-examples">
              <div class="examples-title">
                <svg class="examples-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Примеры использования:
              </div>
              <ul class="examples-list">
                <li v-for="(example, idx) in goal.examples" :key="idx">{{ example }}</li>
              </ul>
            </div>

            <!-- Progress -->
            <div class="goal-progress">
              <div class="progress-info">
                <span class="progress-collected">
                  <strong>{{ formatMoney(goal.current_amount) }}</strong>
                </span>
                <span class="progress-target">
                  из {{ formatMoney(goal.target_amount) }}
                </span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: calculateProgress(goal.current_amount, goal.target_amount) + '%' }"
                >
                  <div class="progress-shimmer"></div>
                </div>
              </div>
              <div class="progress-percent-label">
                {{ calculateProgress(goal.current_amount, goal.target_amount) }}% собрано
              </div>
            </div>
          </div>

          <div class="goal-card-footer">
            <ButtonPrimary size="md" class="donate-btn">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor"/>
              </svg>
              Поддержать
            </ButtonPrimary>
            <span class="remaining-amount">
              Осталось: {{ formatMoney(goal.target_amount - goal.current_amount) }}
            </span>
          </div>
        </div>
      </div>

      <!-- General Support Section -->
      <div class="general-support">
        <div class="general-support-content">
          <h2 class="general-support-title">
            <svg class="title-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Общая поддержка проекта
          </h2>
          <p class="general-support-text">
            Если вы хотите поддержать работу организации в целом, 
            вы можете сделать свободное пожертвование на развитие всех наших направлений. 
            Мы направим средства туда, где они наиболее необходимы.
          </p>
          <ButtonPrimary size="lg" class="general-donate-btn">
            Сделать пожертвование
          </ButtonPrimary>
        </div>
      </div>

      <!-- Info Block -->
      <div class="support-info">
        <div class="info-card">
          <div class="info-icon">🔒</div>
          <h3 class="info-title">Безопасные платежи</h3>
          <p class="info-text">Все платежи проходят через защищенные каналы</p>
        </div>
        <div class="info-card">
          <div class="info-icon">📊</div>
          <h3 class="info-title">Прозрачность</h3>
          <p class="info-text">Мы публикуем отчеты о использовании средств</p>
        </div>
        <div class="info-card">
          <div class="info-icon">🤝</div>
          <h3 class="info-title">Благодарность</h3>
          <p class="info-text">Каждый жертвователь получает благодарственное письмо</p>
        </div>
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupportStore } from '@/stores/support'
import UiSection from '@/components/ui/Section.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const store = useSupportStore()
const activeFilter = ref<'all' | 'high' | 'medium' | 'low'>('all')

onMounted(() => {
  store.fetchSupportGoals()
})

const filteredGoals = computed(() => {
  if (activeFilter.value === 'all') {
    return store.supportGoals
  }
  return store.supportGoals.filter(goal => goal.priority === activeFilter.value)
})

const totalGoals = computed(() => store.supportGoals.length)

const totalCollected = computed(() => {
  return store.supportGoals.reduce((sum, goal) => sum + goal.current_amount, 0)
})

const totalTarget = computed(() => {
  return store.supportGoals.reduce((sum, goal) => sum + goal.target_amount, 0)
})

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'RUB', 
    maximumFractionDigits: 0 
  }).format(amount)
}

const formatShortMoney = (amount: number) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M ₽'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'K ₽'
  }
  return formatMoney(amount)
}

const calculateProgress = (current: number, target: number) => {
  const percent = Math.round((current / target) * 100)
  return Math.min(percent, 100)
}

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    high: 'Высокий приоритет',
    medium: 'Средний приоритет',
    low: 'Низкий приоритет'
  }
  return labels[priority] || priority
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.support-page {
  overflow: hidden;
}

.support-hero {
  position: relative;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
  color: $white;
  padding: $spacing-16 $spacing-4 $spacing-24;
  text-align: center;
  overflow: hidden;
}

.support-hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.support-hero-pattern {
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

.support-hero-content {
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

.support-hero-badge {
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

.support-hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: $spacing-4;
  font-weight: 800;
}

.support-hero-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto $spacing-10;
}

.support-hero-stats {
  display: flex;
  justify-content: center;
  gap: $spacing-8;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: $text-sm;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.goals-header {
  text-align: center;
  margin-bottom: $spacing-10;
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
    background: linear-gradient(90deg, #6366f1, #d946ef);
    border-radius: 2px;
  }
}

.section-subtitle {
  font-size: $text-lg;
  color: $gray-600;
  margin-top: $spacing-6;
  line-height: $leading-relaxed;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: $spacing-3;
  flex-wrap: wrap;
  margin-bottom: $spacing-12;
}

.filter-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid $gray-200;
  background: $white;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  font-weight: 600;
  color: $gray-700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8b5cf6;
    color: #8b5cf6;
  }

  &.active {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: $white;
    border-color: transparent;
  }
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-8;
  margin-bottom: $spacing-16;
}

.goal-card {
  background: $white;
  border-radius: $border-radius-xl;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease;
  border: 2px solid transparent;
  animation: fadeInScale 0.6s ease-out both;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.2);
    border-color: rgba(#6366f1, 0.3);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.goal-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-6 $spacing-6 $spacing-4;
}

.goal-icon {
  font-size: 3rem;
}

.goal-priority {
  padding: 0.375rem 0.875rem;
  border-radius: $border-radius-full;
  font-size: $text-xs;
  font-weight: 700;

  &.priority-high {
    background: linear-gradient(135deg, #ef4444, #f87171);
    color: $white;
  }

  &.priority-medium {
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    color: $white;
  }

  &.priority-low {
    background: $gray-100;
    color: $gray-700;
  }
}

.goal-card-content {
  padding: 0 $spacing-6 $spacing-6;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.goal-title {
  font-size: $text-xl;
  font-weight: 800;
  color: $gray-900;
  margin: 0;
}

.goal-description {
  font-size: $text-sm;
  color: $gray-600;
  line-height: $leading-relaxed;
  margin: 0;
}

.goal-examples {
  background: $gray-50;
  padding: $spacing-4;
  border-radius: $border-radius-lg;
  border-left: 3px solid #6366f1;
}

.examples-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: $text-sm;
  font-weight: 700;
  color: $gray-800;
  margin-bottom: $spacing-2;
}

.examples-icon {
  width: 18px;
  height: 18px;
  color: #6366f1;
}

.examples-list {
  margin: 0;
  padding-left: $spacing-5;
  font-size: $text-sm;
  color: $gray-600;
  line-height: $leading-relaxed;

  li {
    margin-bottom: 0.25rem;
  }
}

.goal-progress {
  margin-top: auto;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: $spacing-2;
  font-size: $text-sm;
}

.progress-collected {
  color: $gray-900;
  font-weight: 600;
}

.progress-target {
  color: $gray-500;
}

.progress-bar {
  height: 10px;
  background: $gray-200;
  border-radius: $border-radius-full;
  overflow: hidden;
  margin-bottom: $spacing-2;
}

.progress-fill {
  position: relative;
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: $border-radius-full;
  transition: width 1s ease;
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

.progress-percent-label {
  font-size: $text-xs;
  color: $gray-500;
  text-align: right;
}

.goal-card-footer {
  padding: $spacing-6;
  border-top: 1px solid $gray-100;
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
}

.donate-btn {
  width: 100%;
}

.btn-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
}

.remaining-amount {
  text-align: center;
  font-size: $text-sm;
  color: $gray-600;
  font-weight: 600;
}

.general-support {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: $white;
  padding: $spacing-12 $spacing-8;
  border-radius: $border-radius-2xl;
  text-align: center;
  margin-bottom: $spacing-16;
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3);
}

.general-support-content {
  max-width: 600px;
  margin: 0 auto;
}

.general-support-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-3;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  margin-bottom: $spacing-4;
}

.title-icon {
  width: 32px;
  height: 32px;
}

.general-support-text {
  font-size: $text-base;
  line-height: $leading-relaxed;
  opacity: 0.95;
  margin-bottom: $spacing-8;
}

.general-donate-btn {
  background: $white;
  color: #6366f1;
  
  &:hover {
    background: $gray-100;
  }
}

.support-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-6;
}

.info-card {
  text-align: center;
  padding: $spacing-8 $spacing-4;
  border-radius: $border-radius-lg;
  background: $gray-50;
  transition: all 0.3s ease;

  &:hover {
    background: $white;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }
}

.info-icon {
  font-size: 3rem;
  margin-bottom: $spacing-4;
}

.info-title {
  font-size: $text-lg;
  font-weight: 700;
  color: $gray-900;
  margin-bottom: $spacing-2;
}

.info-text {
  font-size: $text-sm;
  color: $gray-600;
  line-height: $leading-relaxed;
}

@media (max-width: 768px) {
  .goals-grid {
    grid-template-columns: 1fr;
  }
}
</style>

