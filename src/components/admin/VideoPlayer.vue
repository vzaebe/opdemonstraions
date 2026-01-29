<template>
  <div class="video-player">
    <div v-if="!videoId" class="video-placeholder">
      <div class="placeholder-icon">🎥</div>
      <p>Введите URL видео</p>
    </div>

    <div v-else class="video-container">
      <iframe
        v-if="platform === 'youtube'"
        :src="`https://www.youtube.com/embed/${videoId}`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="video-iframe"
      />
      <iframe
        v-else-if="platform === 'vimeo'"
        :src="`https://player.vimeo.com/video/${videoId}`"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        class="video-iframe"
      />
      <iframe
        v-else-if="platform === 'rutube'"
        :src="`https://rutube.ru/play/embed/${videoId}`"
        frameborder="0"
        allow="clipboard-write; autoplay"
        allowfullscreen
        class="video-iframe"
      />
      <div v-else class="video-error">
        ❌ Неподдерживаемая платформа видео. Поддерживаются: YouTube, Vimeo, RuTube
      </div>
    </div>

    <div v-if="showInfo && videoId" class="video-info">
      <span class="platform-badge">{{ platformName }}</span>
      <span class="video-id">ID: {{ videoId }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    url: string
    showInfo?: boolean
  }>(),
  {
    showInfo: false
  }
)

const platform = computed(() => {
  const url = props.url.toLowerCase()
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube'
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo'
  }
  if (url.includes('rutube.ru')) {
    return 'rutube'
  }
  
  return null
})

const videoId = computed(() => {
  const url = props.url
  
  if (platform.value === 'youtube') {
    // Extract YouTube ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    const videoCode = match?.[2] || null
    return videoCode && videoCode.length === 11 ? videoCode : null
  }
  
  if (platform.value === 'vimeo') {
    // Extract Vimeo ID
    const regExp = /vimeo.com\/(?:video\/)?(\d+)/
    const match = url.match(regExp)
    return match?.[1] || null
  }
  
  if (platform.value === 'rutube') {
    // Extract RuTube ID
    const regExp = /rutube.ru\/video\/([a-zA-Z0-9]+)/
    const match = url.match(regExp)
    return match?.[1] || null
  }
  
  return null
})

const platformName = computed(() => {
  switch (platform.value) {
    case 'youtube': return 'YouTube'
    case 'vimeo': return 'Vimeo'
    case 'rutube': return 'RuTube'
    default: return 'Unknown'
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.video-player {
  width: 100%;
  border-radius: $border-radius-lg;
  overflow: hidden;
  background: $gray-100;
}

.video-placeholder,
.video-error {
  aspect-ratio: 16 / 9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-3;
  color: $gray-500;
  background: $gray-50;
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.video-error {
  color: $primary-coral;
  padding: $spacing-6;
  text-align: center;
}

.video-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: black;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-3;
  background: white;
  border-top: 1px solid $gray-200;
  font-size: 0.85rem;
}

.platform-badge {
  background: $primary-teal;
  color: white;
  padding: 4px 10px;
  border-radius: $border-radius-sm;
  font-weight: 600;
}

.video-id {
  color: $gray-600;
  font-family: monospace;
}
</style>
