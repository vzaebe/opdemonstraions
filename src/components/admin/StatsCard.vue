<template>
  <div class="stats-card" :class="`stats-card--${variant}`">
    <div class="stats-header">
      <div class="stats-icon">
        <slot name="icon">{{ icon }}</slot>
      </div>
      <div class="stats-trend" v-if="trend">
        <span :class="['trend-indicator', trendClass]">
          {{ trendDirection }} {{ Math.abs(trend) }}%
        </span>
      </div>
    </div>
    <div class="stats-body">
      <div class="stats-value">{{ formattedValue }}</div>
      <div class="stats-label">{{ label }}</div>
    </div>
    <div class="stats-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'success' | 'warning' | 'info' | 'purple'

const props = withDefaults(
  defineProps<{
    value: number | string
    label: string
    icon?: string
    trend?: number
    variant?: Variant
    formatter?: (val: number | string) => string
  }>(),
  {
    icon: '📊',
    trend: undefined,
    variant: 'primary',
    formatter: undefined
  }
)

const formattedValue = computed(() => {
  if (props.formatter) {
    return props.formatter(props.value)
  }
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('ru-RU')
  }
  return props.value
})

const trendDirection = computed(() => {
  if (!props.trend) return ''
  return props.trend > 0 ? '↑' : '↓'
})

const trendClass = computed(() => {
  if (!props.trend) return ''
  return props.trend > 0 ? 'trend-up' : 'trend-down'
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.stats-card {
  background: white;
  border-radius: $border-radius-lg;
  padding: $spacing-6;
  box-shadow: $shadow-sm;
  transition: all $transition-fast;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $primary-teal, $primary-mint);
    transition: height $transition-fast;
  }

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);

    &::before {
      height: 6px;
    }
  }

  &--primary::before {
    background: linear-gradient(90deg, $primary-teal, $primary-mint);
  }

  &--success::before {
    background: linear-gradient(90deg, #10b981, #34d399);
  }

  &--warning::before {
    background: linear-gradient(90deg, $primary-orange, $primary-coral);
  }

  &--info::before {
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }

  &--purple::before {
    background: linear-gradient(90deg, #8b5cf6, #a78bfa);
  }
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-4;
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: $border-radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: linear-gradient(135deg, rgba($primary-teal, 0.1), rgba($primary-mint, 0.1));
  
  .stats-card--primary & {
    background: linear-gradient(135deg, rgba($primary-teal, 0.1), rgba($primary-mint, 0.1));
  }

  .stats-card--success & {
    background: linear-gradient(135deg, rgba(#10b981, 0.1), rgba(#34d399, 0.1));
  }

  .stats-card--warning & {
    background: linear-gradient(135deg, rgba($primary-orange, 0.1), rgba($primary-coral, 0.1));
  }

  .stats-card--info & {
    background: linear-gradient(135deg, rgba(#3b82f6, 0.1), rgba(#60a5fa, 0.1));
  }

  .stats-card--purple & {
    background: linear-gradient(135deg, rgba(#8b5cf6, 0.1), rgba(#a78bfa, 0.1));
  }
}

.stats-trend {
  font-size: 0.85rem;
}

.trend-indicator {
  padding: 4px 8px;
  border-radius: $border-radius-sm;
  font-weight: 600;

  &.trend-up {
    background: rgba(#10b981, 0.1);
    color: #10b981;
  }

  &.trend-down {
    background: rgba(#ef4444, 0.1);
    color: #ef4444;
  }
}

.stats-body {
  margin-bottom: $spacing-2;
}

.stats-value {
  font-size: $text-3xl;
  font-weight: 700;
  color: $gray-900;
  line-height: 1.2;
  margin-bottom: $spacing-1;
}

.stats-label {
  font-size: $text-sm;
  color: $gray-600;
  font-weight: 500;
}

.stats-footer {
  margin-top: $spacing-4;
  padding-top: $spacing-4;
  border-top: 1px solid $gray-100;
  font-size: $text-sm;
  color: $gray-500;
}
</style>
