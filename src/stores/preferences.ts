import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'
export type Language = 'ru' | 'en'

function applyThemeClass(theme: Theme): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<Theme>('light')
  const language = ref<Language>('ru')
  const reducedMotion = ref(false)

  const isDarkTheme = computed<boolean>(() => {
    if (theme.value === 'auto') {
      if (typeof window === 'undefined') return false
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value === 'dark'
  })

  function setTheme(next: Theme): void {
    theme.value = next
    if (typeof localStorage !== 'undefined') localStorage.setItem('theme', next)
    applyThemeClass(next)
  }

  function setLanguage(next: Language): void {
    language.value = next
    if (typeof localStorage !== 'undefined') localStorage.setItem('language', next)
  }

  function setReducedMotion(next: boolean): void {
    reducedMotion.value = next
    if (typeof localStorage !== 'undefined') localStorage.setItem('reducedMotion', String(next))
  }

  function initialize(): void {
    if (typeof localStorage === 'undefined') return
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const savedLanguage = localStorage.getItem('language') as Language | null
    const savedReducedMotion = localStorage.getItem('reducedMotion')

    if (savedTheme) setTheme(savedTheme)
    if (savedLanguage) setLanguage(savedLanguage)
    if (savedReducedMotion) setReducedMotion(savedReducedMotion === 'true')
    // Ensure class reflects current theme
    applyThemeClass(theme.value)
  }

  return {
    // state
    theme,
    language,
    reducedMotion,
    // getters
    isDarkTheme,
    // actions
    setTheme,
    setLanguage,
    setReducedMotion,
    initialize,
  }
})


