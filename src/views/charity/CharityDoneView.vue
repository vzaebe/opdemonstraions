<template>
  <div class="charity-done">
    <!-- Hero Section -->
    <div class="done-hero">
      <div class="done-hero-background">
        <div class="done-hero-grid"></div>
      </div>
      <div class="done-hero-content">
        <div class="done-hero-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Наши достижения</span>
        </div>
        <h1 class="done-hero-title">Выполненные работы</h1>
        <p class="done-hero-subtitle">
          Галерея проектов, которые мы уже реализовали и передали детям.
          Каждая работа — это улыбка ребенка и небольшое чудо, созданное руками волонтёров.
        </p>
        <div class="done-hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-value">{{ store.doneWorks.length }}</span>
            <span class="hero-stat-label">Проектов</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-value">{{ store.totalPartners }}</span>
            <span class="hero-stat-label">Волонтёров</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-value">100%</span>
            <span class="hero-stat-label">Бесплатно</span>
          </div>
        </div>
      </div>
    </div>

    <UiSection>
      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-header">
          <h2 class="filters-title">
            <svg class="filters-icon" viewBox="0 0 24 24" fill="none">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Фильтры
          </h2>
        </div>
        <div class="filters-chips">
          <button 
            :class="['filter-chip', { active: selectedFilter === 'all' }]"
            @click="selectedFilter = 'all'"
          >
            <span class="chip-icon">🎨</span>
            Все работы
          </button>
          <button 
            :class="['filter-chip', { active: selectedFilter === 'toys' }]"
            @click="selectedFilter = 'toys'"
          >
            <span class="chip-icon">🧸</span>
            Игрушки
          </button>
          <button 
            :class="['filter-chip', { active: selectedFilter === 'educational' }]"
            @click="selectedFilter = 'educational'"
          >
            <span class="chip-icon">📚</span>
            Обучающие
          </button>
          <button 
            :class="['filter-chip', { active: selectedFilter === 'medical' }]"
            @click="selectedFilter = 'medical'"
          >
            <span class="chip-icon">⚕️</span>
            Медицинские
          </button>
        </div>
      </div>

      <!-- Works Grid -->
      <div class="works-grid">
        <WorkCard
          v-for="(work, index) in store.doneWorks"
          :key="work.id"
          :title="work.title"
          :image="work.image"
          :description="work.description"
          :date="work.date"
          :style="{ animationDelay: `${index * 0.1}s` }"
          class="work-card-animated"
        />
      </div>
      
      <div v-if="store.doneWorks.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Пока нет выполненных работ</h3>
        <p>Но мы работаем над этим! Скоро здесь появятся первые проекты.</p>
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import WorkCard from '@/components/charity/WorkCard.vue'

const store = useCharityStore()
const selectedFilter = ref('all')

onMounted(() => {
  store.fetchDoneWorks()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.charity-done {
  overflow: hidden;
}

.done-hero {
  position: relative;
  background: linear-gradient(135deg, #0e9f6e 0%, #0694a2 100%);
  color: $white;
  padding: $spacing-16 $spacing-4 $spacing-20;
  text-align: center;
  overflow: hidden;
}

.done-hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.done-hero-grid {
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba($white, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba($white, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.done-hero-content {
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

.done-hero-badge {
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

.done-hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: $spacing-4;
  font-weight: 800;
}

.done-hero-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto $spacing-10;
}

.done-hero-stats {
  display: flex;
  justify-content: center;
  gap: $spacing-10;
  flex-wrap: wrap;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.hero-stat-value {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  background: linear-gradient(135deg, $white, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-stat-label {
  font-size: $text-sm;
  opacity: 0.9;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.filters-section {
  margin-bottom: $spacing-12;
  margin-top: -40px;
  position: relative;
  z-index: 2;
}

.filters-header {
  text-align: center;
  margin-bottom: $spacing-6;
}

.filters-title {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: $text-2xl;
  font-weight: 800;
  color: $gray-900;
  background: $white;
  padding: $spacing-3 $spacing-6;
  border-radius: $border-radius-full;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.filters-icon {
  width: 24px;
  height: 24px;
  color: $primary-teal;
}

.filters-chips {
  display: flex;
  justify-content: center;
  gap: $spacing-3;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: $spacing-3 $spacing-6;
  background: $white;
  border: 2px solid $gray-200;
  border-radius: $border-radius-full;
  font-weight: 600;
  font-size: $text-sm;
  color: $gray-700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: $primary-teal;
    color: $primary-teal;
    transform: translateY(-3px);
    box-shadow: 0 5px 20px rgba($primary-teal, 0.2);
  }

  &.active {
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
    color: $white;
    border-color: $primary-teal;
    box-shadow: 0 5px 20px rgba($primary-teal, 0.3);
    transform: translateY(-3px);
  }
}

.chip-icon {
  font-size: 1.25rem;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $spacing-8;
}

.work-card-animated {
  animation: fadeInScale 0.6s ease-out both;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-20 $spacing-4;
  color: $gray-500;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: $spacing-6;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.empty-state h3 {
  font-size: $text-2xl;
  font-weight: 700;
  color: $gray-700;
  margin-bottom: $spacing-3;
}

.empty-state p {
  font-size: $text-lg;
  color: $gray-500;
  max-width: 500px;
  margin: 0 auto;
  line-height: $leading-relaxed;
}
</style>




