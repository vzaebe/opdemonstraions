import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AnalyticsCounters {
  pageViews: number
  modalOpens: number
  buttonClicks: number
}

export const useAnalyticsStore = defineStore('analytics', () => {
  const counters = ref<AnalyticsCounters>({ pageViews: 0, modalOpens: 0, buttonClicks: 0 })

  function trackPageView(): void {
    counters.value.pageViews += 1
  }

  function trackModalOpen(): void {
    counters.value.modalOpens += 1
  }

  function trackButtonClick(): void {
    counters.value.buttonClicks += 1
  }

  function reset(): void {
    counters.value = { pageViews: 0, modalOpens: 0, buttonClicks: 0 }
  }

  return { counters, trackPageView, trackModalOpen, trackButtonClick, reset }
})


