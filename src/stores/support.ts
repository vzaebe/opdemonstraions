import { defineStore } from 'pinia'
import { ref } from 'vue'
import { http, trackApiError } from '@/services/api/http'

interface SupportGoal {
  id: number
  title: string
  description: string
  target_amount: number
  current_amount: number
  category: string
  priority: 'high' | 'medium' | 'low'
  icon?: string
  examples?: string[]
}

export const useSupportStore = defineStore('support', () => {
  // State
  const supportGoals = ref<SupportGoal[]>([])

  // Actions
  async function fetchSupportGoals() {
    try {
      const data = await http.get<SupportGoal[]>('/support-goals')
      supportGoals.value = data
    } catch (error) {
      trackApiError(error, 'fetchSupportGoals')
      supportGoals.value = []
    }
  }

  async function createSupportGoal(payload: Omit<SupportGoal, 'id' | 'current_amount'>) {
    try {
      const created = await http.post<SupportGoal>('/admin/support-goals', {
        ...payload,
        current_amount: 0
      })
      supportGoals.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'createSupportGoal')
      throw error
    }
  }

  async function updateSupportGoal(id: number, updates: Partial<SupportGoal>) {
    try {
      const updated = await http.patch<SupportGoal>(`/admin/support-goals/${id}`, updates)
      const idx = supportGoals.value.findIndex(g => g.id === id)
      if (idx !== -1) supportGoals.value[idx] = updated
      return updated
    } catch (error) {
      trackApiError(error, 'updateSupportGoal')
      throw error
    }
  }

  async function deleteSupportGoal(id: number) {
    try {
      await http.delete(`/admin/support-goals/${id}`)
      const idx = supportGoals.value.findIndex(g => g.id === id)
      if (idx !== -1) supportGoals.value.splice(idx, 1)
    } catch (error) {
      trackApiError(error, 'deleteSupportGoal')
      throw error
    }
  }

  return {
    supportGoals,
    fetchSupportGoals,
    createSupportGoal,
    updateSupportGoal,
    deleteSupportGoal
  }
})




