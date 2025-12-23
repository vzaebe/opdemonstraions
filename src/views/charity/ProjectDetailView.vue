<template>
  <div v-if="project" class="project-detail">
    <!-- Hero Section -->
    <div class="hero" :style="{ backgroundImage: `url(${project.heroImage})` }">
      <div class="hero-overlay">
        <div class="container">
          <div class="breadcrumb">
            <router-link to="/charity/projects">← Проекты</router-link>
          </div>
          <h1 class="project-title">{{ project.title }}</h1>
          <div class="project-status-badge" :class="project.status">
            {{ getStatusLabel(project.status) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <!-- Project Info Cards -->
      <div class="info-cards">
        <div class="info-card">
          <div class="icon"><Icon name="money" :size="22" /></div>
          <div class="info-content">
            <div class="label">Бюджет проекта</div>
            <div class="value">{{ formatMoney(project.budget || 0) }}</div>
          </div>
        </div>
        <div class="info-card">
          <div class="icon"><Icon name="chart" :size="22" /></div>
          <div class="info-content">
            <div class="label">Собрано</div>
            <div class="value">{{ formatMoney(project.raised || 0) }}</div>
            <div class="progress-mini">
              <div class="fill" :style="{ width: getProgressPercent() + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="info-card">
          <div class="icon"><Icon name="users" :size="22" /></div>
          <div class="info-content">
            <div class="label">Благополучатели</div>
            <div class="value-text">{{ project.beneficiaries || 'Данные уточняются' }}</div>
          </div>
        </div>
        <div class="info-card">
          <div class="icon"><Icon name="calendar" :size="22" /></div>
          <div class="info-content">
            <div class="label">Период</div>
            <div class="value-text">
              {{ formatDate(project.startDate) }}
              <span v-if="project.endDate"> - {{ formatDate(project.endDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-btn', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          <span class="tab-icon"><Icon :name="tab.icon" :size="18" /></span>
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="getTabCount(tab.id) > 0" class="tab-count">{{ getTabCount(tab.id) }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Overview Tab -->
        <div v-if="currentTab === 'overview'" class="tab-pane">
          <div class="content-section">
            <h2>О проекте</h2>
            <p class="description">{{ project.description }}</p>
            
            <div v-if="project.impact" class="impact-section">
              <h3>Влияние проекта</h3>
              <p>{{ project.impact }}</p>
            </div>

            <div v-if="project.partners && project.partners.length > 0" class="partners-section">
              <h3>Партнёры проекта</h3>
              <ul class="partners-list">
                <li v-for="(partner, idx) in project.partners" :key="idx">
                  {{ partner }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Photos Tab -->
        <div v-if="currentTab === 'photos'" class="tab-pane">
          <div v-if="project.photos && project.photos.length > 0" class="media-grid">
            <div 
              v-for="photo in project.photos" 
              :key="photo.id"
              class="media-item"
              @click="openLightbox(photo)"
            >
              <img :src="photo.url" :alt="photo.title" />
              <div class="media-overlay">
                <h4>{{ photo.title }}</h4>
                <p v-if="photo.description">{{ photo.description }}</p>
              </div>
            </div>
          </div>
          <div v-else class="empty-tab">
            <p class="empty-row"><Icon name="camera" :size="18" /> Фотографии скоро появятся</p>
          </div>
        </div>

        <!-- Videos Tab -->
        <div v-if="currentTab === 'videos'" class="tab-pane">
          <div
            v-if="project.videos && project.videos.filter(v => isSupportedVideoEmbed(v.url)).length > 0"
            class="videos-grid"
          >
            <div 
              v-for="video in project.videos.filter(v => isSupportedVideoEmbed(v.url))" 
              :key="video.id"
              class="video-card"
            >
              <div class="video-wrapper">
                <iframe 
                  :src="video.url" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                ></iframe>
              </div>
              <div class="video-info">
                <h4>{{ video.title }}</h4>
                <p v-if="video.description">{{ video.description }}</p>
              </div>
            </div>
          </div>
          <div v-else class="empty-tab">
            <p class="empty-row"><Icon name="video" :size="18" /> Видео будет добавлено позже (сейчас мы не показываем YouTube-встраивания)</p>
          </div>
        </div>

        <!-- Reports Tab -->
        <div v-if="currentTab === 'reports'" class="tab-pane">
          <div v-if="project.reports && project.reports.length > 0" class="reports-list">
            <a 
              v-for="report in project.reports" 
              :key="report.id"
              :href="report.url"
              target="_blank"
              class="report-item"
            >
              <div class="report-icon"><Icon name="file" :size="18" /></div>
              <div class="report-content">
                <h4>{{ report.title }}</h4>
                <p v-if="report.description">{{ report.description }}</p>
              </div>
              <div class="report-action">→</div>
            </a>
          </div>
          <div v-else class="empty-tab">
            <p class="empty-row"><Icon name="file" :size="18" /> Отчёты скоро появятся</p>
          </div>
        </div>

        <!-- Video Reports Tab -->
        <div v-if="currentTab === 'video-reports'" class="tab-pane">
          <div
            v-if="project.videoReports && project.videoReports.filter(v => isSupportedVideoEmbed(v.url)).length > 0"
            class="videos-grid"
          >
            <div 
              v-for="videoReport in project.videoReports.filter(v => isSupportedVideoEmbed(v.url))" 
              :key="videoReport.id"
              class="video-card"
            >
              <div class="video-wrapper">
                <iframe 
                  :src="videoReport.url" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                ></iframe>
              </div>
              <div class="video-info">
                <h4>{{ videoReport.title }}</h4>
                <p v-if="videoReport.description">{{ videoReport.description }}</p>
              </div>
            </div>
          </div>
          <div v-else class="empty-tab">
            <p class="empty-row"><Icon name="clapper" :size="18" /> Видеоотчёты будут добавлены позже (сейчас мы не показываем YouTube-встраивания)</p>
          </div>
        </div>

        <!-- Media Links Tab -->
        <div v-if="currentTab === 'media-links'" class="tab-pane">
          <div v-if="project.mediaLinks && project.mediaLinks.length > 0" class="media-links-list">
            <a 
              v-for="(link, idx) in project.mediaLinks" 
              :key="idx"
              :href="link.url"
              target="_blank"
              class="media-link-item"
            >
              <div class="link-icon"><Icon :name="getMediaIcon(link.type)" :size="18" /></div>
              <div class="link-content">
                <h4>{{ link.title }}</h4>
                <span class="link-type">{{ getMediaTypeLabel(link.type) }}</span>
              </div>
              <div class="link-action">↗</div>
            </a>
          </div>
          <div v-else class="empty-tab">
            <p class="empty-row"><Icon name="link" :size="18" /> Упоминания в СМИ скоро появятся</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading">
    <p>Загрузка проекта...</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCharityStore } from '@/stores/charity'
import Icon from '@/components/ui/Icon.vue'

const route = useRoute()
const store = useCharityStore()

const currentTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Обзор', icon: 'file' },
  { id: 'photos', label: 'Фото', icon: 'camera' },
  { id: 'videos', label: 'Видео', icon: 'video' },
  { id: 'reports', label: 'Отчёты', icon: 'file' },
  { id: 'video-reports', label: 'Видеоотчёты', icon: 'clapper' },
  { id: 'media-links', label: 'СМИ о нас', icon: 'link' }
]

const project = computed(() => {
  const id = route.params.id as string
  return store.projects.find(p => p.id === id)
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
    month: 'long',
    day: 'numeric'
  })
}

const getProgressPercent = () => {
  if (!project.value || !project.value.budget || project.value.budget === 0) return 0
  return Math.min(Math.round(((project.value.raised || 0) / project.value.budget) * 100), 100)
}

const getTabCount = (tabId: string) => {
  if (!project.value) return 0
  
  const counts: Record<string, number> = {
    photos: project.value.photos?.length || 0,
    videos: project.value.videos?.filter(v => isSupportedVideoEmbed(v.url))?.length || 0,
    reports: project.value.reports?.length || 0,
    'video-reports': project.value.videoReports?.filter(v => isSupportedVideoEmbed(v.url))?.length || 0,
    'media-links': project.value.mediaLinks?.length || 0
  }
  
  return counts[tabId] || 0
}

const getMediaIcon = (type: string) => {
  const icons: Record<string, string> = {
    article: 'file',
    video: 'video',
    audio: 'link',
    podcast: 'link'
  }
  return icons[type] || 'link'
}

const getMediaTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    article: 'Статья',
    video: 'Видео',
    audio: 'Аудио',
    podcast: 'Подкаст'
  }
  return labels[type] || 'Ссылка'
}

const isSupportedVideoEmbed = (url: string) => {
  const u = (url || '').toLowerCase()
  // YouTube часто недоступен части аудитории; до появления альтернатив (VK Video / RuTube)
  // не показываем такие встраивания, чтобы не выглядело "сломано".
  if (u.includes('youtube.com') || u.includes('youtu.be')) return false
  return true
}

const openLightbox = (photo: any) => {
  // TODO: Implement lightbox functionality
  window.open(photo.url, '_blank')
}

onMounted(async () => {
  await store.fetchProjects()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.project-detail {
  min-height: 100vh;
  background: $gray-50;
}

.hero {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;

  @media (max-width: 768px) {
    height: 300px;
  }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  display: flex;
  align-items: flex-end;
  padding: $spacing-8 0;
}

.breadcrumb {
  margin-bottom: $spacing-4;
  
  a {
    color: $white;
    text-decoration: none;
    font-size: $text-sm;
    opacity: 0.9;
    
    &:hover {
      opacity: 1;
    }
  }
}

.project-title {
  font-size: $text-4xl;
  color: $white;
  margin: 0 0 $spacing-4;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: $text-2xl;
  }
}

.project-status-badge {
  display: inline-block;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  font-weight: 600;

  &.active {
    background: $success-green;
    color: $white;
  }

  &.completed {
    background: $gray-700;
    color: $white;
  }

  &.planned {
    background: $warning-yellow;
    color: $gray-900;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-6;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-6;
  margin-top: -80px;
  margin-bottom: $spacing-12;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    margin-top: $spacing-8;
  }
}

.info-card {
  background: $white;
  padding: $spacing-6;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-lg;
  display: flex;
  gap: $spacing-4;
  align-items: center;

  .icon {
    font-size: 2.5rem;
  }
}

.info-content {
  flex: 1;

  .label {
    font-size: $text-sm;
    color: $gray-600;
    margin-bottom: $spacing-1;
  }

  .value {
    font-size: $text-2xl;
    font-weight: 700;
    color: $gray-900;
  }

  .value-text {
    font-size: $text-base;
    color: $gray-900;
    line-height: 1.4;
  }
}

.progress-mini {
  margin-top: $spacing-2;
  height: 6px;
  background: $gray-200;
  border-radius: $border-radius-full;
  overflow: hidden;

  .fill {
    height: 100%;
    background: linear-gradient(90deg, $primary-teal, $success-green);
    transition: width 0.5s;
  }
}

.tabs-nav {
  display: flex;
  gap: $spacing-2;
  border-bottom: 2px solid $gray-200;
  margin-bottom: $spacing-8;
  overflow-x: auto;
  padding-bottom: $spacing-2;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: $gray-300;
    border-radius: $border-radius-full;
  }
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  padding: $spacing-3 $spacing-5;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: $gray-600;
  font-size: $text-base;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all $transition-fast;
  position: relative;
  top: 2px;

  &:hover {
    color: $primary-teal;
  }

  &.active {
    color: $primary-teal;
    border-bottom-color: $primary-teal;
  }
}

.tab-icon {
  font-size: $text-xl;
}

.tab-count {
  background: $primary-teal;
  color: $white;
  padding: 2px 8px;
  border-radius: $border-radius-full;
  font-size: $text-xs;
  font-weight: 600;
}

.tab-content {
  margin-bottom: $spacing-16;
}

.tab-pane {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-section {
  background: $white;
  padding: $spacing-8;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-sm;

  h2 {
    font-size: $text-2xl;
    color: $gray-900;
    margin-bottom: $spacing-6;
  }

  h3 {
    font-size: $text-xl;
    color: $gray-900;
    margin: $spacing-8 0 $spacing-4;
  }

  .description {
    font-size: $text-lg;
    line-height: 1.8;
    color: $gray-700;
  }
}

.impact-section,
.partners-section {
  margin-top: $spacing-6;
  padding-top: $spacing-6;
  border-top: 1px solid $gray-200;

  p {
    font-size: $text-base;
    line-height: 1.7;
    color: $gray-700;
  }
}

.partners-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-3;

  li {
    background: $gray-50;
    padding: $spacing-3 $spacing-4;
    border-radius: $border-radius-md;
    color: $gray-800;
  }
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-6;
}

.media-item {
  position: relative;
  border-radius: $border-radius-lg;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 4/3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-normal;
  }

  &:hover img {
    transform: scale(1.1);
  }
}

.media-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: $spacing-6 $spacing-4 $spacing-4;
  color: $white;
  transform: translateY(20px);
  opacity: 0;
  transition: all $transition-normal;

  .media-item:hover & {
    transform: translateY(0);
    opacity: 1;
  }

  h4 {
    font-size: $text-lg;
    margin: 0 0 $spacing-2;
  }

  p {
    font-size: $text-sm;
    margin: 0;
    opacity: 0.9;
  }
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: $spacing-8;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.video-card {
  background: $white;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: $shadow-md;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; // 16:9 aspect ratio
  height: 0;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.video-info {
  padding: $spacing-4;

  h4 {
    font-size: $text-lg;
    color: $gray-900;
    margin: 0 0 $spacing-2;
  }

  p {
    font-size: $text-sm;
    color: $gray-600;
    margin: 0;
    line-height: 1.6;
  }
}

.reports-list,
.media-links-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.report-item,
.media-link-item {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  padding: $spacing-5;
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  text-decoration: none;
  color: inherit;
  transition: all $transition-fast;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateX(4px);
  }
}

.report-icon,
.link-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.report-content,
.link-content {
  flex: 1;

  h4 {
    font-size: $text-lg;
    color: $gray-900;
    margin: 0 0 $spacing-2;
  }

  p {
    font-size: $text-sm;
    color: $gray-600;
    margin: 0;
    line-height: 1.5;
  }
}

.link-type {
  font-size: $text-xs;
  color: $primary-teal;
  font-weight: 600;
  text-transform: uppercase;
}

.report-action,
.link-action {
  font-size: $text-2xl;
  color: $primary-teal;
  flex-shrink: 0;
}

.empty-tab {
  text-align: center;
  padding: $spacing-16;
  color: $gray-500;

  p {
    font-size: $text-xl;
    margin: 0;
  }
}

.loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $text-xl;
  color: $gray-600;
}
</style>




