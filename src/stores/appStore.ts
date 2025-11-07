import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePreferencesStore } from './preferences'
import { useModalStore } from './modal'
import { useAnalyticsStore } from './analytics'

export const useAppStore = defineStore('app', () => {
  const isLoading = ref(false)
  const currentPage = ref('home')

  // Compose specialized stores for backward compatibility
  const preferences = usePreferencesStore()
  const modal = useModalStore()
  const analytics = useAnalyticsStore()

  function setLoading(next: boolean): void {
    isLoading.value = next
  }

  function setCurrentPage(page: string): void {
    currentPage.value = page
    analytics.trackPageView()
  }

  function initializeApp(): void {
    preferences.initialize()
  }

  function getAnalyticsReport(): { pageViews: number; modalOpens: number; buttonClicks: number; timestamp: string } {
    return { ...analytics.counters, timestamp: new Date().toISOString() }
  }

  return {
    isLoading,
    currentPage,
    // expose nested stores api as backwards-compat
    userPreferences: preferences, // theme, language, reducedMotion + setters
    modalState: modal.state,
    analytics: analytics.counters,

    // getters compatibility
    isDarkTheme: preferences.isDarkTheme,
    isModalOpen: modal.isOpen,
    currentModalType: modal.type,
    currentModalData: modal.data,

    // actions
    setLoading,
    setCurrentPage,
    setTheme: preferences.setTheme,
    setLanguage: preferences.setLanguage,
    setReducedMotion: preferences.setReducedMotion,
    openModal: modal.open,
    closeModal: modal.close,
    trackButtonClick: analytics.trackButtonClick,
    initializeApp,
    resetAnalytics: analytics.reset,
    getAnalyticsReport,
  }
})
