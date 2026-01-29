import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api/print-service'

export interface Order {
  id: number
  order_number: string
  user_id: number | null
  guest_email: string | null
  status: string
  items_json: string
  totals_json: string
  shipping_json: string | null
  payment_json: string | null
  tracking_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items?: any[]
  totals?: any
  shipping?: any
}

export interface OrderMessage {
  id: number
  order_id: number
  author_type: string
  author_name: string
  message: string
  created_at: string
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const messages = ref<OrderMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function createOrder(orderData: {
    items: any[]
    contact: { email: string; phone?: string; name?: string }
    shipping: { method_id: number; address?: string }
    payment?: { method: string }
  }) {
    loading.value = true
    error.value = null
    try {
      const response: any = await api.post('/orders/create', orderData)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Ошибка создания заказа'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadMyOrders() {
    loading.value = true
    error.value = null
    try {
      const response: any = await api.get('/orders')
      orders.value = response.data.map((order: any) => ({
        ...order,
        items: order.items_json ? JSON.parse(order.items_json) : [],
        totals: order.totals_json ? JSON.parse(order.totals_json) : {},
        shipping: order.shipping_json ? JSON.parse(order.shipping_json) : null,
      }))
    } catch (err: any) {
      error.value = 'Не удалось загрузить заказы'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadOrder(orderId: number) {
    loading.value = true
    error.value = null
    try {
      const response: any = await api.get(`/orders/${orderId}`)
      currentOrder.value = {
        ...response.data,
        items: response.data.items_json ? JSON.parse(response.data.items_json) : [],
        totals: response.data.totals_json ? JSON.parse(response.data.totals_json) : {},
        shipping: response.data.shipping_json ? JSON.parse(response.data.shipping_json) : null,
      }
      return currentOrder.value
    } catch (err: any) {
      error.value = 'Не удалось загрузить заказ'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadMessages(orderId: number) {
    try {
      const response: any = await api.get(`/orders/${orderId}/messages`)
      messages.value = response.data
    } catch (err: any) {
      error.value = 'Не удалось загрузить сообщения'
      throw err
    }
  }

  async function addMessage(orderId: number, message: string) {
    try {
      const response: any = await api.post(`/orders/${orderId}/messages`, { message })
      messages.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = 'Не удалось отправить сообщение'
      throw err
    }
  }

  return {
    orders,
    currentOrder,
    messages,
    loading,
    error,
    createOrder,
    loadMyOrders,
    loadOrder,
    loadMessages,
    addMessage,
  }
})
