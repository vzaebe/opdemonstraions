<template>
  <div class="organization-projects-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-overlay"></div>
        <div class="animated-shapes">
          <span class="shape" v-for="n in 15" :key="n"></span>
        </div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">Проекты Открытых Перспектив</h1>
        <p class="hero-subtitle">
          Образовательные инициативы, социальные программы и инновационные решения
        </p>
        <p class="hero-description">
          Мы реализуем разнообразные проекты, направленные на развитие молодежи, 
          профориентацию и интеграцию в современный мир технологий
        </p>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <section class="navigation-tabs">
      <div class="container">
        <div class="tabs">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['tab', { active: activeCategory === category.id }]"
            @click="activeCategory = category.id"
          >
            <span class="tab-icon">
              <Icon :name="iconNameFromEmoji(category.icon) || 'target'" :size="20" />
            </span>
            <span class="tab-name">{{ category.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="projects-section">
      <div class="container">
        <transition-group name="fade" tag="div" class="projects-grid">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="project-card"
            @click="goToProject(project.slug)"
            role="link"
            tabindex="0"
            @keydown.enter="goToProject(project.slug)"
          >
            <div class="project-header">
              <div class="project-icon">
                <Icon :name="iconNameFromEmoji(project.icon) || 'target'" :size="40" :title="project.title" />
              </div>
              <div class="project-status" :class="project.status">
                {{ getStatusText(project.status) }}
              </div>
            </div>
            <div class="project-image-wrapper" v-if="project.image">
              <img :src="project.image" :alt="project.title" class="project-image" loading="lazy" />
              <div class="image-overlay"></div>
            </div>
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
              
              <div class="project-details">
                <div class="detail-item" v-if="project.participants">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ project.participants }}+ участников</span>
                </div>
                <div class="detail-item" v-if="project.duration">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ project.duration }}</span>
                </div>
                <div class="detail-item" v-if="project.location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ project.location }}</span>
                </div>
              </div>

              <div class="project-tags">
                <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
              </div>

              <div class="project-footer">
                <router-link
                  class="btn-primary"
                  :to="{ name: 'organization-project-detail', params: { slug: project.slug } }"
                  @click.stop
                >
                  Смотреть проект
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Присоединяйтесь к нашим проектам</h2>
          <p class="cta-description">
            Станьте частью команды единомышленников и помогите нам менять мир к лучшему
          </p>
          <div class="cta-buttons">
            <router-link :to="{ name: 'contacts', hash: '#contact-form' }" class="cta-button primary">Связаться с нами</router-link>
            <router-link to="/charity/help" class="cta-button secondary">Поддержать проект</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'
import { iconNameFromEmoji } from '@/utils/icon'
import { http, trackApiError } from '@/services/api/http'
import type { OrganizationProject } from '@/data/organization_projects'

const router = useRouter()
const activeCategory = ref('all')
const projects = ref<OrganizationProject[]>([])

const categories = [
  { id: 'all', name: 'Все проекты', icon: '🎯' },
  { id: 'education', name: 'Образование', icon: '🎓' },
  { id: 'social', name: 'Социальные', icon: '🤝' },
  { id: 'events', name: 'Мероприятия', icon: '🎪' },
  { id: 'innovation', name: 'Инновации', icon: '💡' }
]

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') {
    return projects.value
  }
  return projects.value.filter((p: OrganizationProject) => p.category === activeCategory.value)
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Активный',
    completed: 'Завершен',
    planned: 'Планируется'
  }
  return statusMap[status] || status
}

const goToProject = (slug: string) => {
  router.push({ name: 'organization-project-detail', params: { slug } })
}

onMounted(async () => {
  try {
    projects.value = await http.get<OrganizationProject[]>('/organization-projects')
  } catch (error) {
    trackApiError(error, 'OrganizationProjectsView.fetch')
    projects.value = []
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.organization-projects-page {
  width: 100%;
  overflow-x: hidden;
}

// Hero Section
.hero-section {
  position: relative;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: $spacing-24 $spacing-8;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    $primary-teal 0%, 
    $primary-mint 50%, 
    $primary-cyan 100%);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
}

.animated-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .shape {
    position: absolute;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    animation: floatShape 20s infinite;

    @for $i from 1 through 15 {
      &:nth-child(#{$i}) {
        left: random(100) * 1%;
        top: random(100) * 1%;
        animation-delay: random(15) * 0.1s;
        animation-duration: (15 + random(10)) * 1s;
        transform: rotate(random(360) * 1deg);
      }
    }
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: $white;
  max-width: 900px;
  padding: 0 $spacing-8;
}

.hero-title {
  font-size: $text-6xl;
  font-weight: 700;
  margin-bottom: $spacing-6;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease;
}

.hero-subtitle {
  font-size: $text-2xl;
  font-weight: 500;
  margin-bottom: $spacing-4;
  opacity: 0.95;
  animation: fadeInUp 1s ease 0.2s backwards;
}

.hero-description {
  font-size: $text-xl;
  line-height: $leading-relaxed;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
  animation: fadeInUp 1s ease 0.4s backwards;
}

// Container
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-8;
}

// Navigation Tabs
.navigation-tabs {
  background: $white;
  padding: $spacing-8 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 100px;
  z-index: $z-sticky;
}

.tabs {
  display: flex;
  gap: $spacing-4;
  overflow-x: auto;
  padding: $spacing-2 0;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: $gray-100;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: $primary-teal;
    border-radius: 3px;
  }
}

.tab {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  padding: $spacing-3 $spacing-6;
  background: $gray-100;
  border: 2px solid transparent;
  border-radius: $border-radius-full;
  font-size: $text-base;
  font-weight: 600;
  color: $gray-700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: $gray-200;
    transform: translateY(-2px);
  }

  &.active {
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
    color: $white;
    border-color: $primary-teal;
    box-shadow: 0 4px 15px rgba($primary-teal, 0.3);
  }
}

.tab-icon {
  font-size: $text-xl;
}

// Projects Section
.projects-section {
  padding: $spacing-24 0;
  background: linear-gradient(135deg, rgba($primary-teal, 0.02), rgba($primary-mint, 0.02));
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: $spacing-8;
}

.project-card {
  background: $white;
  border-radius: $border-radius-2xl;
  overflow: hidden;
  box-shadow: $shadow-lg;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-10px);
    box-shadow: $shadow-xl;

    .project-image {
      transform: scale(1.1);
    }

    .image-overlay {
      opacity: 0.3;
    }
  }
}

.project-header {
  padding: $spacing-6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $gray-200;
}

.project-icon {
  font-size: $text-5xl;
}

.project-status {
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  font-weight: 600;

  &.active {
    background: rgba($primary-teal, 0.1);
    color: $primary-teal;
  }

  &.completed {
    background: rgba($primary-mint, 0.1);
    color: darken($primary-mint, 20%);
  }

  &.planned {
    background: rgba($primary-orange, 0.1);
    color: darken($primary-orange, 10%);
  }
}

.project-image-wrapper {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0.5;
  transition: opacity 0.4s ease;
}

.project-content {
  padding: $spacing-6;
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  flex-grow: 1;
}

.project-title {
  font-size: $text-2xl;
  font-weight: 600;
  color: $primary-teal;
  margin: 0;
  line-height: $leading-tight;
}

.project-description {
  font-size: $text-base;
  line-height: $leading-relaxed;
  color: $gray-700;
  margin: 0;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  padding: $spacing-4;
  background: $gray-50;
  border-radius: $border-radius-md;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-size: $text-sm;
  color: $gray-600;

  svg {
    color: $primary-teal;
    flex-shrink: 0;
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
}

.tag {
  padding: $spacing-1 $spacing-3;
  background: linear-gradient(135deg, rgba($primary-teal, 0.1), rgba($primary-mint, 0.1));
  color: $primary-teal;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  font-weight: 500;
}

.project-footer {
  margin-top: auto;
  padding-top: $spacing-4;
  border-top: 1px solid $gray-200;
}

.btn-primary {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;
  padding: $spacing-4 $spacing-6;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  color: $white;
  border: none;
  border-radius: $border-radius-md;
  font-size: $text-base;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba($primary-teal, 0.3);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }
}

// CTA Section
.cta-section {
  padding: $spacing-24 0;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
}

.cta-content {
  text-align: center;
  color: $white;
}

.cta-title {
  font-size: $text-5xl;
  font-weight: 700;
  margin-bottom: $spacing-6;
}

.cta-description {
  font-size: $text-2xl;
  line-height: $leading-relaxed;
  margin-bottom: $spacing-12;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: $spacing-6;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-block;
  padding: $spacing-5 $spacing-10;
  font-size: $text-xl;
  font-weight: 600;
  border-radius: $border-radius-full;
  text-decoration: none;
  transition: all 0.3s ease;

  &.primary {
    background: $white;
    color: $primary-teal;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  }

  &.secondary {
    background: transparent;
    color: $white;
    border: 2px solid $white;

    &:hover {
      background: $white;
      color: $primary-teal;
      transform: translateY(-5px);
    }
  }
}

// Modal
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal;
  padding: $spacing-8;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  background: $white;
  border-radius: $border-radius-2xl;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: $spacing-4;
  right: $spacing-4;
  background: rgba($white, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: $white;
    transform: rotate(90deg);
  }
}

.modal-header {
  padding: $spacing-8;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  color: $white;
  text-align: center;
}

.modal-icon {
  font-size: $text-7xl;
  margin-bottom: $spacing-4;
}

.modal-title {
  font-size: $text-4xl;
  font-weight: 700;
  margin-bottom: $spacing-4;
}

.modal-status {
  display: inline-block;
  padding: $spacing-2 $spacing-6;
  border-radius: $border-radius-full;
  font-size: $text-base;
  font-weight: 600;
  background: rgba($white, 0.2);
}

.modal-body {
  padding: $spacing-8;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-6;
}

.modal-description {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  color: $gray-700;
  margin-bottom: $spacing-6;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  padding: $spacing-6;
  background: $gray-50;
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-6;
}

.modal-detail-item {
  font-size: $text-base;
  color: $gray-700;

  strong {
    color: $primary-teal;
    margin-right: $spacing-2;
  }
}

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
  margin-bottom: $spacing-8;
}

.modal-actions {
  display: flex;
  gap: $spacing-4;
}

.modal-button {
  flex: 1;
  padding: $spacing-4 $spacing-8;
  border-radius: $border-radius-md;
  font-size: $text-lg;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
    color: $white;
    border: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba($primary-teal, 0.3);
    }
  }

  &.secondary {
    background: $gray-200;
    color: $gray-700;
    border: none;

    &:hover {
      background: $gray-300;
    }
  }
}

// Animations
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

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes floatShape {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translate(50px, 50px) rotate(180deg);
    opacity: 0.6;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9);
}

// Responsive Design
@media (max-width: $breakpoint-lg) {
  .hero-title {
    font-size: $text-5xl;
  }

  .hero-subtitle {
    font-size: $text-xl;
  }

  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: $spacing-6;
  }

  .navigation-tabs {
    top: 80px;
  }
}

@media (max-width: $breakpoint-md) {
  .hero-title {
    font-size: $text-4xl;
  }

  .hero-subtitle {
    font-size: $text-lg;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    justify-content: flex-start;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-button {
    width: 100%;
  }

  .modal-actions {
    flex-direction: column;
  }

  .navigation-tabs {
    position: static;
  }
}
</style>




