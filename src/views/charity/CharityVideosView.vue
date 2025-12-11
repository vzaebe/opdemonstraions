<template>
  <div class="charity-videos">
    <UiSection>
      <h1 class="page-title">Видео</h1>
      <p class="page-description">
        Смотрите видео о нашей работе, мастер-классы по 3D-печати и истории наших подопечных
      </p>

      <div v-if="store.videos.length === 0" class="empty-state">
        <p>Видео пока не добавлены. Скоро здесь появятся интересные материалы!</p>
      </div>

      <div v-else class="videos-grid">
        <div v-for="video in store.videos" :key="video.id" class="video-card">
          <div class="video-thumbnail">
            <img v-if="video.thumbnail" :src="video.thumbnail" :alt="video.title" />
            <div v-else class="thumbnail-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3L19 12L5 21V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span v-if="video.duration" class="video-duration">{{ video.duration }}</span>
          </div>
          <div class="video-content">
            <h3 class="video-title">{{ video.title }}</h3>
            <p class="video-description">{{ video.description }}</p>
            <div class="video-meta">
              <span class="video-date">{{ formatDate(video.date) }}</span>
            </div>
            <a :href="video.url" target="_blank" class="watch-btn">Смотреть</a>
          </div>
        </div>
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'

const store = useCharityStore()

onMounted(() => {
  store.fetchVideos()
})

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.page-title {
  font-size: $text-3xl;
  text-align: center;
  margin-bottom: $spacing-4;
  color: $primary-teal;
}

.page-description {
  text-align: center;
  color: $gray-600;
  margin-bottom: $spacing-8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.empty-state {
  text-align: center;
  padding: $spacing-12;
  color: $gray-500;
  font-size: $text-lg;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $spacing-6;
  max-width: 1200px;
  margin: 0 auto;
}

.video-card {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;
  transition: transform $transition-fast, box-shadow $transition-fast;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  background: $gray-100;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.thumbnail-placeholder {
  color: $gray-400;
}

.video-duration {
  position: absolute;
  bottom: $spacing-2;
  right: $spacing-2;
  background: rgba(0, 0, 0, 0.8);
  color: $white;
  padding: $spacing-1 $spacing-2;
  border-radius: $border-radius-sm;
  font-size: $text-sm;
}

.video-content {
  padding: $spacing-6;
}

.video-title {
  font-size: $text-xl;
  color: $gray-800;
  margin-bottom: $spacing-3;
  line-height: $leading-tight;
}

.video-description {
  color: $gray-600;
  line-height: $leading-relaxed;
  margin-bottom: $spacing-4;
  font-size: $text-sm;
}

.video-meta {
  color: $gray-500;
  font-size: $text-sm;
  margin-bottom: $spacing-4;
}

.watch-btn {
  display: inline-block;
  background: $primary-teal;
  color: $white;
  border: none;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-md;
  text-decoration: none;
  font-weight: 500;
  transition: background $transition-fast;

  &:hover {
    background: $primary-mint;
  }
}
</style>

