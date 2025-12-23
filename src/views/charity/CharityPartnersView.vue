<template>
  <div class="partners-page">
    <!-- Hero Section -->
    <div class="partners-hero">
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
          <span>Вместе создаём будущее</span>
        </div>
        <h1 class="hero-title">Наши партнёры</h1>
        <p class="hero-subtitle">
          Организации и частные лица, которые помогают нам воплощать идеи в жизнь
          и делают мир немного лучше
        </p>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-value">{{ partners.length }}</span>
            <span class="stat-label">Партнёров</span>
          </div>
          <div class="hero-stat">
            <span class="stat-value">{{ totalWorks }}</span>
            <span class="stat-label">Работ выполнено</span>
          </div>
          <div class="hero-stat">
            <span class="stat-value">{{ industries.length }}</span>
            <span class="stat-label">Отраслей</span>
          </div>
        </div>
      </div>
    </div>

    <UiSection>
      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-header">
          <h2 class="filters-title">Найти партнёра</h2>
        </div>
        <div class="filters-container">
          <div class="filter-group">
            <label class="filter-label">Тип</label>
            <select v-model="filterType" class="filter-select">
              <option value="all">Все типы</option>
              <option value="company">Компании</option>
              <option value="individual">Частные лица</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Город</label>
            <select v-model="filterCity" class="filter-select">
              <option value="all">Все города</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Отрасль</label>
            <select v-model="filterIndustry" class="filter-select">
              <option value="all">Все отрасли</option>
              <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Partners Grid -->
      <div class="partners-section">
        <div v-if="filteredPartners.length === 0" class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>Партнёры не найдены</h3>
          <p>Попробуйте изменить параметры фильтрации</p>
        </div>
        <div v-else class="partners-grid">
          <article
            v-for="(partner, index) in filteredPartners"
            :key="partner.id"
            class="partner-card"
            :style="{ animationDelay: `${index * 0.05}s` }"
            @click="openPartnerModal(partner)"
            @keypress.enter="openPartnerModal(partner)"
            tabindex="0"
            role="button"
          >
            <!-- Partner Logo -->
            <div class="card-logo-section">
              <img 
                v-if="partner.logo" 
                :src="partner.logo" 
                :alt="partner.name"
                class="card-logo"
              />
              <div v-else class="card-logo-placeholder">
                {{ getInitials(partner.name) }}
              </div>
            </div>

            <!-- Partner Info -->
            <div class="card-content">
              <div class="card-header">
                <h3 class="card-name">{{ partner.name }}</h3>
                <span class="card-type-badge" :class="partner.type">
                  {{ partner.type === 'company' ? '🏢' : '👤' }}
                </span>
              </div>
              
              <p class="card-description">
                {{ partner.about || 'Нет описания' }}
              </p>

              <div class="card-details">
                <div class="detail-item">
                  <span class="detail-icon">🏭</span>
                  <span class="detail-label">Отрасль:</span>
                  <span class="detail-value">{{ partner.industry || 'Не указана' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🤝</span>
                  <span class="detail-label">Помощь:</span>
                  <span class="detail-value">{{ partner.assistanceType || 'Не указана' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <span class="detail-label">Город:</span>
                  <span class="detail-value">{{ partner.city }}</span>
                </div>
              </div>

              <div class="card-footer">
                <div class="completed-works">
                  <span class="works-icon">✅</span>
                  <span class="works-count">{{ partner.completed_works }}</span>
                  <span class="works-label">работ выполнено</span>
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
      </div>

      <!-- Call to Action -->
      <div class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Хотите стать партнёром?</h2>
          <p class="cta-text">
            Присоединяйтесь к нашему сообществу и помогайте менять мир к лучшему
          </p>
          <ButtonPrimary size="lg" @click="$router.push('/charity/community')">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Присоединиться
          </ButtonPrimary>
        </div>
      </div>
    </UiSection>

    <!-- Partner Detail Modal -->
    <PartnerDetailModal
      :is-open="selectedPartner !== null"
      :partner="selectedPartner || defaultPartner"
      @close="closePartnerModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'
import PartnerDetailModal from '@/components/charity/PartnerDetailModal.vue'

interface Partner {
  id: string
  name: string
  type: string
  city: string
  printer_model: string
  materials: string[]
  capabilities?: string[]
  about?: string
  contact?: string
  completed_works: number
  logo?: string
  industry?: string
  assistanceType?: string
  fullDescription?: string
  website?: string
  email?: string
  phone?: string
  foundedYear?: number
}

const store = useCharityStore()
const partners = ref<Partner[]>([])
const selectedPartner = ref<Partner | null>(null)

// Filters
const filterType = ref<string>('all')
const filterCity = ref<string>('all')
const filterIndustry = ref<string>('all')

// Default partner for type safety
const defaultPartner: Partner = {
  id: '',
  name: '',
  type: 'individual',
  city: '',
  printer_model: '',
  materials: [],
  completed_works: 0
}

// Computed
const filteredPartners = computed(() => {
  let filtered = partners.value

  if (filterType.value !== 'all') {
    filtered = filtered.filter(p => p.type === filterType.value)
  }

  if (filterCity.value !== 'all') {
    filtered = filtered.filter(p => p.city === filterCity.value)
  }

  if (filterIndustry.value !== 'all') {
    filtered = filtered.filter(p => p.industry === filterIndustry.value)
  }

  return filtered
})

const totalWorks = computed(() => {
  return partners.value.reduce((sum, p) => sum + p.completed_works, 0)
})

const cities = computed(() => {
  return [...new Set(partners.value.map(p => p.city))].sort()
})

const industries = computed(() => {
  return [...new Set(partners.value.map(p => p.industry).filter(Boolean))].sort()
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

// Lifecycle
onMounted(async () => {
  await store.fetchPartners()
  partners.value = store.partners as Partner[]
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
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  color: $white;
  padding: $spacing-16 $spacing-4 $spacing-20;
  text-align: center;
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

  &.shape-1 {
    width: 500px;
    height: 500px;
    top: -200px;
    right: -150px;
  }

  &.shape-2 {
    width: 350px;
    height: 350px;
    bottom: -100px;
    left: -100px;
    animation-delay: 7s;
  }

  &.shape-3 {
    width: 250px;
    height: 250px;
    top: 40%;
    left: 5%;
    animation-delay: 14s;
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(40px, -40px) rotate(120deg); }
  66% { transform: translate(-30px, 30px) rotate(240deg); }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out;
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
  padding: 0.75rem 1.5rem;
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
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin-bottom: $spacing-5;
  font-weight: 900;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: $text-xl;
  line-height: $leading-relaxed;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto $spacing-10;
}

.hero-stats {
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
  padding: $spacing-5 $spacing-8;
  background: rgba($white, 0.15);
  backdrop-filter: blur(10px);
  border-radius: $border-radius-2xl;
  border: 1px solid rgba($white, 0.25);
  min-width: 140px;
}

.stat-value {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
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

// Filters Section
.filters-section {
  margin-bottom: $spacing-12;
}

.filters-header {
  margin-bottom: $spacing-6;
}

.filters-title {
  font-size: $text-2xl;
  font-weight: 800;
  color: $gray-900;
  text-align: center;
}

.filters-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-6;
  padding: $spacing-6;
  background: $white;
  border-radius: $border-radius-2xl;
  box-shadow: $shadow-md;
  border: 2px solid $gray-100;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: $text-sm;
  font-weight: 700;
  color: $gray-700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid $gray-200;
  border-radius: $border-radius-lg;
  font-size: $text-base;
  background: $gray-50;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: $gray-300;
  }

  &:focus {
    outline: none;
    border-color: $primary-teal;
    box-shadow: 0 0 0 3px rgba($primary-teal, 0.1);
    background: $white;
  }
}

// Partners Grid
.partners-section {
  margin-bottom: $spacing-16;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: $spacing-8;

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
  transition: all 0.3s ease;
  animation: fadeInScale 0.6s ease-out both;

  &:hover {
    border-color: $primary-teal;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-8px);

    .card-arrow {
      transform: translateX(5px);
    }
  }

  &:focus {
    outline: 3px solid $primary-teal;
    outline-offset: 2px;
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

.card-logo-section {
  padding: $spacing-6 $spacing-6 0;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, rgba($primary-teal, 0.03), transparent);
}

.card-logo {
  width: 100px;
  height: 100px;
  border-radius: $border-radius-xl;
  object-fit: cover;
  box-shadow: $shadow-lg;
}

.card-logo-placeholder {
  width: 100px;
  height: 100px;
  border-radius: $border-radius-xl;
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $text-2xl;
  font-weight: 800;
  box-shadow: $shadow-lg;
}

.card-content {
  padding: $spacing-6;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $spacing-3;
  margin-bottom: $spacing-3;
}

.card-name {
  font-size: $text-xl;
  font-weight: 700;
  color: $gray-900;
  margin: 0;
  line-height: 1.3;
}

.card-type-badge {
  font-size: $text-2xl;
  flex-shrink: 0;
}

.card-description {
  color: $gray-600;
  font-size: $text-sm;
  line-height: $leading-relaxed;
  margin: 0 0 $spacing-5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  margin-bottom: $spacing-5;
  padding: $spacing-4;
  background: $gray-50;
  border-radius: $border-radius-lg;
}

.detail-item {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: $spacing-2;
  align-items: center;
  font-size: $text-sm;
}

.detail-icon {
  font-size: $text-lg;
}

.detail-label {
  color: $gray-500;
  font-weight: 600;
}

.detail-value {
  color: $gray-900;
  font-weight: 600;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: $spacing-4;
  border-top: 2px solid $gray-100;
}

.completed-works {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: $text-sm;
  color: $primary-teal;
}

.works-icon {
  font-size: $text-lg;
}

.works-count {
  font-size: $text-xl;
  font-weight: 800;
}

.works-label {
  font-weight: 600;
}

.card-arrow {
  width: 32px;
  height: 32px;
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

// No Results
.no-results {
  text-align: center;
  padding: $spacing-16 $spacing-4;
}

.no-results-icon {
  font-size: 5rem;
  margin-bottom: $spacing-4;
}

.no-results h3 {
  font-size: $text-2xl;
  font-weight: 700;
  color: $gray-900;
  margin: 0 0 $spacing-3;
}

.no-results p {
  font-size: $text-base;
  color: $gray-600;
  margin: 0;
}

// CTA Section
.cta-section {
  padding: $spacing-12;
  background: linear-gradient(135deg, rgba($primary-teal, 0.06), rgba($primary-mint, 0.06));
  border-radius: $border-radius-2xl;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: $text-3xl;
  font-weight: 800;
  color: $gray-900;
  margin: 0 0 $spacing-4;
}

.cta-text {
  font-size: $text-lg;
  color: $gray-700;
  line-height: $leading-relaxed;
  margin: 0 0 $spacing-8;
}

.btn-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}
</style>




