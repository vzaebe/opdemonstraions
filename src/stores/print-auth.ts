import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api/print-service'

interface User {
  id: number
  email: string
  name?: string
  phone?: string
  role: string
}

interface AuthResponse {
  user: User
  token: string
}

export const usePrintAuthStore = defineStore('print-auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('print_token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'superadmin')

  async function register(email: string, password: string, name?: string, phone?: string) {
    try {
      const response: any = await api.post('/auth/register', { email, password, name, phone })
      user.value = response.data.user
      token.value = response.data.token
      localStorage.setItem('print_token', response.data.token)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error
    }
  }

  async function login(email: string, password: string) {
    try {
      const response: any = await api.post('/auth/login', { email, password })
      user.value = response.data.user
      token.value = response.data.token
      localStorage.setItem('print_token', response.data.token)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error
    }
  }

  async function createGuest(email?: string) {
    try {
      const response: any = await api.post('/auth/guest', { email })
      user.value = response.data.user
      token.value = response.data.token
      localStorage.setItem('print_token', response.data.token)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Ignore errors
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('print_token')
    }
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const response: any = await api.get('/auth/me')
      user.value = response.data
    } catch (error) {
      // Token invalid, logout
      logout()
    }
  }

  // Initialize
  if (token.value) {
    fetchMe()
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    register,
    login,
    createGuest,
    logout,
    fetchMe,
  }
})
