<template>
  <div class="projects-page">
    <div class="hero-section">
      <div class="container">
        <h1 class="hero-title">Наши проекты</h1>
        <p class="hero-subtitle">
          Узнайте больше о наших социальных инициативах и их влиянии на общество
        </p>
      </div>
    </div>

    <div class="container">
      <!-- Filters -->
      <div class="filters-bar">
        <button 
          v-for="status in filters" 
          :key="status.value"
          :class="['filter-btn', { active: currentFilter === status.value }]"
          @click="currentFilter = status.value"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- Projects Grid -->
      <div v-if="filteredProjects.length > 0" class="projects-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
          @click="navigateToProject(project.id)"
        >
          <div class="project-image">
            <img :src="project.heroImage" :alt="project.title" />
            <div class="project-status" :class="project.status">
              {{ getStatusLabel(project.status) }}
            </div>
          </div>
          <div class="project-content">
            <div class="project-category">{{ project.category }}</div>
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.shortDescription }}</p>
            
            <div v-if="project.budget" class="project-progress">
              <div class="progress-info">
                <span class="raised">{{ formatMoney(project.raised || 0) }}</span>
                <span class="target">из {{ formatMoney(project.budget) }}</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: getProgressPercent(project) + '%' }"
                ></div>
              </div>
              <div class="progress-percent">{{ getProgressPercent(project) }}% собрано</div>
            </div>

            <div class="project-meta">
              <div class="meta-item">
                <span class="icon">📅</span>
                <span>{{ formatDate(project.startDate) }}</span>
              </div>
              <div v-if="project.beneficiaries" class="meta-item">
                <span class="icon">👥</span>
                <span>{{ getBeneficiariesCount(project.beneficiaries) }}</span>
              </div>
            </div>

            <button class="btn-details">Подробнее →</button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Проекты не найдены</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCharityStore } from '@/stores/charity'

const router = useRouter()
const store = useCharityStore()

const filters = [
  { value: 'all', label: 'Все проекты' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Завершённые' },
  { value: 'planned', label: 'Запланированные' }
]

const currentFilter = ref('all')

const filteredProjects = computed(() => {
  if (currentFilter.value === 'all') {
    return store.projects
  }
  return store.projects.filter(p => p.status === currentFilter.value)
})

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Активен',
    completed: 'Завершён',
    planned: 'Запланирован'
  }
  return labels[status] || status
}

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long'
  })
}

const getProgressPercent = (project: any) => {
  if (!project.budget || project.budget === 0) return 0
  return Math.min(Math.round(((project.raised || 0) / project.budget) * 100), 100)
}

const getBeneficiariesCount = (beneficiaries: string) => {
  // Extract number from string like "Более 50 детей"
  const match = beneficiaries.match(/\d+/)
  return match ? `${match[0]}+ людей` : 'Множество людей'
}

const navigateToProject = (id: string) => {
  router.push({ name: 'project-detail', params: { id } })
}

onMounted(async () => {
  await store.fetchProjects()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use 'sass:color';

.projects-page {
  min-height: 100vh;
  background: $gray-50;
}

.hero-section {
  background: linear-gradient(135deg, $primary-teal 0%, $primary-teal-dark 100%);
  color: $white;
  padding: $spacing-16 0;
  text-align: center;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-6;
  }
}

.hero-title {
  font-size: $text-4xl;
  font-weight: 700;
  margin: 0 0 $spacing-4;

  @media (max-width: 768px) {
    font-size: $text-3xl;
  }
}

.hero-subtitle {
  font-size: $text-xl;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: $text-lg;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-12 $spacing-6;
}

.filters-bar {
  display: flex;
  gap: $spacing-3;
  margin-bottom: $spacing-8;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: $spacing-3 $spacing-6;
  border: 2px solid $gray-300;
  background: $white;
  color: $gray-700;
  border-radius: $border-radius-full;
  cursor: pointer;
  font-size: $text-base;
  font-weight: 500;
  transition: all $transition-fast;

  &:hover {
    border-color: $primary-teal;
    color: $primary-teal;
  }

  &.active {
    background: $primary-teal;
    border-color: $primary-teal;
    color: $white;
  }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-8;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.project-card {
  background: $white;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: $shadow-md;
  transition: all $transition-normal;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-xl;
  }
}

.project-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-slow;
  }

  .project-card:hover & img {
    transform: scale(1.05);
  }
}

.project-status {
  position: absolute;
  top: $spacing-4;
  right: $spacing-4;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  font-weight: 600;
  backdrop-filter: blur(10px);

  &.active {
    background: rgba($success-green, 0.9);
    color: $white;
  }

  &.completed {
    background: rgba($gray-700, 0.9);
    color: $white;
  }

  &.planned {
    background: rgba($warning-yellow, 0.9);
    color: $gray-900;
  }
}

.project-content {
  padding: $spacing-6;
}

.project-category {
  display: inline-block;
  padding: $spacing-1 $spacing-3;
  background: $primary-teal-light;
  color: $primary-teal;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  font-weight: 600;
  margin-bottom: $spacing-3;
}

.project-title {
  font-size: $text-xl;
  font-weight: 700;
  color: $gray-900;
  margin: $spacing-3 0;
  line-height: 1.4;
}

.project-description {
  color: $gray-600;
  line-height: 1.6;
  margin-bottom: $spacing-4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-progress {
  margin: $spacing-4 0;
  padding: $spacing-4;
  background: $gray-50;
  border-radius: $border-radius-md;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-2;
  font-size: $text-sm;

  .raised {
    font-weight: 700;
    color: $primary-teal;
  }

  .target {
    color: $gray-600;
  }
}

.progress-bar {
  height: 8px;
  background: $gray-200;
  border-radius: $border-radius-full;
  overflow: hidden;
  margin-bottom: $spacing-2;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary-teal 0%, $success-green 100%);
  border-radius: $border-radius-full;
  transition: width $transition-slow;
}

.progress-percent {
  font-size: $text-xs;
  color: $gray-600;
  text-align: right;
}

.project-meta {
  display: flex;
  gap: $spacing-4;
  margin: $spacing-4 0;
  padding-top: $spacing-4;
  border-top: 1px solid $gray-200;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-size: $text-sm;
  color: $gray-600;

  .icon {
    font-size: $text-lg;
  }
}

.btn-details {
  width: 100%;
  padding: $spacing-3 $spacing-4;
  background: $primary-teal;
  color: $white;
  border: none;
  border-radius: $border-radius-md;
  font-size: $text-base;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: color.adjust($primary-teal, $lightness: -10%);
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-16;
  color: $gray-500;
  font-size: $text-lg;
}
</style>

