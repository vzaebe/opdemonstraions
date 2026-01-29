<template>
  <div class="ui-slider">
    <div v-if="label" class="slider-header">
      <label class="slider-label">{{ label }}</label>
      <span class="slider-value">{{ displayValue }}</span>
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      class="slider-input"
      @input="handleInput"
    />
    <div v-if="showMarks" class="slider-marks">
      <span class="mark">{{ min }}{{ suffix }}</span>
      <span class="mark">{{ max }}{{ suffix }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  suffix?: string
  showMarks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  suffix: '',
  showMarks: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const displayValue = computed(() => {
  return `${props.modelValue}${props.suffix}`
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<style scoped lang="scss">
.ui-slider {
  width: 100%;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.slider-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
}

.slider-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-teal);
}

.slider-input {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--gray-300);
  outline: none;
  appearance: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-teal);
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: var(--transition-fast);

    &:hover {
      transform: scale(1.2);
      box-shadow: var(--shadow-md);
    }
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-teal);
    cursor: pointer;
    border: none;
    box-shadow: var(--shadow-sm);
    transition: var(--transition-fast);

    &:hover {
      transform: scale(1.2);
      box-shadow: var(--shadow-md);
    }
  }
}

.slider-marks {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-1);

  .mark {
    font-size: 0.75rem;
    color: var(--gray-500);
  }
}
</style>
