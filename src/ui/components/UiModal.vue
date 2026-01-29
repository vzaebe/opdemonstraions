<template>
  <Teleport to="body">
    <Transition name="ui-modal">
      <div v-if="isOpen" class="ui-modal__overlay" @click="handleOverlayClick">
        <div
          class="ui-modal__container"
          role="dialog"
          aria-modal="true"
          :aria-label="ariaLabel"
          :aria-labelledby="computedAriaLabelledby"
          @click.stop
        >
          <button class="ui-modal__close" type="button" :aria-label="closeLabel" @click="close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <header v-if="title || $slots.header" class="ui-modal__header">
            <h2 v-if="title" :id="titleId" class="ui-modal__title">{{ title }}</h2>
            <slot name="header" />
          </header>

          <div class="ui-modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="ui-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useModal } from '../../composables/useModal'

type Props = {
  open: boolean
  title?: string
  /** Use ariaLabel when there is no visible title */
  ariaLabel?: string
  closeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  ariaLabel: undefined,
  closeLabel: 'Закрыть',
})

const emit = defineEmits<{
  close: []
}>()

// Stable-ish id for aria-labelledby (can be overridden later if needed)
const titleId = `ui-modal-title-${Math.random().toString(16).slice(2)}`

const computedAriaLabelledby = computed(() => {
  // If ariaLabel is provided, do not set aria-labelledby.
  if (props.ariaLabel) return undefined
  if (!props.title) return undefined
  return titleId
})

const { isOpen, open, close: closeInternal, handleOverlayClick } = useModal({
  closeOnEscape: true,
  closeOnOverlay: true,
  preventScroll: true,
  focusTrap: true,
  onClose: () => emit('close'),
})

watch(
  () => props.open,
  async (next) => {
    if (next) await open()
    else closeInternal()
  },
  { immediate: true }
)

function close() {
  closeInternal()
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.ui-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-6;
  z-index: $z-modal;
}

.ui-modal__container {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: auto;
  background: $white;
  border-radius: $border-radius-2xl;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  position: relative;
}

.ui-modal__close {
  position: absolute;
  top: $spacing-4;
  right: $spacing-4;
  width: 40px;
  height: 40px;
  border-radius: $border-radius-full;
  border: 1px solid $gray-200;
  background: $white;
  color: $gray-700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform $transition-fast, background $transition-fast;
  z-index: 1;

  svg {
    width: 22px;
    height: 22px;
  }

  &:hover {
    background: $gray-50;
    transform: scale(1.04);
  }
}

.ui-modal__header {
  padding: $spacing-8 $spacing-10 $spacing-5;
  border-bottom: 1px solid $gray-100;
  background: linear-gradient(135deg, rgba($primary-teal, 0.06), rgba($primary-orange, 0.06));
}

.ui-modal__title {
  margin: 0;
  font-size: $text-2xl;
  font-weight: 900;
  color: $gray-900;
}

.ui-modal__body {
  padding: $spacing-8 $spacing-10 $spacing-10;
}

.ui-modal__footer {
  padding: $spacing-5 $spacing-10 $spacing-8;
  border-top: 1px solid $gray-100;
}

/* Transition (animation tokens could be centralized later) */
.ui-modal-enter-active,
.ui-modal-leave-active {
  transition: opacity 0.2s ease;
}
.ui-modal-enter-from,
.ui-modal-leave-to {
  opacity: 0;
}
.ui-modal-enter-active .ui-modal__container,
.ui-modal-leave-active .ui-modal__container {
  transition: transform 0.2s ease;
}
.ui-modal-enter-from .ui-modal__container,
.ui-modal-leave-to .ui-modal__container {
  transform: translateY(14px) scale(0.98);
}

@media (max-width: $breakpoint-sm) {
  .ui-modal__overlay {
    padding: $spacing-4;
  }
  .ui-modal__header,
  .ui-modal__body,
  .ui-modal__footer {
    padding-left: $spacing-6;
    padding-right: $spacing-6;
  }
}
</style>

