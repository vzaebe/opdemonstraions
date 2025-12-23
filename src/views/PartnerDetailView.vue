<template>
  <div v-if="partner" class="partner-detail-page">
    <section class="hero">
      <div class="container">
        <div class="breadcrumb">
          <router-link :to="{ name: 'partners' }">← Партнёры</router-link>
        </div>

        <div class="hero-content">
          <div class="logo">
            <img v-if="partner.logo" :src="getLogoUrl(partner.logo)" :alt="partner.name" />
            <div v-else class="logo-fallback">{{ getInitials(partner.name) }}</div>
          </div>

          <div class="hero-text">
            <h1 class="title">{{ partner.name }}</h1>
            <div class="meta">
              <span class="pill">🏭 {{ partner.industry }}</span>
              <span class="pill">📍 {{ partner.city }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container">
        <div class="grid">
          <div class="main">
            <h2>О партнёре</h2>
            <p class="text">{{ partner.fullDescription || partner.description }}</p>

            <h3>Вклад</h3>
            <p class="text">{{ partner.assistanceType }}</p>
          </div>

          <aside class="aside">
            <div class="card">
              <h3>Контакты</h3>

              <a v-if="partner.website" class="link" :href="partner.website" target="_blank" rel="noopener">
                🌐 Сайт
              </a>
              <a v-if="partner.email" class="link" :href="`mailto:${partner.email}`">✉️ {{ partner.email }}</a>
              <a v-if="partner.phone" class="link" :href="`tel:${partner.phone}`">📱 {{ partner.phone }}</a>
            </div>

            <div class="card">
              <h3>Сотрудничество</h3>
              <p class="muted">
                Хотите стать партнёром или задать вопрос? Заполните форму — мы свяжемся с вами.
              </p>
              <router-link class="cta" :to="{ name: 'contacts', hash: '#contact-form' }">
                Оставить заявку
              </router-link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <div class="container">
      <h1>Партнёр не найден</h1>
      <router-link :to="{ name: 'partners' }">Вернуться к списку партнёров</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { http, trackApiError } from '@/services/api/http'

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

const route = useRoute()

const partner = ref<Partner | null>(null)
const isLoading = ref(false)

async function loadPartner() {
  const id = route.params.id as string
  if (!id) {
    partner.value = null
    return
  }

  isLoading.value = true
  try {
    const list = await http.get<Partner[]>('/general-partners')
    partner.value = list.find((p) => p.id === id) ?? null
  } catch (error) {
    trackApiError(error, 'PartnerDetailView.fetchPartner')
    partner.value = null
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPartner)
watch(() => route.params.id, loadPartner)

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getLogoUrl = (logoPath: string): string => {
  if (logoPath.startsWith('http')) return logoPath
  if (logoPath.startsWith('/src/')) {
    return new URL(logoPath.replace('/src/', '../'), import.meta.url).href
  }
  return logoPath
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.partner-detail-page {
  min-height: 100vh;
  background: $gray-50;
}

.hero {
  background: linear-gradient(135deg, $primary-teal 0%, $primary-mint 100%);
  color: $white;
  padding: 4rem 0 3rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-6;
}

.breadcrumb {
  margin-bottom: 1.5rem;
  a {
    color: rgba($white, 0.9);
    text-decoration: none;
    font-weight: 700;
    &:hover {
      text-decoration: underline;
    }
  }
}

.hero-content {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.logo {
  width: 92px;
  height: 92px;
  border-radius: $border-radius-2xl;
  background: rgba($white, 0.14);
  border: 1px solid rgba($white, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: $white;
  }
}

.logo-fallback {
  font-weight: 900;
  font-size: 1.6rem;
}

.title {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
}

.meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pill {
  background: rgba($white, 0.18);
  border: 1px solid rgba($white, 0.22);
  padding: 0.35rem 0.75rem;
  border-radius: $border-radius-full;
  font-weight: 700;
  font-size: 0.9rem;
}

.content {
  padding: 2.5rem 0 4rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 2rem;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }
}

h2 {
  margin: 0 0 0.75rem;
  color: $gray-900;
}

h3 {
  margin: 1.25rem 0 0.5rem;
  color: $gray-900;
}

.text {
  margin: 0;
  color: $gray-700;
  line-height: 1.8;
}

.card {
  background: $white;
  border-radius: $border-radius-2xl;
  padding: 1.25rem;
  box-shadow: $shadow-md;
  border: 1px solid $gray-200;

  & + & {
    margin-top: 1rem;
  }

  h3 {
    margin: 0 0 0.75rem;
    font-weight: 900;
  }
}

.link {
  display: block;
  padding: 0.6rem 0.75rem;
  border-radius: $border-radius-lg;
  background: $gray-50;
  color: $gray-900;
  text-decoration: none;
  font-weight: 700;
  border: 1px solid $gray-200;
  margin-bottom: 0.5rem;

  &:hover {
    background: $gray-100;
  }
}

.muted {
  margin: 0 0 1rem;
  color: $gray-600;
  line-height: 1.6;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: $border-radius-lg;
  text-decoration: none;
  font-weight: 900;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  color: $white;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba($primary-teal, 0.3);
  }
}

.not-found {
  min-height: 70vh;
  display: flex;
  align-items: center;
}
</style>

