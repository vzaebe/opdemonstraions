<template>
  <select class="ui-select" :value="String(modelValue ?? '')" :disabled="disabled" @change="onChange">
    <slot />
  </select>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined
    disabled?: boolean
  }>(),
  { disabled: false }
)

const emit = defineEmits<{ 'update:modelValue': [string] }>()

function onChange(e: Event) {
  const el = e.target as HTMLSelectElement | null
  emit('update:modelValue', el?.value ?? String(props.modelValue ?? ''))
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.ui-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid $gray-300;
  border-radius: $border-radius-md;
  font: inherit;
  min-height: 44px;

  &:focus {
    outline: none;
    border-color: $primary-teal;
    box-shadow: 0 0 0 3px rgba($primary-teal, 0.1);
  }
}
</style>

