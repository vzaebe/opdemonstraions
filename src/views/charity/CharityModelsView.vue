<template>
  <div class="charity-models">
    <UiSection>
      <h1 class="page-title">Список моделей для 3D-печати</h1>
      <p class="page-description">
        Скачайте STL-файлы моделей для социальной 3D-печати
      </p>

      <div v-if="store.printModels.length === 0" class="empty-state">
        <p>Модели пока не добавлены. Скоро здесь появятся файлы для печати!</p>
      </div>

      <div v-else class="models-grid">
        <div v-for="model in store.printModels" :key="model.id" class="model-card">
          <div class="model-image">
            <img v-if="model.imageUrl" :src="model.imageUrl" :alt="model.name" />
            <div v-else class="image-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="model-category">{{ model.category }}</span>
          </div>
          <div class="model-content">
            <h3 class="model-name">{{ model.name }}</h3>
            <p class="model-description">{{ model.description }}</p>
            
            <div class="model-specs">
              <div v-if="model.printTime" class="spec-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>{{ model.printTime }}</span>
              </div>
              <div v-if="model.materialType" class="spec-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ model.materialType }}</span>
              </div>
            </div>

            <div class="model-footer">
              <span class="model-date">{{ formatDate(model.date) }}</span>
              <div class="model-actions">
                <a v-if="model.fileUrl" :href="model.fileUrl" download class="download-model-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Скачать
                </a>
                <button @click="openRequestModal(model)" class="request-print-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Заказать печать
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UiSection>

    <!-- Request Modal -->
    <transition name="modal-fade">
      <div v-if="showRequestModal" class="modal-overlay" @click="closeRequestModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h2>Заявка на печать: {{ selectedModel?.name }}</h2>
            <button @click="closeRequestModal" class="modal-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-info">
              <p>Вы заказываете печать модели:</p>
              <div class="model-preview">
                <img v-if="selectedModel?.imageUrl" :src="selectedModel.imageUrl" :alt="selectedModel.name" />
                <div>
                  <strong>{{ selectedModel?.name }}</strong>
                  <p>{{ selectedModel?.description }}</p>
                  <div class="model-meta">
                    <span v-if="selectedModel?.printTime">⏱️ {{ selectedModel.printTime }}</span>
                    <span v-if="selectedModel?.materialType">📦 {{ selectedModel.materialType }}</span>
                  </div>
                </div>
              </div>
            </div>
            <CharityRequestForm 
              :initial-model-link="selectedModel?.fileUrl || ''"
              :initial-wish="selectedModel?.name || ''"
              :initial-comment="`Категория: ${selectedModel?.category}. ${selectedModel?.description}`"
              @success="handleRequestSuccess"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import CharityRequestForm from '@/components/charity/RequestForm.vue'

interface PrintModel {
  id: string
  name: string
  description: string
  category: string
  fileUrl?: string
  imageUrl?: string
  printTime?: string
  materialType?: string
  date: string
}

const store = useCharityStore()
const showRequestModal = ref(false)
const selectedModel = ref<PrintModel | null>(null)

onMounted(() => {
  store.fetchPrintModels()
})

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function openRequestModal(model: PrintModel) {
  selectedModel.value = model
  showRequestModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeRequestModal() {
  showRequestModal.value = false
  selectedModel.value = null
  document.body.style.overflow = ''
}

function handleRequestSuccess() {
  setTimeout(() => {
    closeRequestModal()
  }, 2000)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use 'sass:color';

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

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-6;
  max-width: 1200px;
  margin: 0 auto;
}

.model-card {
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

.model-image {
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

.image-placeholder {
  color: $gray-400;
}

.model-category {
  position: absolute;
  top: $spacing-3;
  right: $spacing-3;
  background: $primary-orange;
  color: $white;
  padding: $spacing-1 $spacing-3;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  font-weight: 500;
}

.model-content {
  padding: $spacing-6;
}

.model-name {
  font-size: $text-xl;
  color: $gray-800;
  margin-bottom: $spacing-3;
  line-height: $leading-tight;
}

.model-description {
  color: $gray-600;
  line-height: $leading-relaxed;
  margin-bottom: $spacing-4;
  font-size: $text-sm;
}

.model-specs {
  display: flex;
  gap: $spacing-4;
  margin-bottom: $spacing-4;
  flex-wrap: wrap;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  color: $gray-600;
  font-size: $text-sm;

  svg {
    color: $primary-teal;
  }
}

.model-footer {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  padding-top: $spacing-4;
  border-top: 1px solid $gray-100;
}

.model-date {
  color: $gray-500;
  font-size: $text-sm;
}

.model-actions {
  display: flex;
  gap: $spacing-2;
  flex-wrap: wrap;
}

.download-model-btn {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  background: $primary-teal;
  color: $white;
  border: none;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-md;
  text-decoration: none;
  font-weight: 500;
  font-size: $text-sm;
  transition: all $transition-fast;
  flex: 1;
  justify-content: center;
  min-width: 120px;

  &:hover {
    background: $primary-mint;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($primary-teal, 0.3);
  }
}

.request-print-btn {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  background: $primary-orange;
  color: $white;
  border: none;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-md;
  font-weight: 500;
  font-size: $text-sm;
  cursor: pointer;
  transition: all $transition-fast;
  flex: 1;
  justify-content: center;
  min-width: 140px;

  &:hover {
    background: color.adjust($primary-orange, $lightness: -5%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($primary-orange, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

// Modal Styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-4;
  overflow-y: auto;
}

.modal-container {
  background: $white;
  border-radius: $border-radius-lg;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-6;
  border-bottom: 1px solid $gray-200;
  position: sticky;
  top: 0;
  background: $white;
  z-index: 10;

  h2 {
    margin: 0;
    font-size: $text-2xl;
    color: $primary-teal;
  }
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: $spacing-2;
  color: $gray-600;
  transition: all $transition-fast;
  border-radius: $border-radius-sm;

  &:hover {
    background: $gray-100;
    color: $gray-900;
  }
}

.modal-body {
  padding: $spacing-6;
}

.modal-info {
  margin-bottom: $spacing-6;
  padding: $spacing-4;
  background: $gray-50;
  border-radius: $border-radius-md;
  border-left: 4px solid $primary-orange;

  p {
    margin: 0 0 $spacing-3 0;
    color: $gray-700;
    font-weight: 500;
  }
}

.model-preview {
  display: flex;
  gap: $spacing-4;
  align-items: start;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: $border-radius-md;
    flex-shrink: 0;
  }

  div {
    flex: 1;
  }

  strong {
    display: block;
    color: $primary-teal;
    font-size: $text-lg;
    margin-bottom: $spacing-2;
  }

  p {
    margin: 0 0 $spacing-2 0;
    color: $gray-600;
    font-size: $text-sm;
    line-height: $leading-relaxed;
  }
}

.model-meta {
  display: flex;
  gap: $spacing-3;
  font-size: $text-sm;
  color: $gray-500;
  margin-top: $spacing-2;

  span {
    display: flex;
    align-items: center;
    gap: $spacing-1;
  }
}

// Modal Animation
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 768px) {
  .model-footer {
    gap: $spacing-2;
  }

  .model-actions {
    flex-direction: column;
  }

  .download-model-btn,
  .request-print-btn {
    width: 100%;
    min-width: auto;
  }

  .modal-container {
    max-height: 95vh;
    margin: $spacing-2;
  }

  .modal-header {
    padding: $spacing-4;

    h2 {
      font-size: $text-xl;
    }
  }

  .modal-body {
    padding: $spacing-4;
  }

  .model-preview {
    flex-direction: column;

    img {
      width: 100%;
      height: 200px;
    }
  }
}
</style>

