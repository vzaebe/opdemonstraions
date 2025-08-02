<template>
  <div
    :class="[
      'loading-spinner',
      sizeClass,
      colorClass
    ]"
    :aria-label="ariaLabel"
    role="status"
  >
    <svg
      :width="svgSize"
      :height="svgSize"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray="31.416"
        stroke-dashoffset="31.416"
        class="spinner-circle"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  ariaLabel: 'Загрузка...'
})

const sizeClass = computed(() => `spinner-${props.size}`)
const colorClass = computed(() => `spinner-${props.color}`)

const svgSize = computed(() => {
  const sizes = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48
  }
  return sizes[props.size]
})
</script>

<style lang="scss" scoped>
.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;

  svg {
    display: block;
  }
}

.spinner-circle {
  animation: dash 1.5s ease-in-out infinite;
}

// Размеры
.spinner-xs {
  width: 1rem;
  height: 1rem;
}

.spinner-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.spinner-md {
  width: 1.5rem;
  height: 1.5rem;
}

.spinner-lg {
  width: 2rem;
  height: 2rem;
}

.spinner-xl {
  width: 3rem;
  height: 3rem;
}

// Цвета
.spinner-primary {
  color: #2eacb4;
}

.spinner-secondary {
  color: #1de9b6;
}

.spinner-white {
  color: white;
}

.spinner-gray {
  color: #6b7280;
}

// Анимации
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

// Уважение к настройкам пользователя
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }

  .spinner-circle {
    animation: none;
  }
}
</style>
