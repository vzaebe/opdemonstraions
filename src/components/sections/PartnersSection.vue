<template>
  <!-- Секция с генеральными партнерами -->
  <UiSection class="partners-section" :padding="'py-24'" :background="''">
    <!-- Контейнер секции -->
    <div class="partners-container">
      <!-- Заголовок секции -->
      <div class="partners-header">
        <h2 class="partners-title">Наши партнеры</h2>
        <p class="partners-subtitle">
          Организации, которые сотрудничают с нами в области профориентации и интеграции молодежи из незащищённых слоёв населения в производство
        </p>
        <UiButton class="partners-link" variant="ghost" :to="{ name: 'partners' }">
          <span>Узнать больше о партнёрах</span>
          <UiIcon name="arrow-right" :size="20" aria-hidden="true" />
        </UiButton>
      </div>

      <!-- Сетка логотипов партнеров -->
      <div class="partners-grid">
        <UiButton
          v-for="partner in displayedPartners"
          :key="String(partner.id)"
          class="partner-card"
          variant="ghost"
          :to="{ name: 'partner-detail', params: { id: String(partner.id) } }"
          :aria-label="partner.name"
        >
          <div class="partner-logo-container">
            <img
              v-if="partner.logo"
              class="partner-logo"
              :src="resolveApiAssetUrl(partner.logo)"
              :alt="partner.name"
              loading="lazy"
            />
            <span v-else class="partner-text">{{ getInitials(partner.name) }}</span>
          </div>
        </UiButton>
      </div>
    </div>
  </UiSection>
</template>

<script lang="ts">
export default {
  name: 'PartnersSection'
}
</script>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import UiSection from '../ui/Section.vue'
import { http, trackApiError } from '../../services/api/http'
import { UiButton } from '../../ui'
import UiIcon from '../ui/Icon.vue'
import { resolveApiAssetUrl } from '../../utils/apiAssets'

type Partner = {
  id: string | number
  name: string
  logo?: string
}

const partners = ref<Partner[]>([])

const displayedPartners = computed(() => partners.value.slice(0, 6))

function getInitials(name: string): string {
  return (name || '')
    .split(' ')
    .map((w) => (w ? w[0] : ''))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

onMounted(async () => {
  try {
    partners.value = await http.get<Partner[]>('/general-partners')
  } catch (error) {
    trackApiError(error, 'PartnersSection.fetchPartners')
    partners.value = []
  }
})
</script>

<style lang="scss" scoped>
.partners-section {
  width: 100%;
  max-width: 100vw;
  min-height: 800px;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 50%, rgba(29, 233, 182, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 20%, rgba(24, 255, 255, 0.1) 0%, transparent 50%);
    animation: float 6s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-20px, -20px) rotate(1deg);
  }
}

.partners-container {
  width: 100%;
  max-width: $container-width;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
}

.partners-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  max-width: 800px;
}

.partners-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $white;
  margin: 0;
}

.partners-subtitle {
  opacity: $opacity-70;
  font-size: $text-lg;
  font-weight: 500;
  line-height: $leading-7;
  color: $white;
  margin: 0 0 2rem;
}

.partners-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: rgba($white, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba($white, 0.3);
  border-radius: $border-radius-full;
  color: $white;
  font-weight: 600;
  font-size: $text-base;
  text-decoration: none;
  transition: all 0.3s ease;

  :deep(.ui-icon) {
    transition: transform 0.3s ease;
  }

  &:hover {
    background: rgba($white, 0.25);
    border-color: rgba($white, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

    :deep(.ui-icon) {
      transform: translateX(5px);
    }
  }
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  width: 100%;
  max-width: 1000px;
}

.partner-card {
  width: 100%;
  height: 160px;
  text-decoration: none;
  padding: 0;
  border: 2px solid $white;
  border-radius: $border-radius;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05) translateY(-5px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(29, 233, 182, 0.1));
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    border-color: $primary-cyan;
  }
}

.partner-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
}

/* Alternate hover accents per card */
.partner-card:nth-child(odd):hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(203, 136, 22, 0.1));
  border-color: $primary-orange;
}

.partner-card:nth-child(even):hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 82, 82, 0.1));
  border-color: $primary-coral;
}

.partner-logo {
  max-width: 180px;
  max-height: 120px;
  width: auto;
  height: auto;
  min-width: 0;
  min-height: 0;
  object-fit: contain;
  object-position: center;
  filter: brightness(0) invert(1);
  display: block;
  flex-shrink: 1;
}

.partner-text {
  font-size: 3rem;
  font-weight: 700;
  color: $white;
  text-align: center;
  letter-spacing: 0.1em;
}

@media (max-width: $breakpoint-lg) {
  .partners-section {
    padding: 5rem 2rem;
  }

  .partners-container {
    gap: 3rem;
  }

  .partners-header {
    gap: 1.5rem;
  }

  .partners-title {
    font-size: $text-4xl;
  }

  .partners-subtitle {
    font-size: $text-base;
  }

  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .partner-card {
    height: 140px;
  }

  .partner-logo {
    max-width: 160px;
    max-height: 100px;
  }

  .partner-text {
    font-size: 2.5rem;
  }
}

@media (max-width: $breakpoint-md) {
  .partners-section {
    padding: 4rem 1rem;
  }

  .partners-container {
    gap: 2.5rem;
  }

  .partners-grid {
    gap: 1.5rem;
  }

  .partner-card {
    height: 120px;
  }

  .partner-logo-container {
    padding: 1rem;
  }

  .partner-logo {
    max-width: 140px;
    max-height: 90px;
  }

  .partner-text {
    font-size: 2rem;
  }
}

@media (max-width: $breakpoint-sm) {
  .partners-grid {
    grid-template-columns: 1fr;
  }

  .partners-title {
    font-size: $text-3xl;
  }

  .partner-card {
    height: 100px;
  }

  .partner-logo-container {
    padding: 0.75rem;
  }

  .partner-logo {
    max-width: 120px;
    max-height: 70px;
  }

  .partner-text {
    font-size: 1.5rem;
  }
}
</style>
