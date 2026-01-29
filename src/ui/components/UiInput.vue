<template>
  <input
    class="ui-input"
    :type="type"
    :placeholder="placeholder"
    :value="String(modelValue ?? '')"
    :autocomplete="autocomplete"
    :disabled="disabled"
    @input="onInput"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined
    type?: string
    placeholder?: string
    autocomplete?: string
    disabled?: boolean
  }>(),
  {
    type: 'text',
    placeholder: '',
    autocomplete: undefined,
    disabled: false
  }
)

const emit = defineEmits<{ 'update:modelValue': [string] }>()

function onInput(e: Event) {
  const el = e.target as HTMLInputElement | null
  emit('update:modelValue', el?.value ?? '')
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.ui-input {
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

