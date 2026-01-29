<template>
  <div class="charity-main">
    <!-- Hero Block -->
    <div class="hero">
      <div class="hero-background">
        <div class="hero-shape hero-shape-1"></div>
        <div class="hero-shape hero-shape-2"></div>
        <div class="hero-shape hero-shape-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">
          <svg class="hero-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
          </svg>
          <span>Поддержка через технологии</span>
        </div>
        <h1 class="hero-title">
          Создаём <span class="gradient-text">чудеса</span> на 3D-принтере
        </h1>
        <p class="hero-subtitle">
          Мы объединяем мейкеров и 3D-печатников, чтобы поддерживать детей и молодёжь через полезные изделия.
          Печатаем игрушки, развивающие пособия и адаптивные приспособления
          для семей и организаций, которым нужна поддержка — бесплатно.
        </p>
        <div class="hero-stats-mini">
          <div class="stat-mini">
            <Icon class="stat-mini-icon" name="palette" :size="20" />
            <span class="stat-mini-text">{{ store.totalCompletedWorks }}+ работ</span>
          </div>
          <div class="stat-mini">
            <Icon class="stat-mini-icon" name="users" :size="20" />
            <span class="stat-mini-text">{{ store.totalPartners }} мейкеров</span>
          </div>
          <div class="stat-mini">
            <Icon class="stat-mini-icon" name="heart" :size="20" />
            <span class="stat-mini-text">100% бесплатно</span>
          </div>
        </div>
        <div class="hero-actions">
          <router-link :to="{ name: 'charity-request' }" class="no-decoration">
            <UiButton size="lg" class="pulse-button">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M9 11H15M12 8V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Подать заявку
            </UiButton>
          </router-link>
          <router-link :to="{ name: 'charity-help' }" class="no-decoration">
            <UiButton variant="secondary" size="lg">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
              </svg>
              Хочу помочь
            </UiButton>
          </router-link>
        </div>
        <div class="hero-scroll-hint">
          <div class="scroll-arrow"></div>
        </div>
      </div>
    </div>

    <UiSection>
      <div class="stats-grid">
        <div class="stat-card" v-for="(stat, index) in statsData" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="stat-icon" :style="{ background: stat.color }">
            <component :is="stat.icon" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-description">{{ stat.description }}</span>
          </div>
        </div>
      </div>
    </UiSection>

    <UiSection background="bg-gray-50">
      <div class="process-header">
        <h2 class="section-title">Как это работает?</h2>
        <p class="section-subtitle">Простой и понятный процесс от заявки до результата</p>
      </div>
      <div class="steps-container">
        <div class="steps-grid">
          <div class="step" v-for="(step, index) in stepsData" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-icon">
              <Icon :name="step.icon" :size="34" :title="step.title" />
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
            <div class="step-details">
              <span class="step-detail" v-for="(detail, i) in step.details" :key="i">
                {{ detail }}
              </span>
            </div>
          </div>
        </div>
        <div class="process-line"></div>
      </div>
    </UiSection>

    <UiSection>
      <div class="gallery-section">
        <div class="gallery-header">
          <h2 class="section-title">Галерея выполненных работ</h2>
          <p class="section-subtitle">Проекты, которые уже помогли людям</p>
        </div>
        <div class="gallery-preview">
          <div v-for="(work, index) in store.doneWorks.slice(0, 6)" :key="work.id" class="gallery-item" :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="gallery-image-wrapper">
              <img :src="work.image" :alt="work.title" class="gallery-img" />
              <div class="gallery-badge">Выполнено ✓</div>
            </div>
            <div class="gallery-overlay">
              <h3 class="gallery-title">{{ work.title }}</h3>
              <p class="gallery-description">{{ work.description }}</p>
              <span class="gallery-date">{{ formatDate(work.date) }}</span>
            </div>
          </div>
        </div>
        <div class="gallery-actions">
          <router-link :to="{ name: 'charity-done' }">
            <UiButton variant="ghost" size="lg">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Смотреть все работы
            </UiButton>
          </router-link>
        </div>
      </div>
    </UiSection>

    <UiSection background="bg-teal-light">
      <div class="help-cta">
        <div class="help-content">
          <div class="help-badge">
            <Icon class="help-badge-icon" name="handshake" :size="18" />
            <span>Наша миссия</span>
          </div>
          <h2 class="help-title">Кому мы помогаем?</h2>
          <p class="help-intro">Мы верим, что дети и молодёжь заслуживают заботы и возможностей для развития</p>
          <div class="help-categories">
            <div class="help-category" v-for="(category, index) in helpCategories" :key="index">
              <div class="help-category-icon">
                <Icon :name="category.icon" :size="30" :title="category.title" />
              </div>
              <div class="help-category-content">
                <h3>{{ category.title }}</h3>
                <p>{{ category.description }}</p>
              </div>
            </div>
          </div>
          <div class="help-actions">
            <router-link :to="{ name: 'charity-request' }">
              <UiButton variant="primary" size="lg">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Подать заявку
              </UiButton>
            </router-link>
            <router-link :to="{ name: 'charity-community' }">
              <UiButton variant="secondary" size="lg">Наше сообщество</UiButton>
            </router-link>
          </div>
        </div>
        <div class="help-image">
          <div class="help-visual">
            <div class="help-visual-circle circle-1"></div>
            <div class="help-visual-circle circle-2"></div>
            <div class="help-visual-circle circle-3"></div>
            <div class="help-visual-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, h } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import { UiButton } from '@/ui'
import Icon from '@/components/ui/Icon.vue'

const store = useCharityStore()

const statsData = computed(() => [
  {
    value: store.totalCompletedWorks,
    label: 'Выполненных работ',
    description: 'Напечатано и передано получателям',
    color: 'linear-gradient(135deg, #0694a2, #0e9f6e)',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', class: 'icon' }, [
      h('path', { d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  },
  {
    value: store.totalPartners,
    label: 'Активных мейкеров',
    description: 'Волонтёры со всей страны',
    color: 'linear-gradient(135deg, #ff5a1f, #ff9068)',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', class: 'icon' }, [
      h('path', { d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  },
  {
    value: '0₽',
    label: 'Стоимость для получателей',
    description: 'Полностью бесплатно',
    color: 'linear-gradient(135deg, #2EACB4, #1DE9B6)',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', class: 'icon' }, [
      h('path', { d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z', fill: 'currentColor' })
    ])
  }
])

const stepsData = [
  {
    icon: 'file',
    title: 'Заявка',
    description: 'Организация или семья оставляет заявку на сайте',
    details: ['Прикрепите 3D-модель', 'Или опишите желаемое', 'Укажите детали']
  },
  {
    icon: 'printer',
    title: 'Печать',
    description: 'Волонтёры берут заказ в работу',
    details: ['Выбор материала', 'Настройка принтера', 'Контроль качества']
  },
  {
    icon: 'truck',
    title: 'Доставка',
    description: 'Готовое изделие отправляется получателю',
    details: ['Упаковка', 'Почта России', 'Или личная передача']
  },
  {
    icon: 'party',
    title: 'Радость',
    description: 'Получатель получает нужную вещь',
    details: ['Фотоотчёт', 'Благодарность', 'Обратная связь']
  }
]

const helpCategories = [
  {
    icon: 'school',
    title: 'Организациям, работающим с детьми и молодёжью',
    description: 'Игрушки, развивающие пособия и учебные материалы'
  },
  {
    icon: 'puzzle',
    title: 'Тем, кому нужны адаптивные решения',
    description: 'Адаптивные приспособления и аксессуары для повседневных задач'
  },
  {
    icon: 'hands',
    title: 'НКО и общественным организациям',
    description: 'Сотрудничество с организациями для масштабирования проектов поддержки'
  },
  {
    icon: 'family',
    title: 'Семьям, которым нужна дополнительная поддержка',
    description: 'Помощь с изготовлением полезных изделий по запросу'
  }
]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(() => {
  store.fetchDoneWorks()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.charity-main {
  overflow: hidden;
}

.hero {
  position: relative;
  background: linear-gradient(135deg, #0694a2 0%, #0e9f6e 50%, #0694a2 100%);
  color: $white;
  padding: $spacing-20 $spacing-4 $spacing-24;
  text-align: center;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.1;
}

.hero-shape {
  position: absolute;
  border-radius: 50%;
  background: $white;
  animation: float 20s infinite ease-in-out;

  &.hero-shape-1 {
    width: 500px;
    height: 500px;
    top: -200px;
    left: -100px;
    animation-delay: 0s;
  }

  &.hero-shape-2 {
    width: 300px;
    height: 300px;
    top: 40%;
    right: -50px;
    animation-delay: 5s;
  }

  &.hero-shape-3 {
    width: 400px;
    height: 400px;
    bottom: -150px;
    left: 50%;
    animation-delay: 10s;
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  animation: fadeInUp 1s ease-out;
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

.hero-badge {
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
  animation: slideDown 1s ease-out 0.2s both;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-icon {
  width: 20px;
  height: 20px;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin-bottom: $spacing-6;
  font-weight: 800;
  line-height: 1.2;
  animation: fadeInUp 1s ease-out 0.4s both;

  @media (max-width: $breakpoint-md) {
    font-size: $text-4xl;
  }
}

.gradient-text {
  background: linear-gradient(135deg, #fff, $primary-yellow);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin-bottom: $spacing-8;
  line-height: $leading-relaxed;
  opacity: 0.95;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.hero-stats-mini {
  display: flex;
  justify-content: center;
  gap: $spacing-6;
  margin-bottom: $spacing-10;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.8s both;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba($white, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  border-radius: $border-radius-full;
  border: 1px solid rgba($white, 0.25);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba($white, 0.25);
  }
}

.stat-mini-icon {
  color: $white;
}

.stat-mini-text {
  font-weight: 600;
  font-size: $text-sm;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: $spacing-6;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 1s both;
}

.no-decoration {
  text-decoration: none;
}

.btn-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

.pulse-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  50% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
}

.hero-scroll-hint {
  position: absolute;
  bottom: $spacing-8;
  left: 50%;
  transform: translateX(-50%);
  animation: fadeIn 1s ease-out 1.5s both;
}

.scroll-arrow {
  width: 30px;
  height: 50px;
  border: 2px solid rgba($white, 0.5);
  border-radius: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: $white;
    border-radius: 50%;
    animation: scroll 2s infinite;
  }
}

@keyframes scroll {
  0% { top: 10px; opacity: 1; }
  100% { top: 30px; opacity: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-8;
  text-align: center;
  margin-top: -60px;
  position: relative;
  z-index: 2;
}

.stat-card {
  padding: $spacing-8;
  background: $white;
  border-radius: $border-radius-xl;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-4;
  animation: slideUp 0.6s ease-out both;
  border: 1px solid rgba($primary-teal, 0.1);

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: $border-radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  color: $white;

  :deep(.icon) {
    width: 35px;
    height: 35px;
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-value {
  display: block;
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: $text-lg;
  color: $gray-800;
  font-weight: 600;
}

.stat-description {
  font-size: $text-sm;
  color: $gray-500;
  font-weight: 400;
}

.section-title {
  text-align: center;
  font-size: clamp(2rem, 4vw, 3rem);
  color: $gray-900;
  margin-bottom: $spacing-4;
  font-weight: 800;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);

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
  text-align: center;
  font-size: $text-lg;
  color: $gray-600;
  margin-bottom: $spacing-12;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.process-header {
  margin-bottom: $spacing-12;
}

.steps-container {
  position: relative;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-10;
  position: relative;
}

.process-line {
  position: absolute;
  top: 60px;
  left: 15%;
  right: 15%;
  height: 3px;
  background: linear-gradient(90deg, $primary-teal, $primary-mint, $primary-orange);
  z-index: 0;

  @media (max-width: $breakpoint-md) {
    display: none;
  }
}

.step {
  text-align: center;
  padding: $spacing-8 $spacing-4;
  position: relative;
  z-index: 1;
  background: $white;
  border-radius: $border-radius-xl;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);

    .step-number {
      transform: scale(1.1) rotate(360deg);
    }

    .step-icon {
      transform: scale(1.2);
    }
  }
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, $primary-orange, $primary-yellow);
  color: $white;
  font-size: $text-2xl;
  font-weight: 800;
  border-radius: $border-radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto $spacing-4;
  box-shadow: 0 5px 15px rgba(255, 90, 31, 0.4);
  position: relative;
  z-index: 2;
  transition: all 0.4s ease;
}

.step-icon {
  display: flex;
  justify-content: center;
  color: $primary-teal;
  margin-bottom: $spacing-3;
  transition: transform 0.4s ease;
}

.step-title {
  font-size: $text-xl;
  margin-bottom: $spacing-3;
  color: $gray-900;
  font-weight: 700;
}

.step-description {
  color: $gray-600;
  line-height: $leading-relaxed;
  margin-bottom: $spacing-4;
}

.step-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.step-detail {
  font-size: $text-xs;
  color: $primary-teal;
  background: rgba($primary-teal, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: $border-radius-full;
  font-weight: 600;
}

.gallery-section {
  overflow: hidden;
}

.gallery-header {
  margin-bottom: $spacing-12;
}

.gallery-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: $spacing-8;
  margin-bottom: $spacing-12;
}

.gallery-item {
  position: relative;
  height: 350px;
  border-radius: $border-radius-xl;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInScale 0.6s ease-out both;
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  &:hover .gallery-overlay {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:hover .gallery-img {
    transform: scale(1.1);
  }

  &:hover .gallery-badge {
    transform: translateX(-10px);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.gallery-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-badge {
  position: absolute;
  top: $spacing-4;
  right: $spacing-4;
  background: linear-gradient(135deg, #0e9f6e, #0694a2);
  color: $white;
  padding: 0.5rem 1rem;
  border-radius: $border-radius-full;
  font-size: $text-xs;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transition: transform 0.3s ease;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.9) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: $spacing-6;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-title {
  color: $white;
  font-size: $text-xl;
  font-weight: 700;
  margin-bottom: $spacing-2;
}

.gallery-description {
  color: rgba($white, 0.9);
  font-size: $text-sm;
  line-height: $leading-relaxed;
  margin-bottom: $spacing-3;
}

.gallery-date {
  color: rgba($white, 0.7);
  font-size: $text-xs;
  font-weight: 500;
}

.gallery-actions {
  text-align: center;
}

.bg-teal-light {
  background: linear-gradient(135deg, rgba($primary-teal, 0.03) 0%, rgba($primary-mint, 0.08) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba($primary-teal, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
}

.help-cta {
  display: flex;
  flex-direction: column;
  gap: $spacing-12;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (min-width: $breakpoint-lg) {
    flex-direction: row;
    justify-content: space-between;
  }
}

.help-content {
  flex: 1;
}

.help-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  color: $white;
  padding: 0.5rem 1.5rem;
  border-radius: $border-radius-full;
  margin-bottom: $spacing-6;
  font-size: $text-sm;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba($primary-teal, 0.3);
}

.help-badge-icon {
  color: $white;
}

.help-title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: $spacing-4;
  color: $gray-900;
  font-weight: 800;
}

.help-intro {
  font-size: $text-lg;
  color: $gray-600;
  margin-bottom: $spacing-8;
  line-height: $leading-relaxed;
}

.help-categories {
  display: grid;
  gap: $spacing-6;
  margin-bottom: $spacing-10;
}

.help-category {
  display: flex;
  gap: $spacing-4;
  padding: $spacing-6;
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid $primary-teal;

  &:hover {
    transform: translateX(10px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }
}

.help-category-icon {
  color: $primary-teal;
  flex-shrink: 0;
}

.help-category-content {
  h3 {
    font-size: $text-lg;
    font-weight: 700;
    color: $gray-900;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: $text-sm;
    color: $gray-600;
    line-height: $leading-relaxed;
  }
}

.help-actions {
  display: flex;
  gap: $spacing-4;
  flex-wrap: wrap;
}

.help-image {
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-visual {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-visual-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
  animation: pulse-circle 3s infinite ease-in-out;

  &.circle-1 {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
    animation-delay: 0s;
  }

  &.circle-2 {
    width: 75%;
    height: 75%;
    background: linear-gradient(135deg, $primary-mint, $primary-orange);
    animation-delay: 1s;
  }

  &.circle-3 {
    width: 50%;
    height: 50%;
    background: linear-gradient(135deg, $primary-orange, $primary-teal);
    animation-delay: 2s;
  }
}

@keyframes pulse-circle {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

.help-visual-icon {
  position: relative;
  z-index: 1;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba($primary-teal, 0.4);
  animation: float-gentle 4s infinite ease-in-out;

  svg {
    width: 50px;
    height: 50px;
    color: $white;
  }
}

@keyframes float-gentle {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}
</style>
