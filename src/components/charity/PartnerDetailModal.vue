<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <button class="modal-close" @click="closeModal" aria-label="Закрыть">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="modal-content">
            <!-- Partner Header -->
            <div class="partner-header">
              <div class="partner-logo-wrapper">
                <img 
                  v-if="partner.logo" 
                  :src="partner.logo" 
                  :alt="partner.name"
                  class="partner-logo"
                />
                <div v-else class="partner-logo-placeholder">
                  {{ getInitials(partner.name) }}
                </div>
              </div>
              <div class="partner-header-info">
                <h2 class="partner-name">{{ partner.name }}</h2>
                <div class="partner-meta">
                  <span class="partner-type-badge" :class="partner.type">
                    {{ partner.type === 'company' ? '🏢 Компания' : '👤 Частное лицо' }}
                  </span>
                  <span class="partner-location">📍 {{ partner.city }}</span>
                </div>
              </div>
            </div>

            <!-- Stats Bar -->
            <div class="stats-bar">
              <div class="stat-item">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                  <div class="stat-value">{{ partner.completed_works }}</div>
                  <div class="stat-label">Работ выполнено</div>
                </div>
              </div>
              <div v-if="partner.foundedYear" class="stat-item">
                <div class="stat-icon">📅</div>
                <div class="stat-content">
                  <div class="stat-value">{{ new Date().getFullYear() - partner.foundedYear }}</div>
                  <div class="stat-label">Лет опыта</div>
                </div>
              </div>
            </div>

            <!-- Key Information -->
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-header">
                  <div class="info-icon">🏭</div>
                  <h3>Отрасль</h3>
                </div>
                <p>{{ partner.industry || 'Не указана' }}</p>
              </div>

              <div class="info-card">
                <div class="info-card-header">
                  <div class="info-icon">🤝</div>
                  <h3>Вид помощи</h3>
                </div>
                <p>{{ partner.assistanceType || 'Не указан' }}</p>
              </div>
            </div>

            <!-- Full Description -->
            <div class="description-section">
              <h3 class="section-title">
                <span class="section-icon">📖</span>
                О партнёре
              </h3>
              <p class="description-text">
                {{ partner.fullDescription || partner.about || 'Описание не указано' }}
              </p>
            </div>

            <!-- Technical Details -->
            <div class="tech-section">
              <h3 class="section-title">
                <span class="section-icon">🔧</span>
                Техническая информация
              </h3>
              <div class="tech-grid">
                <div class="tech-item">
                  <div class="tech-label">Оборудование</div>
                  <div class="tech-value">{{ partner.printer_model }}</div>
                </div>
                <div class="tech-item">
                  <div class="tech-label">Материалы</div>
                  <div class="materials-list">
                    <span 
                      v-for="material in (partner.materials || partner.capabilities || [])" 
                      :key="material" 
                      class="material-tag"
                    >
                      {{ material }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="contact-section">
              <h3 class="section-title">
                <span class="section-icon">📞</span>
                Контактная информация
              </h3>
              <div class="contact-grid">
                <a v-if="partner.email" :href="`mailto:${partner.email}`" class="contact-item">
                  <div class="contact-icon">✉️</div>
                  <div class="contact-text">{{ partner.email }}</div>
                </a>
                <a v-if="partner.phone" :href="`tel:${partner.phone}`" class="contact-item">
                  <div class="contact-icon">📱</div>
                  <div class="contact-text">{{ partner.phone }}</div>
                </a>
                <a v-if="partner.website" :href="partner.website" target="_blank" rel="noopener" class="contact-item">
                  <div class="contact-icon">🌐</div>
                  <div class="contact-text">{{ partner.website }}</div>
                </a>
                <div v-if="partner.contact" class="contact-item">
                  <div class="contact-icon">💬</div>
                  <div class="contact-text">{{ partner.contact }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'

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

interface Props {
  isOpen: boolean
  partner: Partner
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const closeModal = () => {
  emit('close')
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Handle ESC key
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: $spacing-4;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  background: $white;
  border-radius: $border-radius-2xl;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  margin: auto;
}

.modal-close {
  position: absolute;
  top: $spacing-4;
  right: $spacing-4;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba($gray-900, 0.05);
  border-radius: $border-radius-full;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;

  svg {
    width: 24px;
    height: 24px;
    color: $gray-600;
  }

  &:hover {
    background: rgba($gray-900, 0.1);
    transform: scale(1.05);
  }
}

.modal-content {
  padding: $spacing-8;

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-6;
  }
}

.partner-header {
  display: flex;
  align-items: center;
  gap: $spacing-6;
  margin-bottom: $spacing-8;
  padding-bottom: $spacing-6;
  border-bottom: 2px solid $gray-100;
}

.partner-logo-wrapper {
  flex-shrink: 0;
}

.partner-logo {
  width: 100px;
  height: 100px;
  border-radius: $border-radius-xl;
  object-fit: cover;
  box-shadow: $shadow-lg;
}

.partner-logo-placeholder {
  width: 100px;
  height: 100px;
  border-radius: $border-radius-xl;
  background: linear-gradient(135deg, #9061f9, #c084fc);
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $text-3xl;
  font-weight: 800;
  box-shadow: $shadow-lg;
}

.partner-header-info {
  flex: 1;
}

.partner-name {
  font-size: $text-3xl;
  font-weight: 800;
  color: $gray-900;
  margin: 0 0 $spacing-3;
}

.partner-meta {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  flex-wrap: wrap;
}

.partner-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  font-weight: 600;
  background: $gray-100;
  color: $gray-700;

  &.company {
    background: rgba(#14b8a6, 0.1);
    color: #14b8a6;
  }

  &.individual {
    background: rgba(#9061f9, 0.1);
    color: #9061f9;
  }
}

.partner-location {
  color: $gray-600;
  font-size: $text-base;
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: $spacing-4;
  margin-bottom: $spacing-8;
  padding: $spacing-6;
  background: linear-gradient(135deg, rgba(#9061f9, 0.05), rgba(#14b8a6, 0.05));
  border-radius: $border-radius-xl;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: $spacing-3;
}

.stat-icon {
  font-size: $text-3xl;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: $text-2xl;
  font-weight: 800;
  color: $gray-900;
  line-height: 1;
}

.stat-label {
  font-size: $text-xs;
  color: $gray-600;
  margin-top: 0.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-6;
  margin-bottom: $spacing-8;
}

.info-card {
  padding: $spacing-6;
  background: $white;
  border: 2px solid $gray-100;
  border-radius: $border-radius-xl;
  transition: all 0.3s;

  &:hover {
    border-color: $primary-teal;
    box-shadow: $shadow-md;
  }
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  margin-bottom: $spacing-3;

  h3 {
    font-size: $text-lg;
    font-weight: 700;
    color: $gray-900;
    margin: 0;
  }
}

.info-icon {
  font-size: $text-2xl;
}

.info-card p {
  color: $gray-700;
  font-size: $text-base;
  line-height: $leading-relaxed;
  margin: 0;
}

.description-section,
.tech-section,
.contact-section {
  margin-bottom: $spacing-8;
}

.section-title {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  font-size: $text-xl;
  font-weight: 700;
  color: $gray-900;
  margin: 0 0 $spacing-4;
}

.section-icon {
  font-size: $text-2xl;
}

.description-text {
  color: $gray-700;
  font-size: $text-base;
  line-height: $leading-relaxed;
  margin: 0;
}

.tech-grid {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.tech-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
}

.tech-label {
  font-size: $text-sm;
  font-weight: 700;
  color: $gray-600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tech-value {
  font-size: $text-base;
  color: $gray-900;
  font-weight: 500;
}

.materials-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
}

.material-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: $gray-100;
  color: $gray-700;
  border-radius: $border-radius-lg;
  font-size: $text-sm;
  font-weight: 600;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-4;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  padding: $spacing-4;
  background: $gray-50;
  border-radius: $border-radius-lg;
  text-decoration: none;
  color: $gray-900;
  transition: all 0.3s;

  &:hover {
    background: $gray-100;
    transform: translateY(-2px);
    box-shadow: $shadow-sm;
  }
}

.contact-icon {
  font-size: $text-2xl;
  flex-shrink: 0;
}

.contact-text {
  font-size: $text-sm;
  font-weight: 500;
  word-break: break-word;
}

// Modal Transition
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .modal-container {
    transition: transform 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.9) translateY(20px);
  }
}
</style>

