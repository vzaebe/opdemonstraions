import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  http,
  trackApiError,
  AUTH_TOKEN_STORAGE_KEY,
  getStoredAuthToken
} from '@/services/api/http'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getStoredAuthToken())
  const role = ref<'super_admin' | 'admin' | 'moderator' | null>(null)
  const username = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value))
  const isAdmin = computed(() => role.value === 'admin' || role.value === 'super_admin')
  const isSuperAdmin = computed(() => role.value === 'super_admin')
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setToken(next: string | null) {
    token.value = next
    try {
      if (typeof window === 'undefined') return
      if (!next) window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
      else window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, next)
    } catch {
      // ignore storage failures
    }
  }

  async function login(loginUsername: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await http.post<{
        ok: true
        token: string
        user: { username: string; role: 'super_admin' | 'admin' | 'moderator' }
      }>(
        '/auth/login',
        { username: loginUsername, password }
      )
      setToken(res.token)
      username.value = res.user.username
      role.value = res.user.role
      return true
    } catch (e) {
      trackApiError(e, 'auth.login')
      error.value = 'Неверный логин или пароль'
      setToken(null)
      username.value = null
      role.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  async function checkSession() {
    try {
      const res = await http.get<{
        ok: true
        user: { id: string; username: string | null; role: 'super_admin' | 'admin' | 'moderator' }
      }>(
        '/auth/me'
      )
      username.value = res.user.username
      role.value = res.user.role
      return true
    } catch {
      setToken(null)
      username.value = null
      role.value = null
      return false
    }
  }

  function logout() {
    setToken(null)
    username.value = null
    role.value = null
  }

  return {
    token,
    role,
    username,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    loading,
    error,
    login,
    checkSession,
    logout
  }
})

