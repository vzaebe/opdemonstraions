<template>
  <div class="image-gallery-manager">
    <div class="gallery-header">
      <h3 class="gallery-title">{{ title }}</h3>
      <button class="btn-add" @click="showAddDialog = true" type="button">
        + Добавить изображение
      </button>
    </div>

    <div v-if="images.length === 0" class="empty-state">
      <div class="empty-icon">🖼️</div>
      <p>Нет изображений</p>
      <button class="btn-primary" @click="showAddDialog = true" type="button">
        Добавить первое изображение
      </button>
    </div>

    <div v-else class="gallery-grid">
      <div 
        v-for="(image, index) in images" 
        :key="index"
        class="gallery-item"
      >
        <div class="image-wrapper">
          <img :src="image.url" :alt="image.caption || 'Image'" />
          <div class="image-overlay">
            <button 
              class="overlay-btn btn-edit" 
              @click="editImage(index)"
              type="button"
              title="Редактировать"
            >
              ✏️
            </button>
            <button 
              class="overlay-btn btn-delete" 
              @click="deleteImage(index)"
              type="button"
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        </div>
        <div v-if="image.caption" class="image-caption">
          {{ image.caption }}
        </div>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <Teleport to="body">
      <div v-if="showAddDialog || editingIndex !== null" class="dialog-overlay" @click.self="closeDialog">
        <div class="dialog">
          <div class="dialog-header">
            <h3>{{ editingIndex !== null ? 'Редактировать изображение' : 'Добавить изображение' }}</h3>
            <button class="btn-close" @click="closeDialog" type="button">✕</button>
          </div>
          
          <div class="dialog-body">
            <div class="form-group">
              <label>URL изображения *</label>
              <input 
                v-model="formData.url" 
                type="url" 
                class="input"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div class="form-group">
              <label>Описание</label>
              <input 
                v-model="formData.caption" 
                type="text"
                class="input"
                placeholder="Описание изображения (опционально)"
              />
            </div>

            <div v-if="formData.url" class="form-group">
              <label>Превью</label>
              <div class="preview-box">
                <img :src="formData.url" alt="Preview" @error="imageError = true" @load="imageError = false" />
                <div v-if="imageError" class="error-message">
                  ❌ Не удалось загрузить изображение
                </div>
              </div>
            </div>
          </div>

          <div class="dialog-footer">
            <button class="btn-secondary" @click="closeDialog" type="button">
              Отмена
            </button>
            <button 
              class="btn-primary" 
              @click="saveImage" 
              :disabled="!formData.url || imageError"
              type="button"
            >
              {{ editingIndex !== null ? 'Сохранить' : 'Добавить' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface GalleryImage {
  url: string
  caption?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: GalleryImage[]
    title?: string
  }>(),
  {
    title: 'Галерея изображений'
  }
)

const emit = defineEmits<{
  'update:modelValue': [images: GalleryImage[]]
}>()

const images = ref<GalleryImage[]>([...props.modelValue])
const showAddDialog = ref(false)
const editingIndex = ref<number | null>(null)
const imageError = ref(false)

const formData = ref<GalleryImage>({
  url: '',
  caption: ''
})

function editImage(index: number) {
  editingIndex.value = index
  const current = images.value[index]
  if (!current) {
    closeDialog()
    return
  }
  formData.value = {
    url: current.url,
    caption: current.caption || ''
  }
  imageError.value = false
}

function deleteImage(index: number) {
  if (confirm('Удалить это изображение?')) {
    images.value.splice(index, 1)
    emit('update:modelValue', images.value)
  }
}

function saveImage() {
  if (!formData.value.url || imageError.value) return

  if (editingIndex.value !== null) {
    // Edit existing
    images.value[editingIndex.value] = {
      url: formData.value.url,
      caption: formData.value.caption || ''
    }
  } else {
    // Add new
    images.value.push({
      url: formData.value.url,
      caption: formData.value.caption || ''
    })
  }

  emit('update:modelValue', images.value)
  closeDialog()
}

function closeDialog() {
  showAddDialog.value = false
  editingIndex.value = null
  formData.value = { url: '', caption: '' }
  imageError.value = false
}
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/assets/styles/variables.scss' as *;

.image-gallery-manager {
  background: white;
  border-radius: $border-radius-lg;
  padding: $spacing-6;
  box-shadow: $shadow-sm;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-6;
}

.gallery-title {
  font-size: $text-lg;
  font-weight: 600;
  color: $gray-900;
  margin: 0;
}

.btn-add {
  background: $primary-teal;
  color: white;
  border: none;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-md;
  cursor: pointer;
  font-weight: 600;
  transition: all $transition-fast;

  &:hover {
    background: color.adjust($primary-teal, $lightness: -5%);
    transform: translateY(-1px);
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-8;
  color: $gray-500;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: $spacing-4;
  opacity: 0.5;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-4;
}

.gallery-item {
  background: $gray-50;
  border-radius: $border-radius-md;
  overflow: hidden;
  transition: all $transition-fast;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);

    .image-overlay {
      opacity: 1;
    }
  }
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 Aspect Ratio */
  background: $gray-100;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;
  opacity: 0;
  transition: opacity $transition-fast;
}

.overlay-btn {
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    transform: scale(1.1);
  }

  &.btn-delete:hover {
    background: $primary-coral;
  }
}

.image-caption {
  padding: $spacing-3;
  font-size: 0.9rem;
  color: $gray-700;
  text-align: center;
}

// Dialog styles
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-4;
}

.dialog {
  background: white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-xl;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
}

.dialog-header {
  padding: $spacing-6;
  border-bottom: 1px solid $gray-200;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: $text-xl;
    color: $gray-900;
  }
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: $gray-400;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-sm;
  transition: all $transition-fast;

  &:hover {
    background: $gray-100;
    color: $gray-900;
  }
}

.dialog-body {
  padding: $spacing-6;
}

.form-group {
  margin-bottom: $spacing-4;

  label {
    display: block;
    margin-bottom: $spacing-2;
    font-weight: 600;
    color: $gray-700;
    font-size: 0.9rem;
  }
}

.input {
  width: 100%;
  padding: $spacing-3;
  border: 1px solid $gray-300;
  border-radius: $border-radius-md;
  font-size: 1rem;
  transition: all $transition-fast;

  &:focus {
    outline: none;
    border-color: $primary-teal;
    box-shadow: 0 0 0 3px rgba($primary-teal, 0.1);
  }
}

.preview-box {
  border: 2px dashed $gray-300;
  border-radius: $border-radius-md;
  padding: $spacing-4;
  text-align: center;

  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: $border-radius-sm;
  }
}

.error-message {
  color: $primary-coral;
  margin-top: $spacing-2;
}

.dialog-footer {
  padding: $spacing-6;
  border-top: 1px solid $gray-200;
  display: flex;
  justify-content: flex-end;
  gap: $spacing-3;
}

.btn-primary,
.btn-secondary {
  padding: $spacing-3 $spacing-6;
  border-radius: $border-radius-md;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all $transition-fast;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: $primary-teal;
  color: white;

  &:not(:disabled):hover {
    background: color.adjust($primary-teal, $lightness: -5%);
    transform: translateY(-1px);
  }
}

.btn-secondary {
  background: $gray-200;
  color: $gray-700;

  &:hover {
    background: $gray-300;
  }
}
</style>
