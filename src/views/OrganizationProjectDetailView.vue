<template>
  <div v-if="project" class="project-detail-page">
    <section class="hero">
      <div class="container">
        <div class="breadcrumb">
          <router-link :to="{ name: 'organization-projects' }">← Проекты</router-link>
        </div>
        <div class="hero-top">
          <div class="hero-icon">
            <Icon :name="projectIconName" :size="48" :title="project.title" />
          </div>
          <div class="hero-meta">
            <h1 class="hero-title">{{ project.title }}</h1>
            <div class="hero-badges">
              <span class="badge" :class="project.status">{{ getStatusText(project.status) }}</span>
              <span class="badge secondary">{{ getCategoryText(project.category) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container">
        <div class="grid">
          <div class="main">
            <img v-if="project.image" class="cover" :src="project.image" :alt="project.title" />

            <h2>О проекте</h2>
            <p class="text">
              {{ project.fullDescription || project.description }}
            </p>

            <div v-if="project.tags?.length" class="tags">
              <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>

          <aside class="aside">
            <div class="card">
              <h3>Коротко</h3>
              <div class="kv" v-if="project.participants">
                <span class="k">Участников</span>
                <span class="v">{{ project.participants }}+</span>
              </div>
              <div class="kv" v-if="project.duration">
                <span class="k">Длительность</span>
                <span class="v">{{ project.duration }}</span>
              </div>
              <div class="kv" v-if="project.location">
                <span class="k">Локация</span>
                <span class="v">{{ project.location }}</span>
              </div>
            </div>

            <div class="card">
              <h3>Связаться</h3>
              <p class="muted">
                Хотите участвовать или стать партнёром? Напишите нам — мы ответим и подскажем следующий шаг.
              </p>
              <router-link class="cta" :to="{ name: 'contacts', hash: '#contact-form' }">
                Перейти к форме
              </router-link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <div class="container">
      <h1>Проект не найден</h1>
      <router-link :to="{ name: 'organization-projects' }">Вернуться к списку проектов</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'
import { iconNameFromEmoji } from '@/utils/icon'
import { http, trackApiError } from '@/services/api/http'
import type { OrganizationProject } from '@/data/organization_projects'

const route = useRoute()

const project = ref<OrganizationProject | null>(null)

async function loadProject() {
  const slug = route.params.slug as string
  if (!slug) {
    project.value = null
    return
  }
  try {
    project.value = await http.get<OrganizationProject>(`/organization-projects/${slug}`)
  } catch (error) {
    trackApiError(error, 'OrganizationProjectDetailView.fetch')
    project.value = null
  }
}

onMounted(loadProject)
watch(() => route.params.slug, loadProject)

const projectIconName = computed(() => {
  if (!project.value) return 'target'
  return iconNameFromEmoji(project.value.icon) || 'target'
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Активный',
    completed: 'Завершен',
    planned: 'Планируется'
  }
  return statusMap[status] || status
}

const getCategoryText = (category: string) => {
  const categoryMap: Record<string, string> = {
    education: 'Образование',
    social: 'Социальные',
    events: 'Мероприятия',
    innovation: 'Инновации'
  }
  return categoryMap[category] || category
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.project-detail-page {
  min-height: 100vh;
  background: $gray-50;
}

.hero {
  background: linear-gradient(135deg, $primary-teal 0%, $primary-mint 100%);
  color: $white;
  padding: 4.5rem 0 3.5rem;
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
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
}

.hero-top {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.hero-icon {
  font-size: 3rem;
  line-height: 1;
}

.hero-title {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

.hero-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: $border-radius-full;
  font-weight: 700;
  font-size: 0.85rem;
  background: rgba($white, 0.2);
  border: 1px solid rgba($white, 0.25);

  &.secondary {
    background: rgba($white, 0.14);
  }

  &.active {
    background: rgba($success-green, 0.22);
    border-color: rgba($success-green, 0.4);
  }
  &.completed {
    background: rgba($gray-700, 0.25);
    border-color: rgba($gray-700, 0.35);
  }
  &.planned {
    background: rgba($warning-yellow, 0.22);
    border-color: rgba($warning-yellow, 0.4);
    color: $gray-900;
  }
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

.cover {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: $border-radius-2xl;
  box-shadow: $shadow-lg;
  margin-bottom: 1.5rem;
}

h2 {
  margin: 0 0 0.75rem;
  color: $gray-900;
}

.text {
  margin: 0 0 1.25rem;
  color: $gray-700;
  line-height: 1.8;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.35rem 0.7rem;
  border-radius: $border-radius-full;
  background: rgba($primary-teal, 0.12);
  color: $primary-teal;
  font-weight: 700;
  font-size: 0.85rem;
}

.card {
  background: $white;
  border-radius: $border-radius-2xl;
  padding: 1.25rem 1.25rem;
  box-shadow: $shadow-md;
  border: 1px solid $gray-200;

  & + & {
    margin-top: 1rem;
  }

  h3 {
    margin: 0 0 0.75rem;
    color: $gray-900;
    font-size: 1.1rem;
    font-weight: 800;
  }
}

.kv {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0;
  border-top: 1px dashed $gray-200;

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
}

.k {
  color: $gray-600;
  font-weight: 600;
}

.v {
  color: $gray-900;
  font-weight: 800;
  text-align: right;
}

.muted {
  color: $gray-600;
  line-height: 1.6;
  margin: 0 0 1rem;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: $border-radius-lg;
  text-decoration: none;
  font-weight: 800;
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

