<template>
  <component
    :is="componentTag"
    v-bind="componentAttrs"
    :class="['ui-btn', `ui-btn--${variant}`, `ui-btn--${size}`, { 'ui-btn--loading': loading, 'ui-btn--disabled': isDisabled }]"
    @click="onClick"
  >
    <span v-if="loading" class="spinner" aria-hidden="true" />
    <span class="content"><slot /></span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    to?: RouteLocationRaw
    href?: string
    target?: string
    rel?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    to: undefined,
    href: undefined,
    target: undefined,
    rel: undefined,
  }
)

const emit = defineEmits<{ click: [MouseEvent] }>()

const isDisabled = computed(() => props.disabled || props.loading)

const componentTag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

const componentAttrs = computed(() => {
  if (props.to) {
    return { to: props.to }
  }
  if (props.href) {
    return {
      href: props.href,
      target: props.target,
      rel: props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined),
      'aria-disabled': isDisabled.value ? 'true' : undefined,
      tabindex: isDisabled.value ? -1 : undefined,
    }
  }
  return {
    type: props.type,
    disabled: isDisabled.value,
  }
})

function onClick(e: MouseEvent) {
  if (isDisabled.value) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;
@use 'sass:color';

.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: $border-radius-md;
  font-weight: 700;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: background $transition-fast, transform $transition-fast, box-shadow $transition-fast, opacity $transition-fast;

  &:disabled,
  &.ui-btn--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid $primary-teal;
    outline-offset: 2px;
  }
}

.ui-btn--sm { padding: 8px 12px; min-height: 40px; font-size: $text-sm; }
.ui-btn--md { padding: 10px 16px; min-height: 44px; font-size: $text-base; }
.ui-btn--lg { padding: 12px 20px; min-height: 48px; font-size: $text-lg; }

.ui-btn--primary {
  background: $primary-teal;
  color: $white;
  box-shadow: 0 4px 12px rgba($primary-teal, 0.25);

  &:hover:not(:disabled) {
    background: $primary-teal-light;
    transform: translateY(-1px);
  }
}

.ui-btn--secondary {
  background: $gray-50;
  color: $gray-900;
  border: 1px solid $gray-200;

  &:hover:not(:disabled) {
    background: $gray-100;
  }
}

.ui-btn--danger {
  background: $primary-coral;
  color: $white;

  &:hover:not(:disabled) {
    background: color.adjust($primary-coral, $lightness: -6%);
  }
}

.ui-btn--ghost {
  background: transparent;
  color: $primary-teal;

  &:hover:not(:disabled) {
    background: rgba($primary-teal, 0.08);
  }
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid rgba($white, 0.55);
  border-top-color: rgba($white, 1);
  animation: spin 0.8s linear infinite;
}

.ui-btn--secondary .spinner,
.ui-btn--ghost .spinner {
  border-color: rgba($primary-teal, 0.25);
  border-top-color: rgba($primary-teal, 1);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

