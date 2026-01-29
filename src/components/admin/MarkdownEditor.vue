<template>
  <div class="markdown-editor">
    <div class="editor-header">
      <div class="editor-tabs">
        <button 
          :class="['tab', { active: activeTab === 'edit' }]"
          @click="activeTab = 'edit'"
          type="button"
        >
          ✏️ Редактор
        </button>
        <button 
          :class="['tab', { active: activeTab === 'preview' }]"
          @click="activeTab = 'preview'"
          type="button"
        >
          👁️ Превью
        </button>
        <button 
          :class="['tab', { active: activeTab === 'split' }]"
          @click="activeTab = 'split'"
          type="button"
        >
          ⚡ Оба
        </button>
      </div>
      <div class="editor-toolbar">
        <button @click="insertFormat('**', '**')" type="button" title="Жирный">
          <strong>B</strong>
        </button>
        <button @click="insertFormat('*', '*')" type="button" title="Курсив">
          <em>I</em>
        </button>
        <button @click="insertFormat('# ', '')" type="button" title="Заголовок">
          H
        </button>
        <button @click="insertFormat('[', '](url)')" type="button" title="Ссылка">
          🔗
        </button>
        <button @click="insertFormat('![', '](url)')" type="button" title="Изображение">
          🖼️
        </button>
        <button @click="insertFormat('\n```\n', '\n```\n')" type="button" title="Код">
          &lt;/&gt;
        </button>
        <button @click="insertFormat('- ', '')" type="button" title="Список">
          ≡
        </button>
      </div>
    </div>

    <div class="editor-body" :class="`layout-${activeTab}`">
      <div v-show="activeTab === 'edit' || activeTab === 'split'" class="editor-pane">
        <textarea
          ref="textareaRef"
          v-model="localValue"
          class="markdown-textarea"
          :placeholder="placeholder"
          @input="onInput"
        />
      </div>
      
      <div v-show="activeTab === 'preview' || activeTab === 'split'" class="preview-pane">
        <div class="markdown-content" v-html="renderedHtml" />
      </div>
    </div>

    <div class="editor-footer">
      <span class="char-count">{{ localValue.length }} символов</span>
      <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" class="help-link">
        ℹ️ Справка по Markdown
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
  }>(),
  {
    placeholder: 'Введите текст в формате Markdown...'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeTab = ref<'edit' | 'preview' | 'split'>('edit')
const localValue = ref(props.modelValue || '')
const textareaRef = ref<HTMLTextAreaElement>()

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal || ''
})

const renderedHtml = computed(() => {
  return parseMarkdown(localValue.value)
})

function onInput() {
  emit('update:modelValue', localValue.value)
}

function insertFormat(before: string, after: string) {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = localValue.value.substring(start, end)
  const replacement = before + (selectedText || 'текст') + after

  localValue.value = 
    localValue.value.substring(0, start) +
    replacement +
    localValue.value.substring(end)

  emit('update:modelValue', localValue.value)

  // Restore focus and selection
  setTimeout(() => {
    textarea.focus()
    const newPos = start + before.length + (selectedText || 'текст').length
    textarea.setSelectionRange(newPos, newPos)
  }, 0)
}

// Simple Markdown parser (you can replace with marked.js or similar)
function parseMarkdown(md: string): string {
  let html = md

  // Escape HTML
  html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')

  // Code blocks
  html = html.replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')

  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>')

  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  // Line breaks
  html = html.replace(/\n/gim, '<br />')

  return html
}
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/assets/styles/variables.scss' as *;

.markdown-editor {
  border: 1px solid $gray-200;
  border-radius: $border-radius-lg;
  overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column;
}

.editor-header {
  background: $gray-50;
  border-bottom: 1px solid $gray-200;
  padding: $spacing-3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-4;
}

.editor-tabs {
  display: flex;
  gap: $spacing-2;
}

.tab {
  background: none;
  border: none;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-sm;
  cursor: pointer;
  font-size: 0.9rem;
  color: $gray-600;
  transition: all $transition-fast;

  &:hover {
    background: $gray-100;
    color: $gray-900;
  }

  &.active {
    background: $primary-teal;
    color: white;
  }
}

.editor-toolbar {
  display: flex;
  gap: $spacing-1;
  flex-wrap: wrap;

  button {
    background: white;
    border: 1px solid $gray-300;
    padding: 6px 10px;
    border-radius: $border-radius-sm;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all $transition-fast;
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: $gray-100;
      border-color: $primary-teal;
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.editor-body {
  display: grid;
  min-height: 400px;
  flex: 1;

  &.layout-edit {
    grid-template-columns: 1fr;
  }

  &.layout-preview {
    grid-template-columns: 1fr;
  }

  &.layout-split {
    grid-template-columns: 1fr 1fr;
  }
}

.editor-pane,
.preview-pane {
  overflow: auto;
}

.markdown-textarea {
  width: 100%;
  height: 100%;
  border: none;
  padding: $spacing-6;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: none;
  outline: none;

  &::placeholder {
    color: $gray-400;
  }
}

.preview-pane {
  background: $gray-50;
  border-left: 1px solid $gray-200;
  padding: $spacing-6;
}

.markdown-content {
  line-height: 1.7;
  color: $gray-900;

  :deep(h1) {
    font-size: $text-2xl;
    margin: $spacing-6 0 $spacing-4;
    font-weight: 700;
  }

  :deep(h2) {
    font-size: $text-xl;
    margin: $spacing-5 0 $spacing-3;
    font-weight: 600;
  }

  :deep(h3) {
    font-size: $text-lg;
    margin: $spacing-4 0 $spacing-2;
    font-weight: 600;
  }

  :deep(p) {
    margin: $spacing-3 0;
  }

  :deep(strong) {
    font-weight: 700;
    color: $gray-900;
  }

  :deep(em) {
    font-style: italic;
  }

  :deep(code) {
    background: $gray-100;
    padding: 2px 6px;
    border-radius: $border-radius-sm;
    font-family: 'Consolas', monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
    background: $gray-900;
    color: $gray-100;
    padding: $spacing-4;
    border-radius: $border-radius-md;
    overflow-x: auto;
    margin: $spacing-4 0;

    code {
      background: none;
      padding: 0;
      color: inherit;
    }
  }

  :deep(ul) {
    list-style: disc;
    padding-left: $spacing-6;
    margin: $spacing-3 0;
  }

  :deep(li) {
    margin: $spacing-2 0;
  }

  :deep(a) {
    color: $primary-teal;
    text-decoration: underline;

    &:hover {
      color: color.adjust($primary-teal, $lightness: -10%);
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: $border-radius-md;
    margin: $spacing-4 0;
  }
}

.editor-footer {
  background: $gray-50;
  border-top: 1px solid $gray-200;
  padding: $spacing-2 $spacing-4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.char-count {
  color: $gray-600;
}

.help-link {
  color: $primary-teal;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
