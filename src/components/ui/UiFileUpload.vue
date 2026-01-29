<template>
  <div class="ui-file-upload">
    <div
      class="upload-area"
      :class="{ 'is-dragover': isDragOver, 'has-files': files.length > 0 }"
      @click="openFilePicker"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        style="display: none"
        @change="handleFileSelect"
      />
      
      <div class="upload-icon">📤</div>
      <div class="upload-text">
        <p class="primary">{{ primaryText }}</p>
        <p class="secondary">{{ secondaryText }}</p>
      </div>
    </div>

    <div v-if="files.length > 0" class="files-list">
      <div v-for="(file, index) in files" :key="index" class="file-item">
        <span class="file-name">{{ file.name }}</span>
        <span class="file-size">{{ formatSize(file.size) }}</span>
        <button class="btn-remove" @click.stop="removeFile(index)">×</button>
      </div>
    </div>

    <div v-if="error" class="upload-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  primaryText?: string
  secondaryText?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: '.stl,.3mf,.obj',
  multiple: true,
  maxSize: 100 * 1024 * 1024, // 100MB
  primaryText: 'Перетащите файлы или нажмите для выбора',
  secondaryText: 'STL, 3MF, OBJ (до 100 МБ)',
})

const emit = defineEmits<{
  upload: [files: File[]]
}>()

const fileInput = ref<HTMLInputElement>()
const files = ref<File[]>([])
const isDragOver = ref(false)
const error = ref<string | null>(null)

function openFilePicker() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

function handleDrop(event: DragEvent) {
  isDragOver.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

function addFiles(newFiles: File[]) {
  error.value = null
  
  // Validate files
  const validFiles = newFiles.filter((file) => {
    if (file.size > props.maxSize) {
      error.value = `Файл ${file.name} слишком большой (макс. ${formatSize(props.maxSize)})`
      return false
    }
    return true
  })

  if (props.multiple) {
    files.value.push(...validFiles)
  } else {
    files.value = validFiles.slice(0, 1)
  }

  if (validFiles.length > 0) {
    emit('upload', validFiles)
  }
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped lang="scss">
.ui-file-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed var(--gray-300);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-8);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-fast);
  background: white;

  &:hover {
    border-color: var(--primary-teal);
    background: #f0f9ff;
  }

  &.is-dragover {
    border-color: var(--primary-teal);
    background: #e0f4ff;
  }
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-3);
}

.upload-text {
  .primary {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
  }

  .secondary {
    font-size: 0.875rem;
    color: var(--gray-500);
  }
}

.files-list {
  margin-top: var(--spacing-4);
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background: white;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-2);

  .file-name {
    flex: 1;
    font-weight: 500;
  }

  .file-size {
    color: var(--gray-500);
    font-size: 0.875rem;
  }

  .btn-remove {
    background: none;
    border: none;
    color: var(--primary-coral);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    line-height: 1;

    &:hover {
      color: #e55;
    }
  }
}

.upload-error {
  margin-top: var(--spacing-3);
  padding: var(--spacing-3);
  background: #fee;
  color: #c33;
  border-radius: var(--border-radius-md);
  font-size: 0.875rem;
}
</style>
