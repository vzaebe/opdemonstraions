import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ModalState {
  isOpen: boolean
  type: string | null
  data: unknown
}

export const useModalStore = defineStore('modal', () => {
  const state = ref<ModalState>({ isOpen: false, type: null, data: null })

  const isOpen = computed(() => state.value.isOpen)
  const type = computed(() => state.value.type)
  const data = computed(() => state.value.data)

  function open(modalType: string, payload?: unknown): void {
    state.value = { isOpen: true, type: modalType, data: payload ?? null }
  }

  function close(): void {
    state.value = { isOpen: false, type: null, data: null }
  }

  return { state, isOpen, type, data, open, close }
})


