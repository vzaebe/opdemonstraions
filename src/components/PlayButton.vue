<template>
  <button
    class="play-button"
    @click="$emit('click')"
    :aria-label="ariaLabel"
    :class="{ 'play-button--overlay': overlay }"
  >
    <span class="play-icon">▶</span>
  </button>
</template>

<script lang="ts">
export default {
  name: 'PlayButton',
  props: {
    ariaLabel: {
      type: String,
      default: 'Воспроизвести видео'
    },
    overlay: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.play-button {
  width: 5rem;
  height: 5rem;
  border-radius: $border-radius-full;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: $white;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, $primary-mint, $primary-cyan);
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(29, 233, 182, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  // Вариант для наложения поверх изображения
  &--overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    box-shadow: 0 8px 25px rgba(29, 233, 182, 0.4);

    &:hover {
      transform: translate(-50%, -50%) scale(1.1);
      box-shadow: 0 12px 35px rgba(29, 233, 182, 0.6);
    }

    &:active {
      transform: translate(-50%, -50%) scale(0.95);
    }
  }
}

.play-icon {
  font-size: $text-2xl;
  color: $white;
  line-height: 1;
  margin-left: 0.25rem;
}

// Адаптивность
@media (max-width: $breakpoint-md) {
  .play-button {
    width: 4.5rem;
    height: 4.5rem;
  }

  .play-icon {
    font-size: $text-xl;
  }
}

@media (max-width: $breakpoint-sm) {
  .play-button {
    width: 4rem;
    height: 4rem;
  }

  .play-icon {
    font-size: $text-lg;
  }
}
</style>
