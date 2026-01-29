<template>
  <span class="ui-badge" :class="[`variant-${variant}`, `size-${size}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
})
</script>

<style scoped lang="scss">
.ui-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 12px;
  white-space: nowrap;
}

/* Sizes */
.size-sm {
  padding: 2px 8px;
  font-size: 0.75rem;
}

.size-md {
  padding: 4px 12px;
  font-size: 0.875rem;
}

.size-lg {
  padding: 6px 16px;
  font-size: 1rem;
}

/* Variants */
.variant-default {
  background: var(--gray-300);
  color: var(--gray-700);
}

.variant-success {
  background: #d4edda;
  color: #155724;
}

.variant-warning {
  background: #fff3cd;
  color: #856404;
}

.variant-danger {
  background: #f8d7da;
  color: #721c24;
}

.variant-info {
  background: #d1ecf1;
  color: #0c5460;
}
</style>
