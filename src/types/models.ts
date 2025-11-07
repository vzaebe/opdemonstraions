/**
 * 📋 Типовые модели приложения
 * 
 * Единая типизация всех бизнес-сущностей:
 * - Данные команды
 * - Форм-данные
 * - Секции и контент
 * - Результаты API
 * 
 * Используется всеми компонентами, сервисами и stores для гарантии консистентности
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👥 КОМАНДА И СОТРУДНИКИ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface SocialLinks {
  telegram?: string
  linkedin?: string
  github?: string
  twitter?: string
  email?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  position: string
  bio: string
  photo: string
  socials: SocialLinks
  department?: string
  yearsInTeam?: number
  specialization?: string[]
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📝 ФОРМЫ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  subscribe?: boolean
}

export interface RegistrationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName?: string
  message?: string
}

export interface SubscribeFormData {
  email: string
  fullName?: string
}

export interface FormValidationError {
  field: string
  message: string
}

export interface FormSubmissionResult {
  success: boolean
  message: string
  errors?: FormValidationError[]
  data?: Record<string, unknown>
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 СЕКЦИИ И КОНТЕНТ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface Section {
  id: string
  title: string
  description?: string
  enabled: boolean
  order: number
  component?: string
}

export interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'video' | 'card'
  title?: string
  content: string
  image?: string
  link?: string
}

export interface TestimonialCard {
  id: string
  author: string
  position: string
  company?: string
  text: string
  rating: number
  avatar?: string
  date?: string
}

export interface ServiceCard {
  id: string
  title: string
  description: string
  icon?: string
  image?: string
  features?: string[]
  price?: number
  link?: string
}

export interface ProjectCard {
  id: string
  title: string
  description: string
  image: string
  category?: string
  tags?: string[]
  link?: string
  featured?: boolean
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏢 ПАРТНЕРЫ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface Partner {
  id: string
  name: string
  logo: string
  description?: string
  website?: string
  category?: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🖼️ МЕДИА И ГАЛЕРЕИ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface MediaFile {
  id: string
  url: string
  title?: string
  description?: string
  type: 'image' | 'video' | 'document'
  thumbnail?: string
  alt?: string
}

export interface GalleryItem {
  id: string
  image: string
  title: string
  description?: string
  category?: string
  link?: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📱 МОДАЛЬНЫЕ ОКНА
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ModalType = 'member' | 'contact' | 'subscribe' | 'gallery' | 'confirmation'

export interface ModalState {
  isOpen: boolean
  type: ModalType | null
  data?: unknown
  title?: string
  message?: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👤 ПОЛЬЗОВАТЕЛЬ И ПРЕДПОЧТЕНИЯ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type Theme = 'light' | 'dark' | 'auto'
export type Language = 'ru' | 'en'

export interface UserPreferences {
  theme: Theme
  language: Language
  reducedMotion: boolean
  notifications: boolean
  emailSubscription: boolean
}

export interface UserProfile {
  id?: string
  email: string
  preferences: UserPreferences
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 АНАЛИТИКА
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
  timestamp: number
}

export interface AnalyticsReport {
  pageViews: number
  modalOpens: number
  buttonClicks: number
  formSubmissions: number
  errors: number
  timestamp: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚠️ ОШИБКИ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: number
  context?: string
}

export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: unknown
  }
  status: number
  timestamp: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔄 API ОТВЕТЫ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiErrorResponse
  meta?: {
    timestamp: string
    version: string
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⏳ АСИНХРОННЫЕ СОСТОЯНИЯ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  status: AsyncStatus
  data?: T
  error?: AppError
  isLoading: boolean
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛡️ УТИЛИТЫ ДЛЯ ТИПОВ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Проверяет, содержит ли объект значение
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

/**
 * Преобразует AsyncState в boolean для проверки загрузки
 */
export function isAsyncLoading<T>(state: AsyncState<T>): boolean {
  return state.status === 'loading' || state.isLoading
}

/**
 * Преобразует AsyncState в boolean для проверки ошибки
 */
export function isAsyncError<T>(state: AsyncState<T>): boolean {
  return state.status === 'error' && isDefined(state.error)
}

/**
 * Проверяет, успешно ли выполнена асинхронная операция
 */
export function isAsyncSuccess<T>(state: AsyncState<T>): boolean {
  return state.status === 'success' && isDefined(state.data)
}


