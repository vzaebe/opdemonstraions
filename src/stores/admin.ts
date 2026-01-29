import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api/print-service'

export interface DashboardStats {
  orders_today: number
  orders_week: number
  revenue_today: number
  revenue_week: number
  queue_pending: number
  queue_printing: number
}

export const useAdminStore = defineStore('admin', () => {
  const stats = ref<DashboardStats | null>(null)
  const orders = ref<any[]>([])
  const queue = ref<any[]>([])
  const materials = ref<any[]>([])
  const printers = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadDashboard() {
    loading.value = true
    error.value = null
    try {
      const response: any = await api.get('/admin/dashboard')
      stats.value = response.data
    } catch (err: any) {
      error.value = 'Ошибка загрузки дашборда'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadOrders(params?: any) {
    loading.value = true
    error.value = null
    try {
      const response: any = await api.get('/admin/orders', { params })
      orders.value = response.data
    } catch (err: any) {
      error.value = 'Ошибка загрузки заказов'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateOrder(orderId: number, updates: any) {
    try {
      const response: any = await api.put(`/admin/orders/${orderId}`, updates)
      return response.data
    } catch (err: any) {
      error.value = 'Ошибка обновления заказа'
      throw err
    }
  }

  async function loadQueue() {
    loading.value = true
    error.value = null
    try {
      const response: any = await api.get('/queue')
      queue.value = response.data
    } catch (err: any) {
      error.value = 'Ошибка загрузки очереди'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateQueueItem(itemId: number, updates: any) {
    try {
      const response: any = await api.put(`/queue/${itemId}`, updates)
      return response.data
    } catch (err: any) {
      error.value = 'Ошибка обновления очереди'
      throw err
    }
  }

  async function loadMaterials() {
    try {
      const response: any = await api.get('/admin/materials')
      materials.value = response.data
    } catch (err: any) {
      error.value = 'Ошибка загрузки материалов'
      throw err
    }
  }

  async function createMaterial(material: any) {
    try {
      const response: any = await api.post('/admin/materials', material)
      materials.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = 'Ошибка создания материала'
      throw err
    }
  }

  async function updateMaterial(id: number, material: any) {
    try {
      const response: any = await api.put(`/admin/materials/${id}`, material)
      const index = materials.value.findIndex((m) => m.id === id)
      if (index >= 0) {
        materials.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = 'Ошибка обновления материала'
      throw err
    }
  }

  async function deleteMaterial(id: number) {
    try {
      await api.delete(`/admin/materials/${id}`)
      materials.value = materials.value.filter((m) => m.id !== id)
    } catch (err: any) {
      error.value = 'Ошибка удаления материала'
      throw err
    }
  }

  async function loadPrinters() {
    try {
      const response: any = await api.get('/admin/printers')
      printers.value = response.data
    } catch (err: any) {
      error.value = 'Ошибка загрузки принтеров'
      throw err
    }
  }

  async function createPrinter(printer: any) {
    try {
      const response: any = await api.post('/admin/printers', printer)
      printers.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = 'Ошибка создания принтера'
      throw err
    }
  }

  async function updatePrinter(id: number, printer: any) {
    try {
      const response: any = await api.put(`/admin/printers/${id}`, printer)
      const index = printers.value.findIndex((p) => p.id === id)
      if (index >= 0) {
        printers.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = 'Ошибка обновления принтера'
      throw err
    }
  }

  async function deletePrinter(id: number) {
    try {
      await api.delete(`/admin/printers/${id}`)
      printers.value = printers.value.filter((p) => p.id !== id)
    } catch (err: any) {
      error.value = 'Ошибка удаления принтера'
      throw err
    }
  }

  return {
    stats,
    orders,
    queue,
    materials,
    printers,
    loading,
    error,
    loadDashboard,
    loadOrders,
    updateOrder,
    loadQueue,
    updateQueueItem,
    loadMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    loadPrinters,
    createPrinter,
    updatePrinter,
    deletePrinter,
  }
})
