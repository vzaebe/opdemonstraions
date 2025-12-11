<template>
  <div class="partners-page">
    <!-- Hero Section -->
    <section class="partners-hero">
      <div class="hero-background">
        <div class="hero-shape shape-1"></div>
        <div class="hero-shape shape-2"></div>
        <div class="hero-shape shape-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Вместе сильнее</span>
        </div>
        <h1 class="hero-title">Наши партнёры</h1>
        <p class="hero-subtitle">
          Организации, с которыми мы создаём возможности для профориентации 
          и интеграции молодежи из незащищённых слоёв населения
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">{{ partners.length }}</span>
            <span class="stat-label">Партнёров</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ totalProjects }}</span>
            <span class="stat-label">Совместных проектов</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ industries.length }}</span>
            <span class="stat-label">Отраслей</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <UiSection>
      <!-- Description -->
      <div class="intro-section">
        <h2 class="intro-title">Сотрудничество, которое меняет жизни</h2>
        <p class="intro-text">
          Наши партнёры — это компании и организации, которые разделяют нашу миссию 
          создания равных возможностей для всех. Вместе мы реализуем программы 
          профориентации, обучения и трудоустройства, помогая молодым людям найти 
          своё место в жизни и построить успешную карьеру.
        </p>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label">Отрасль</label>
          <select v-model="filterIndustry" class="filter-select">
            <option value="all">Все отрасли</option>
            <option v-for="industry in industries" :key="industry" :value="industry">
              {{ industry }}
            </option>
          </select>
        </div>
      </div>

      <!-- Partners Grid -->
      <div class="partners-grid">
        <article
          v-for="(partner, index) in filteredPartners"
          :key="partner.id"
          class="partner-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="openPartnerModal(partner)"
          @keypress.enter="openPartnerModal(partner)"
          tabindex="0"
          role="button"
        >
          <!-- Logo Section -->
          <div class="card-logo-section">
            <div class="logo-wrapper">
              <img 
                v-if="partner.logo" 
                :src="getLogoUrl(partner.logo)" 
                :alt="partner.name"
                class="partner-logo"
              />
              <div v-else class="logo-placeholder">
                {{ getInitials(partner.name) }}
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="card-content">
            <h3 class="card-title">{{ partner.name }}</h3>
            <p class="card-description">{{ partner.description }}</p>

            <div class="card-meta">
              <div class="meta-item">
                <span class="meta-icon">🏭</span>
                <span class="meta-text">{{ partner.industry }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🤝</span>
                <span class="meta-text">{{ partner.assistanceType }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📍</span>
                <span class="meta-text">{{ partner.city }}</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="projects-count">
                <span class="projects-icon">✅</span>
                <span class="projects-number">{{ partner.completedProjects }}</span>
                <span class="projects-label">проектов</span>
              </div>
              <div class="card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Call to Action -->
      <div class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Хотите стать нашим партнёром?</h2>
          <p class="cta-text">
            Присоединяйтесь к нам в создании возможностей для молодежи. 
            Вместе мы можем изменить будущее к лучшему.
          </p>
          <div class="cta-buttons">
            <ButtonPrimary size="lg" @click="scrollToContact">
              Связаться с нами
            </ButtonPrimary>
            <ButtonPrimary variant="secondary" size="lg" @click="$router.push('/about')">
              Узнать больше
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </UiSection>

    <!-- Partner Detail Modal -->
    <PartnerDetailModal
      v-if="selectedPartner"
      :is-open="selectedPartner !== null"
      :partner="selectedPartner"
      @close="closePartnerModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UiSection from '@/components/ui/Section.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import PartnerDetailModal from '@/components/charity/PartnerDetailModal.vue'
import partnersData from '@/data/general_partners.json'

interface Partner {
  id: string
  name: string
  type: string
  logo: string
  industry: string
  assistanceType: string
  description: string
  fullDescription: string
  website: string
  email: string
  phone: string
  city: string
  foundedYear: number
  completedProjects: number
}

const router = useRouter()
const partners = ref<Partner[]>([])
const selectedPartner = ref<Partner | null>(null)
const filterIndustry = ref<string>('all')

// Computed
const filteredPartners = computed(() => {
  if (filterIndustry.value === 'all') {
    return partners.value
  }
  return partners.value.filter(p => p.industry === filterIndustry.value)
})

const totalProjects = computed(() => {
  return partners.value.reduce((sum, p) => sum + p.completedProjects, 0)
})

const industries = computed(() => {
  return [...new Set(partners.value.map(p => p.industry))].sort()
})

// Methods
const openPartnerModal = (partner: Partner) => {
  selectedPartner.value = partner
}

const closePartnerModal = () => {
  selectedPartner.value = null
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getLogoUrl = (logoPath: string): string => {
  // Handle different logo path formats
  if (logoPath.startsWith('http')) {
    return logoPath
  }
  if (logoPath.startsWith('/src/')) {
    return new URL(logoPath.replace('/src/', '../'), import.meta.url).href
  }
  return logoPath
}

const scrollToContact = () => {
  router.push('/#contact')
}

// Lifecycle
onMounted(() => {
  partners.value = partnersData as Partner[]
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.partners-page {
  min-height: 100vh;
}

// Hero Section
.partners-hero {
  position: relative;
  background: linear-gradient(135deg, $primary-teal 0%, $primary-mint 100%);
  color: $white;
  padding: $spacing-20 $spacing-4 $spacing-24;
  text-align: center;
  overflow: hidden;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
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
  animation: float 25s infinite ease-in-out;

  &.shape-1 {
    width: 600px;
    height: 600px;
    top: -250px;
    right: -200px;
  }

  &.shape-2 {
    width: 400px;
    height: 400px;
    bottom: -150px;
    left: -150px;
    animation-delay: 8s;
  }

  &.shape-3 {
    width: 300px;
    height: 300px;
    top: 50%;
    left: 10%;
    animation-delay: 16s;
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(50px, -50px) rotate(120deg); }
  66% { transform: translate(-40px, 40px) rotate(240deg); }
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
    transform: translateY(40px);
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
  padding: 0.75rem 1.75rem;
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

.hero-title {
  font-size: clamp(3rem, 7vw, 5rem);
  margin-bottom: $spacing-6;
  font-weight: 900;
  letter-spacing: -2px;
}

.hero-subtitle {
  font-size: $text-xl;
  line-height: $leading-relaxed;
  opacity: 0.95;
  max-width: 750px;
  margin: 0 auto $spacing-10;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: $spacing-12;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: $spacing-6 $spacing-8;
  background: rgba($white, 0.15);
  backdrop-filter: blur(10px);
  border-radius: $border-radius-2xl;
  border: 1px solid rgba($white, 0.25);
  min-width: 160px;
}

.stat-value {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1;
}

.stat-label {
  font-size: $text-sm;
  opacity: 0.9;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

// Intro Section
.intro-section {
  text-align: center;
  max-width: 900px;
  margin: 0 auto $spacing-16;
}

.intro-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: $gray-900;
  margin-bottom: $spacing-6;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, $primary-teal, $primary-orange);
    margin: $spacing-4 auto 0;
    border-radius: 2px;
  }
}

.intro-text {
  font-size: $text-lg;
  color: $gray-700;
  line-height: $leading-relaxed;
  margin: 0;
}

// Filters
.filters-section {
  margin-bottom: $spacing-12;
  display: flex;
  justify-content: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 300px;
}

.filter-label {
  font-size: $text-sm;
  font-weight: 700;
  color: $gray-700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 1rem 1.25rem;
  border: 2px solid $gray-200;
  border-radius: $border-radius-xl;
  font-size: $text-base;
  background: $white;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: $shadow-sm;

  &:hover {
    border-color: $gray-300;
  }

  &:focus {
    outline: none;
    border-color: $primary-teal;
    box-shadow: 0 0 0 3px rgba($primary-teal, 0.1);
  }
}

// Partners Grid
.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: $spacing-10;
  margin-bottom: $spacing-16;

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.partner-card {
  background: $white;
  border: 2px solid $gray-100;
  border-radius: $border-radius-2xl;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out both;

  &:hover {
    border-color: $primary-teal;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    transform: translateY(-10px);

    .partner-logo {
      transform: scale(1.1) rotate(3deg);
    }

    .card-arrow {
      transform: translateX(8px);
    }
  }

  &:focus {
    outline: 3px solid $primary-teal;
    outline-offset: 3px;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-logo-section {
  padding: $spacing-8;
  background: linear-gradient(135deg, rgba($primary-teal, 0.05), rgba($primary-mint, 0.05));
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 180px;
}

.logo-wrapper {
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.logo-placeholder {
  width: 120px;
  height: 120px;
  border-radius: $border-radius-2xl;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $text-3xl;
  font-weight: 900;
  box-shadow: $shadow-lg;
}

.card-content {
  padding: $spacing-8;
}

.card-title {
  font-size: $text-2xl;
  font-weight: 800;
  color: $gray-900;
  margin: 0 0 $spacing-4;
}

.card-description {
  font-size: $text-base;
  color: $gray-600;
  line-height: $leading-relaxed;
  margin: 0 0 $spacing-6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  margin-bottom: $spacing-6;
  padding: $spacing-5;
  background: $gray-50;
  border-radius: $border-radius-lg;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-size: $text-sm;
}

.meta-icon {
  font-size: $text-lg;
  flex-shrink: 0;
}

.meta-text {
  color: $gray-700;
  font-weight: 500;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: $spacing-5;
  border-top: 2px solid $gray-100;
}

.projects-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $primary-teal;
}

.projects-icon {
  font-size: $text-xl;
}

.projects-number {
  font-size: $text-2xl;
  font-weight: 800;
}

.projects-label {
  font-size: $text-sm;
  font-weight: 600;
}

.card-arrow {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($primary-teal, 0.1);
  border-radius: $border-radius-full;
  color: $primary-teal;
  transition: all 0.3s;

  svg {
    width: 20px;
    height: 20px;
  }
}

// CTA Section
.cta-section {
  padding: $spacing-16;
  background: linear-gradient(135deg, rgba($primary-teal, 0.08), rgba($primary-mint, 0.08));
  border-radius: $border-radius-2xl;
  text-align: center;
  border: 2px solid rgba($primary-teal, 0.1);
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: $gray-900;
  margin: 0 0 $spacing-5;
}

.cta-text {
  font-size: $text-lg;
  color: $gray-700;
  line-height: $leading-relaxed;
  margin: 0 0 $spacing-10;
}

.cta-buttons {
  display: flex;
  gap: $spacing-4;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: $breakpoint-md) {
  .hero-stats {
    gap: $spacing-6;
  }

  .stat-item {
    min-width: 120px;
    padding: $spacing-4 $spacing-6;
  }

  .partners-grid {
    gap: $spacing-6;
  }
}
</style>

