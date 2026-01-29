import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api/print-service'
import { logError } from '@/services/logger'

interface FeatureFlags {
  models: boolean
  pricing: boolean
  slicing: boolean
  orders: boolean
  queue: boolean
  shipping: boolean
  payment: boolean
  ai: boolean
  admin: boolean
}

export const usePrintStore = defineStore('print', () => {
  const featureFlags = ref<FeatureFlags>({
    models: true,
    pricing: true,
    slicing: false,
    orders: true,
    queue: true,
    shipping: true,
    payment: false,
    ai: false,
    admin: true,
  })

  async function loadFeatureFlags() {
    try {
      const response: any = await api.get('/feature-flags')
      featureFlags.value = response.data.flags
    } catch (error) {
      logError('print-store', 'Failed to load feature flags', { error })
    }
  }

  return {
    featureFlags,
    loadFeatureFlags,
  }
})
