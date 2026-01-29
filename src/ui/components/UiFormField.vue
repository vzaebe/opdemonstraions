<template>
  <div class="ui-field">
    <label v-if="label" class="ui-field__label" :for="id">
      {{ label }}<span v-if="required" class="ui-field__req" aria-hidden="true"> *</span>
    </label>

    <div class="ui-field__control">
      <slot />
    </div>

    <p v-if="hint && !error" class="ui-field__hint">{{ hint }}</p>
    <p v-if="error" class="ui-field__error" role="alert">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string
    label?: string
    hint?: string
    error?: string | null
    required?: boolean
  }>(),
  {
    id: undefined,
    label: undefined,
    hint: undefined,
    error: null,
    required: false,
  }
)
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.ui-field {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
}

.ui-field__label {
  font-size: $text-sm;
  font-weight: 700;
  color: $gray-700;
}

.ui-field__req {
  color: $primary-coral;
}

.ui-field__hint {
  margin: 0;
  font-size: $text-sm;
  color: $gray-600;
}

.ui-field__error {
  margin: 0;
  font-size: $text-sm;
  color: $primary-coral;
}
</style>

