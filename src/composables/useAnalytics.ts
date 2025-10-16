import { ref } from 'vue'

// Глобальные типы для аналитики
declare global {
  interface Window {
    gtag?: (command: string, event: string, properties?: Record<string, unknown>) => void
    ym?: (id: number, command: string, event: string, properties?: Record<string, unknown>) => void
  }
}

// Расширяем типы для глобальных переменных
declare const gtag: Window['gtag']
declare const ym: Window['ym']

interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
  timestamp: number
}

export function useAnalytics() {
  const events = ref<AnalyticsEvent[]>([])

  const track = (event: string, properties?: Record<string, unknown>) => {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now()
    }

    events.value.push(analyticsEvent)

    // В реальном приложении здесь будет отправка в аналитический сервис
    console.log('Analytics Event:', analyticsEvent)

    // Отправка в Google Analytics (если настроен)
    if (typeof gtag !== 'undefined') {
      gtag('event', event, properties)
    }

    // Отправка в Yandex.Metrika (если настроен)
    if (typeof ym !== 'undefined') {
      ym(123456789, 'reachGoal', event, properties)
    }
  }

  const trackModalOpen = (modalType: string, memberName?: string) => {
    track('modal_open', {
      modal_type: modalType,
      member_name: memberName,
      page: window.location.pathname
    })
  }

  const trackModalClose = (modalType: string, duration: number) => {
    track('modal_close', {
      modal_type: modalType,
      duration,
      page: window.location.pathname
    })
  }

  const trackProfileView = (memberName: string, viewType: 'modal' | 'full') => {
    track('profile_view', {
      member_name: memberName,
      view_type: viewType,
      page: window.location.pathname
    })
  }

  const trackButtonClick = (buttonText: string, section: string) => {
    track('button_click', {
      button_text: buttonText,
      section,
      page: window.location.pathname
    })
  }

  const trackPageView = (page: string) => {
    track('page_view', {
      page,
      referrer: document.referrer,
      user_agent: navigator.userAgent
    })
  }

  const trackError = (error: Error, context?: string) => {
    track('error', {
      error_message: error.message,
      error_stack: error.stack,
      context,
      page: window.location.pathname
    })
  }

  const getEvents = () => events.value

  const clearEvents = () => {
    events.value = []
  }

  return {
    track,
    trackModalOpen,
    trackModalClose,
    trackProfileView,
    trackButtonClick,
    trackPageView,
    trackError,
    getEvents,
    clearEvents
  }
}
