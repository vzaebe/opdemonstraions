<template>
  <div class="charity-materials">
    <UiSection>
      <h1 class="page-title">Материалы для скачивания</h1>
      <p class="page-description">
        Скачайте полезные материалы: инструкции, буклеты, презентации и другие документы
      </p>

      <div v-if="store.materials.length === 0" class="empty-state">
        <p>Материалы пока не добавлены. Скоро здесь появятся полезные файлы!</p>
      </div>

      <div v-else class="materials-list">
        <div v-for="material in store.materials" :key="material.id" class="material-card">
          <div class="material-icon">
            <svg v-if="material.type === 'pdf'" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="material.type === 'doc' || material.type === 'docx'" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="13,2 13,9 20,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="13,2 13,9 20,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="material-info">
            <h3 class="material-title">{{ material.title }}</h3>
            <p class="material-description">{{ material.description }}</p>
            <div class="material-meta">
              <span class="material-type">{{ material.type.toUpperCase() }}</span>
              <span v-if="material.size" class="material-size">{{ material.size }}</span>
              <span class="material-date">{{ formatDate(material.date) }}</span>
            </div>
          </div>
          <a :href="material.fileUrl" download class="download-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Скачать
          </a>
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
  store.fetchMaterials()
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

.materials-list {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.material-card {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  padding: $spacing-6;
  display: flex;
  align-items: center;
  gap: $spacing-6;
  transition: transform $transition-fast, box-shadow $transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.material-icon {
  flex-shrink: 0;
  color: $primary-teal;
}

.material-info {
  flex: 1;
}

.material-title {
  font-size: $text-xl;
  color: $gray-800;
  margin-bottom: $spacing-2;
  line-height: $leading-tight;
}

.material-description {
  color: $gray-600;
  line-height: $leading-relaxed;
  margin-bottom: $spacing-3;
  font-size: $text-sm;
}

.material-meta {
  display: flex;
  gap: $spacing-3;
  color: $gray-500;
  font-size: $text-sm;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
}

.material-type {
  background: $primary-orange;
  color: $white;
  padding: $spacing-1 $spacing-2;
  border-radius: $border-radius-sm;
  font-weight: 500;
}

.download-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: $spacing-2;
  background: $primary-teal;
  color: $white;
  border: none;
  padding: $spacing-3 $spacing-5;
  border-radius: $border-radius-md;
  text-decoration: none;
  font-weight: 500;
  transition: background $transition-fast;
  white-space: nowrap;

  &:hover {
    background: $primary-mint;
  }
}
</style>

