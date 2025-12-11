import { defineStore } from 'pinia'
import { ref } from 'vue'
import { http, trackApiError } from '@/services/api/http'

export const useAuthStore = defineStore('auth', () => {
  const isAdmin = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function login(password: string) {
    loading.value = true
    error.value = null
    try {
      await http.post('/auth/login', { password })
      isAdmin.value = true
      return true
    } catch (e) {
      trackApiError(e, 'auth.login')
      error.value = 'Неверный пароль'
      isAdmin.value = false
      return false
    } finally {
      loading.value = false
    }
  }

  async function checkSession() {
    try {
      await http.get('/auth/me')
      isAdmin.value = true
      return true
    } catch {
      isAdmin.value = false
      return false
    }
  }

  return {
    isAdmin,
    loading,
    error,
    login,
    checkSession
  }
})

