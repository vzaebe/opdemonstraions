<template>
  <button
    :class="[
      'btn-primary',
      sizeClass,
      variantClass,
      { 'btn-loading': loading }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
    :aria-label="ariaLabel"
  >
    <LoadingSpinner v-if="loading" class="btn-spinner" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  ariaLabel: undefined
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClass = computed(() => `btn-${props.size}`)
const variantClass = computed(() => `btn-${props.variant}`)

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #2eacb4;
    outline-offset: 2px;
  }
}

// Размеры
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 2.5rem;
}

.btn-md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-height: 3rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  min-height: 3.5rem;
}

// Варианты
.btn-primary {
  background: linear-gradient(135deg, #2eacb4 0%, #1de9b6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(46, 172, 180, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(46, 172, 180, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

.btn-secondary {
  background: #f8f9fa;
  color: #2eacb4;
  border: 2px solid #e9ecef;

  &:hover:not(:disabled) {
    background: #e9ecef;
    border-color: #2eacb4;
  }
}

.btn-outline {
  background: transparent;
  color: #2eacb4;
  border: 2px solid #2eacb4;

  &:hover:not(:disabled) {
    background: #2eacb4;
    color: white;
  }
}

.btn-ghost {
  background: transparent;
  color: #2eacb4;

  &:hover:not(:disabled) {
    background: rgba(46, 172, 180, 0.1);
  }
}

// Состояние загрузки
.btn-loading {
  cursor: wait;
}

.btn-spinner {
  width: 1rem;
  height: 1rem;
}

// Адаптивность
@media (max-width: 768px) {
  .btn-md {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }

  .btn-lg {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
  }
}

// Анимация при наведении
@media (prefers-reduced-motion: no-preference) {
  .btn-primary {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
</style>
