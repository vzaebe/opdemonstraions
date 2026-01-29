<template>
  <textarea
    class="ui-textarea"
    :rows="rows"
    :placeholder="placeholder"
    :value="modelValue"
    :disabled="disabled"
    @input="onInput"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    rows?: number
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    rows: 4,
    placeholder: '',
    disabled: false,
  }
)

const emit = defineEmits<{ 'update:modelValue': [string] }>()

function onInput(e: Event) {
  const el = e.target as HTMLTextAreaElement | null
  emit('update:modelValue', el?.value ?? '')
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.ui-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid $gray-300;
  border-radius: $border-radius-md;
  font: inherit;
  min-height: 44px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: $primary-teal;
    box-shadow: 0 0 0 3px rgba($primary-teal, 0.1);
  }
}
</style>

