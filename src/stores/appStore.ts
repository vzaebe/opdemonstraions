import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AppState {
  isLoading: boolean
  currentPage: string
  userPreferences: {
    theme: 'light' | 'dark' | 'auto'
    language: 'ru' | 'en'
    reducedMotion: boolean
  }
  modalState: {
    isOpen: boolean
    type: string | null
    data: unknown
  }
  analytics: {
    pageViews: number
    modalOpens: number
    buttonClicks: number
  }
}

export const useAppStore = defineStore('app', () => {
  // Состояние
  const isLoading = ref(false)
  const currentPage = ref('home')
  const userPreferences = ref({
    theme: 'light' as 'light' | 'dark' | 'auto',
    language: 'ru' as 'ru' | 'en',
    reducedMotion: false
  })
  const modalState = ref({
    isOpen: false,
    type: null as string | null,
    data: null as unknown
  })
  const analytics = ref({
    pageViews: 0,
    modalOpens: 0,
    buttonClicks: 0
  })

  // Геттеры
  const isDarkTheme = computed(() => {
    if (userPreferences.value.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return userPreferences.value.theme === 'dark'
  })

  const isModalOpen = computed(() => modalState.value.isOpen)

  const currentModalType = computed(() => modalState.value.type)

  const currentModalData = computed(() => modalState.value.data)

  // Действия
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setCurrentPage = (page: string) => {
    currentPage.value = page
    analytics.value.pageViews++
  }

  const setTheme = (theme: 'light' | 'dark' | 'auto') => {
    userPreferences.value.theme = theme
    localStorage.setItem('theme', theme)

    // Применяем тему к документу
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const setLanguage = (language: 'ru' | 'en') => {
    userPreferences.value.language = language
    localStorage.setItem('language', language)
  }

  const setReducedMotion = (reduced: boolean) => {
    userPreferences.value.reducedMotion = reduced
    localStorage.setItem('reducedMotion', reduced.toString())
  }

  const openModal = (type: string, data?: unknown) => {
    modalState.value = {
      isOpen: true,
      type,
      data
    }
    analytics.value.modalOpens++
  }

  const closeModal = () => {
    modalState.value = {
      isOpen: false,
      type: null,
      data: null
    }
  }

  const trackButtonClick = (buttonText: string) => {
    analytics.value.buttonClicks++
    console.log(`Button clicked: ${buttonText}`)
  }

  const initializeApp = () => {
    // Загружаем настройки из localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null
    const savedLanguage = localStorage.getItem('language') as 'ru' | 'en' | null
    const savedReducedMotion = localStorage.getItem('reducedMotion')

    if (savedTheme) {
      setTheme(savedTheme)
    }
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    if (savedReducedMotion) {
      setReducedMotion(savedReducedMotion === 'true')
    }

    // Инициализируем тему
    setTheme(userPreferences.value.theme)
  }

  const resetAnalytics = () => {
    analytics.value = {
      pageViews: 0,
      modalOpens: 0,
      buttonClicks: 0
    }
  }

  const getAnalyticsReport = () => {
    return {
      ...analytics.value,
      timestamp: new Date().toISOString()
    }
  }

  return {
    // Состояние
    isLoading,
    currentPage,
    userPreferences,
    modalState,
    analytics,

    // Геттеры
    isDarkTheme,
    isModalOpen,
    currentModalType,
    currentModalData,

    // Действия
    setLoading,
    setCurrentPage,
    setTheme,
    setLanguage,
    setReducedMotion,
    openModal,
    closeModal,
    trackButtonClick,
    initializeApp,
    resetAnalytics,
    getAnalyticsReport
  }
})
