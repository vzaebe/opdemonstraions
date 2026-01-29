import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api/print-service'

export interface Model {
  id: number
  file_id: number
  format: string
  bbox_x: number
  bbox_y: number
  bbox_z: number
  volume: number
  surface_area: number
  triangle_count: number
  warnings_json: string | null
  created_at: string
  filename?: string
  quantity?: number
}

export interface Material {
  id: number
  name: string
  type: string
  density: number
  price_per_gram: number
  colors_json: string
  colors?: string[]
}

export interface PrintProfile {
  id: number
  name: string
  layer_height: number
  quality_level: number
  description?: string
}

export interface Quote {
  model_id: number
  quantity: number
  material_id: number
  profile_id: number
  infill: number
  supports: boolean
  estimate: {
    material_cost: number
    machine_time_cost: number
    labor_cost: number
    postprocess_cost: number
    subtotal: number
    margin: number
    total: number
    estimated_days: number
  }
  breakdown?: any
}

export const useCalculatorStore = defineStore('calculator', () => {
  const models = ref<Model[]>([])
  const materials = ref<Material[]>([])
  const profiles = ref<PrintProfile[]>([])
  const quotes = ref<Quote[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalCost = computed(() => {
    return quotes.value.reduce((sum, q) => sum + q.estimate.total, 0)
  })

  const totalDays = computed(() => {
    return Math.max(...quotes.value.map((q) => q.estimate.estimated_days), 0)
  })

  async function loadMaterials() {
    try {
      const response: any = await api.get('/pricing/materials')
      materials.value = response.data.map((m: any) => ({
        ...m,
        colors: m.colors_json ? JSON.parse(m.colors_json) : [],
      }))
    } catch (err: any) {
      error.value = 'Не удалось загрузить материалы'
      throw err
    }
  }

  async function loadProfiles() {
    try {
      const response: any = await api.get('/pricing/profiles')
      profiles.value = response.data
    } catch (err: any) {
      error.value = 'Не удалось загрузить профили'
      throw err
    }
  }

  async function uploadFiles(files: File[]) {
    loading.value = true
    error.value = null
    try {
      const response: any = await api.uploadFiles('/models/upload', files)
      const newModels = response.data.map((m: any) => ({
        ...m,
        quantity: 1,
      }))
      models.value.push(...newModels)
      return newModels
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Ошибка загрузки файлов'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function calculateQuote(params: {
    model_id: number
    quantity: number
    material_id: number
    profile_id: number
    infill?: number
    supports?: boolean
    color?: string
  }) {
    loading.value = true
    error.value = null
    try {
      const response: any = await api.post('/pricing/quote', params)
      const quote: Quote = {
        ...params,
        infill: params.infill || 20,
        supports: params.supports || false,
        estimate: response.data.estimate,
        breakdown: response.data.breakdown,
      }
      
      // Update or add quote
      const index = quotes.value.findIndex((q) => q.model_id === params.model_id)
      if (index >= 0) {
        quotes.value[index] = quote
      } else {
        quotes.value.push(quote)
      }
      
      return quote
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Ошибка расчета'
      throw err
    } finally {
      loading.value = false
    }
  }

  function removeModel(modelId: number) {
    models.value = models.value.filter((m) => m.id !== modelId)
    quotes.value = quotes.value.filter((q) => q.model_id !== modelId)
  }

  function updateModelQuantity(modelId: number, quantity: number) {
    const model = models.value.find((m) => m.id === modelId)
    if (model) {
      model.quantity = quantity
    }
  }

  function clearAll() {
    models.value = []
    quotes.value = []
  }

  return {
    models,
    materials,
    profiles,
    quotes,
    loading,
    error,
    totalCost,
    totalDays,
    loadMaterials,
    loadProfiles,
    uploadFiles,
    calculateQuote,
    removeModel,
    updateModelQuantity,
    clearAll,
  }
})
