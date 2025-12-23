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
        <h2 class="section-title">На что пойдут пожертвования</h2>
        <p class="section-subtitle">Конкретные статьи расходов, которые поддерживают нашу работу</p>
      </div>

      <!-- Goals Grid -->
      <div class="goals-grid">
        <div 
          v-for="(goal, index) in goals" 
          :key="goal.id" 
          class="goal-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="goal-card-header">
            <div class="goal-icon">
              <Icon :name="goalIconName(goal.icon)" :size="34" :title="goal.title" />
            </div>
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
            <ButtonPrimary size="md" class="donate-btn" @click="openDonateModal(goal)">
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
          <ButtonPrimary size="lg" class="general-donate-btn" @click="openDonateModal()">
            Сделать пожертвование
          </ButtonPrimary>
        </div>
      </div>

      <div class="support-notes">
        <h3 class="support-notes-title">Как поддержать и как мы отчитываемся</h3>
        <ul class="support-notes-list">
          <li>Нажмите «Поддержать» — откроется окно с реквизитами и вариантами перевода.</li>
          <li>Отчётность публикуем в Telegram-канале; при необходимости дадим детализацию по направлениям.</li>
        </ul>
      </div>
    </UiSection>

    <teleport to="body">
      <div v-if="isDonateModalOpen" class="donate-modal-overlay" @click.self="closeDonateModal">
        <div class="donate-modal" role="dialog" aria-modal="true">
          <button class="donate-modal-close" type="button" @click="closeDonateModal" aria-label="Закрыть">
            ✕
          </button>

          <div class="donate-modal-header">
            <h2 class="donate-modal-title">Поддержать</h2>
            <p class="donate-modal-subtitle" v-if="selectedGoal">
              Направление: <strong>{{ selectedGoal.title }}</strong>
            </p>
            <p class="donate-modal-subtitle" v-else>Общая поддержка организации</p>
          </div>

          <div class="donate-modal-content">
            <div class="donate-block">
              <h3 class="donate-block-title">Реквизиты организации</h3>
              <div class="requisites-grid">
                <div class="req-row">
                  <span class="req-label">Организация</span>
                  <span class="req-value">{{ requisites.orgName }}</span>
                </div>
                <div class="req-row">
                  <span class="req-label">ОГРН</span>
                  <span class="req-value">{{ requisites.ogrn }}</span>
                </div>
                <div class="req-row">
                  <span class="req-label">ИНН / КПП</span>
                  <span class="req-value">{{ requisites.innKpp }}</span>
                </div>
                <div class="req-row">
                  <span class="req-label">Юр. адрес</span>
                  <span class="req-value">{{ requisites.legalAddress }}</span>
                </div>
              </div>

              <div class="donate-actions">
                <button class="copy-btn" type="button" @click="copyRequisites">Скопировать</button>
                <span v-if="copyState" class="copy-state">{{ copyState }}</span>
              </div>
            </div>

            <div class="donate-block">
              <h3 class="donate-block-title">СБП / QR</h3>
              <p class="donate-hint">
                Если вам удобнее СБП/QR — напишите нам в
                <a :href="telegramUrl" target="_blank" rel="noopener noreferrer">Telegram</a>,
                пришлём актуальные варианты.
              </p>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupportStore } from '@/stores/support'
import UiSection from '@/components/ui/Section.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import Icon from '@/components/ui/Icon.vue'
import { iconNameFromEmoji } from '@/utils/icon'
import { CONTACT } from '@/config/constants'

const store = useSupportStore()

onMounted(() => {
  store.fetchSupportGoals()
})

const goals = computed(() => store.supportGoals)

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

const goalIconName = (icon?: string) => iconNameFromEmoji(icon) ?? 'target'

type SupportGoal = {
  id: number
  title: string
  description: string
  target_amount: number
  current_amount: number
  category: string
  priority: 'high' | 'medium' | 'low'
  icon?: string
  examples?: string[]
}

const isDonateModalOpen = ref(false)
const selectedGoal = ref<SupportGoal | null>(null)
const copyState = ref<string | null>(null)
const telegramUrl = CONTACT.TELEGRAM_URL

const requisites = {
  orgName:
    'Автономная некоммерческая организация содействия профориентации и интеграции в реальный сектор экономики молодежи из незащищенных слоев населения «Открытые Перспективы» (АНО «Открытые Перспективы»)',
  ogrn: '1257700115551',
  innKpp: '9726095312 / 772601001',
  legalAddress: '117105, г. Москва, вн.тер.г. муниципальный округ Донской, ш Варшавское, д. 33'
} as const

function openDonateModal(goal?: SupportGoal) {
  selectedGoal.value = goal ?? null
  isDonateModalOpen.value = true
  copyState.value = null
}

function closeDonateModal() {
  isDonateModalOpen.value = false
}

async function copyRequisites() {
  const text =
    `Организация: ${requisites.orgName}\n` +
    `ОГРН: ${requisites.ogrn}\n` +
    `ИНН/КПП: ${requisites.innKpp}\n` +
    `Юр. адрес: ${requisites.legalAddress}`

  try {
    await navigator.clipboard.writeText(text)
    copyState.value = 'Скопировано'
    window.setTimeout(() => (copyState.value = null), 2500)
  } catch {
    copyState.value = 'Не удалось скопировать'
    window.setTimeout(() => (copyState.value = null), 2500)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.support-page {
  overflow: hidden;
}

.support-hero {
  position: relative;
  background: linear-gradient(135deg, $primary-teal 0%, $primary-mint 55%, $primary-orange 120%);
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
    background: linear-gradient(90deg, $primary-teal, $primary-orange);
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
    box-shadow: 0 12px 40px rgba($primary-teal, 0.18);
    border-color: rgba($primary-teal, 0.25);
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
  color: $primary-teal;
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  border-left: 3px solid $primary-teal;
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
  color: $primary-teal;
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
  background: linear-gradient(90deg, $primary-teal, $primary-mint);
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
  background: linear-gradient(135deg, $primary-teal 0%, $primary-mint 100%);
  color: $white;
  padding: $spacing-12 $spacing-8;
  border-radius: $border-radius-2xl;
  text-align: center;
  margin-bottom: $spacing-16;
  box-shadow: 0 20px 60px rgba($primary-teal, 0.25);
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
  color: $primary-teal;
  
  &:hover {
    background: $gray-100;
  }
}

// Support notes (instead of generic promises)
.support-notes {
  max-width: 900px;
  margin: 0 auto;
  padding: $spacing-8;
  border-radius: $border-radius-2xl;
  background: $gray-50;
  border: 1px solid $gray-200;
}

.support-notes-title {
  margin: 0 0 $spacing-3 0;
  font-size: $text-xl;
  font-weight: 800;
  color: $gray-900;
}

.support-notes-list {
  margin: 0;
  padding-left: 1.1rem;
  color: $gray-700;
  line-height: $leading-relaxed;
}

// Donate modal
.donate-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-6;
  z-index: 9999;
}

.donate-modal {
  width: 100%;
  max-width: 760px;
  background: $white;
  border-radius: $border-radius-2xl;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  position: relative;
  overflow: hidden;
}

.donate-modal-close {
  position: absolute;
  top: $spacing-4;
  right: $spacing-4;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid $gray-200;
  background: $white;
  color: $gray-700;
  cursor: pointer;
}

.donate-modal-header {
  padding: $spacing-10 $spacing-10 $spacing-6;
  background: linear-gradient(135deg, rgba($primary-teal, 0.08), rgba($primary-orange, 0.08));
  border-bottom: 1px solid $gray-100;
}

.donate-modal-title {
  margin: 0 0 $spacing-2 0;
  font-size: $text-3xl;
  font-weight: 900;
  color: $gray-900;
}

.donate-modal-subtitle {
  margin: 0;
  color: $gray-700;
}

.donate-modal-content {
  padding: $spacing-8 $spacing-10 $spacing-10;
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-8;
}

.donate-block-title {
  margin: 0 0 $spacing-4 0;
  font-size: $text-lg;
  font-weight: 800;
  color: $gray-900;
}

.requisites-grid {
  display: grid;
  gap: $spacing-3;
}

.req-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: $spacing-4;
  align-items: start;
}

.req-label {
  color: $gray-600;
  font-size: $text-sm;
  font-weight: 700;
}

.req-value {
  color: $gray-900;
  font-size: $text-sm;
  line-height: $leading-relaxed;
}

.donate-actions {
  margin-top: $spacing-5;
  display: flex;
  gap: $spacing-4;
  align-items: center;
  flex-wrap: wrap;
}

.copy-btn {
  border: 1px solid $gray-200;
  background: $white;
  padding: 0.75rem 1rem;
  border-radius: $border-radius-lg;
  cursor: pointer;
  font-weight: 700;
  color: $gray-800;
}

.copy-state {
  color: $gray-600;
  font-size: $text-sm;
}

.donate-hint {
  margin: 0;
  color: $gray-700;
  line-height: $leading-relaxed;
}

.donate-hint a {
  color: $primary-teal;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .goals-grid {
    grid-template-columns: 1fr;
  }

  .donate-modal-header {
    padding: $spacing-8 $spacing-6 $spacing-5;
  }

  .donate-modal-content {
    padding: $spacing-6 $spacing-6 $spacing-8;
  }

  .req-row {
    grid-template-columns: 1fr;
    gap: $spacing-2;
  }
}
</style>




