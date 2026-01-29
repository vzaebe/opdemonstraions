<template>
  <div :class="['ui-card', { 'ui-card--padded': padded }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean
  }>(),
  { padded: true }
)
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.ui-card {
  background: $white;
  border: 1px solid $gray-100;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
}

.ui-card--padded {
  padding: $spacing-6;
}
</style>

