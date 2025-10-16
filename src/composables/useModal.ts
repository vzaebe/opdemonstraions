import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export interface ModalOptions {
  closeOnEscape?: boolean
  closeOnOverlay?: boolean
  preventScroll?: boolean
  focusTrap?: boolean
}

export function useModal(options: ModalOptions = {}) {
  const {
    closeOnEscape = true,
    closeOnOverlay = true,
    preventScroll = true,
    focusTrap = true
  } = options

  const isOpen = ref(false)
  const data = ref<unknown>(null)
  const previousFocus = ref<HTMLElement | null>(null)

  const open = async (modalData?: unknown) => {
    data.value = modalData
    isOpen.value = true

    // Сохраняем текущий фокус
    previousFocus.value = document.activeElement as HTMLElement

    // Блокируем скролл
    if (preventScroll) {
      document.body.style.overflow = 'hidden'
    }

    // Ждем следующего тика для рендеринга модального окна
    await nextTick()

    // Фокусируемся на первом фокусируемом элементе в модальном окне
    if (focusTrap) {
      const modal = document.querySelector('[role="dialog"]') as HTMLElement
      if (modal) {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus()
        }
      }
    }
  }

  const close = () => {
    isOpen.value = false
    data.value = null

    // Восстанавливаем скролл
    if (preventScroll) {
      document.body.style.overflow = ''
    }

    // Возвращаем фокус
    if (previousFocus.value) {
      previousFocus.value.focus()
      previousFocus.value = null
    }
  }

  // Обработка клавиши Escape
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value && closeOnEscape) {
      close()
    }
  }

  // Обработка клика по оверлею
  const handleOverlayClick = (event: Event) => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      close()
    }
  }

  // Focus trap для модального окна
  const handleKeydown = (event: KeyboardEvent) => {
    if (!isOpen.value || !focusTrap) return

    const modal = document.querySelector('[role="dialog"]') as HTMLElement
    if (!modal) return

    const focusableElements = Array.from(
      modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  onMounted(() => {
    if (closeOnEscape) {
      document.addEventListener('keydown', handleEscape)
    }
    if (focusTrap) {
      document.addEventListener('keydown', handleKeydown)
    }
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
    document.removeEventListener('keydown', handleKeydown)
    // Убеждаемся, что скролл восстановлен
    if (preventScroll) {
      document.body.style.overflow = ''
    }
  })

  return {
    isOpen,
    data,
    open,
    close,
    handleOverlayClick
  }
}
