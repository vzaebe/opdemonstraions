/**
 * Глобальные константы приложения
 * Единый источник правды для всех конфигурационных значений
 * Обновление constans здесь автоматически распространяется на все компоненты
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📞 КОНТАКТНАЯ ИНФОРМАЦИЯ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CONTACT = {
  PHONE: '+7 915 003 39 35',
  PHONE_DISPLAY: '+7 915 003 39 35',
  EMAIL: 'info@openperspectives.ru',
  TELEGRAM_URL: 'https://t.me/openperspectives',
  TELEGRAM_HANDLE: 'openperspectives'
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧭 НАВИГАЦИОННЫЕ ССЫЛКИ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface NavigationItem {
  label: string
  href: string
  disabled?: boolean
}

export const NAVIGATION_LINKS: NavigationItem[] = [
  { label: 'О нас', href: '#about' },
  { label: 'Проекты', href: '#projects' },
  { label: 'Партнёры', href: '#partners' },
  { label: 'База Знаний', href: '#knowledge' },
  { label: 'Поддержка', href: '#support' },
  { label: 'Контакты', href: '#contacts' }
] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📏 БРЕЙКПОИНТЫ (Responsive Design)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const BREAKPOINTS = {
  SM: 640,    // Mobile
  MD: 768,    // Tablet
  LG: 1024,   // Desktop
  XL: 1280,   // Large Desktop
  XXL: 1536   // Extra Large
} as const

// Типы для media queries
export type BreakpointKey = keyof typeof BREAKPOINTS

export const BREAKPOINT_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.SM}px)`,
  tablet: `(max-width: ${BREAKPOINTS.MD}px)`,
  desktop: `(min-width: ${BREAKPOINTS.LG}px)`,
  largeDesktop: `(min-width: ${BREAKPOINTS.XL}px)`,
  extraLarge: `(min-width: ${BREAKPOINTS.XXL}px)`
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 Z-INDEX СЛОИ (для правильной укладки)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const Z_INDEX = {
  BASE: 1,
  CONTENT: 10,
  DROPDOWN: 50,
  STICKY: 40,
  MODAL: 100,
  NOTIFICATION: 110,
  TOOLTIP: 120,
  POPOVER: 130
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⏱️ ТАЙМАУТЫ И ЗАДЕРЖКИ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const TIMINGS = {
  TRANSITION_FAST: 150,    // ms
  TRANSITION_BASE: 300,    // ms
  TRANSITION_SLOW: 500,    // ms
  ANIMATION_FADE: 300,     // ms
  ANIMATION_SLIDE: 400,    // ms
  ANIMATION_BOUNCE: 600,   // ms
  API_TIMEOUT: 10000,      // 10 seconds
  API_RETRY_DELAY: 1000    // 1 second
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 РАЗМЕРЫ КОНТЕЙНЕРОВ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CONTAINER_SIZES = {
  HEADER_HEIGHT: '100px',
  HEADER_HEIGHT_MOBILE: '80px',
  SECTION_MAX_WIDTH: '1440px',
  SECTION_PADDING: '2rem',
  SECTION_PADDING_MOBILE: '1rem'
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 ЦВЕТА
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const COLORS = {
  PRIMARY_TEAL: '#1f9e8f',
  PRIMARY_MINT: '#26b8a3',
  SECONDARY_BLUE: '#1e3a8a',
  ACCENT_ORANGE: '#ff6b35',
  
  GRAY_50: '#f9fafb',
  GRAY_100: '#f3f4f6',
  GRAY_200: '#e5e7eb',
  GRAY_300: '#d1d5db',
  GRAY_400: '#9ca3af',
  GRAY_500: '#6b7280',
  GRAY_600: '#4b5563',
  GRAY_700: '#374151',
  GRAY_800: '#1f2937',
  GRAY_900: '#111827',
  
  WHITE: '#ffffff',
  BLACK: '#000000',
  
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔤 ШРИФТЫ И ТИПОГРАФИЯ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const TYPOGRAPHY = {
  FONT_FAMILY: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  
  SIZES: {
    XS: '0.75rem',
    SM: '0.875rem',
    BASE: '1rem',
    LG: '1.125rem',
    XL: '1.25rem',
    '2XL': '1.5rem',
    '3XL': '1.875rem',
    '4XL': '2.25rem',
    '5XL': '3rem'
  },
  
  WEIGHTS: {
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700
  },
  
  LINE_HEIGHTS: {
    TIGHT: 1.2,
    NORMAL: 1.5,
    RELAXED: 1.625,
    LOOSE: 2
  }
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔐 ВАЛИДАЦИЯ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-()]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 5000
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔗 ВНЕШНИЕ ССЫЛКИ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const EXTERNAL_LINKS = {
  REPOSITORY: 'https://github.com/openperspectives',
  DOCUMENTATION: 'https://docs.openperspectives.ru',
  BLOG: 'https://blog.openperspectives.ru'
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 АНАЛИТИКА
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ANALYTICS = {
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GA_ID || '',
  YANDEX_METRIKA_ID: import.meta.env.VITE_YM_ID || '',
  EVENTS: {
    MODAL_OPEN: 'modal_open',
    MODAL_CLOSE: 'modal_close',
    BUTTON_CLICK: 'button_click',
    FORM_SUBMIT: 'form_submit',
    PAGE_VIEW: 'page_view',
    ERROR: 'error'
  }
} as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌍 ЛОКАЛИЗАЦИЯ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LOCALES = {
  RU: 'ru',
  EN: 'en'
} as const

export type Locale = typeof LOCALES[keyof typeof LOCALES]

export const DEFAULT_LOCALE: Locale = LOCALES.RU


