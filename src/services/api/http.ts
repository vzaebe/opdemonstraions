/**
 * 🌐 HTTP клиент приложения
 * 
 * Централизованный клиент для всех API запросов:
 * - Конфигурация базового URL
 * - Обработка ошибок
 * - Retry логика
 * - Интерсепторы для токенов и аналитики
 * 
 * Используется всеми services для взаимодействия с backend
 */

import type { ApiErrorResponse } from '@/types/models'
import { logApiEvent, logError as logFrontendError, logWarn } from '@/services/logger'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚙️ КОНФИГУРАЦИЯ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || '10000'
export const AUTH_TOKEN_STORAGE_KEY = 'op_auth_token'

export function getStoredAuthToken(): string | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function getAuthHeader(): Record<string, string> {
  const token = getStoredAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

interface RequestConfig extends RequestInit {
  timeout?: number
  retries?: number
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔧 УТИЛИТЫ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Экспоненциальная задержка для retry логики
 */
function getRetryDelay(attemptNumber: number): number {
  return Math.pow(2, attemptNumber) * 1000 // 1s, 2s, 4s...
}

/**
 * Проверяет, нужно ли повторить запрос
 */
function shouldRetry(status: number, attemptNumber: number, maxRetries: number): boolean {
  if (attemptNumber >= maxRetries) return false
  
  // Повторяем при 429 (Too Many Requests), 503 (Service Unavailable), 504 (Gateway Timeout)
  const retryableStatuses = [408, 429, 503, 504]
  return retryableStatuses.includes(status)
}

/**
 * Преобразует response в типизированный формат
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  
  if (!response.ok) {
    // Попытка парсить ошибку в JSON формате
    let errorData: ApiErrorResponse | null = null
    
    if (contentType?.includes('application/json')) {
      try {
        errorData = await response.json()
      } catch {
        // Если не смогли запарсить JSON, используем текст
        const text = await response.text()
        throw new HttpError(response.status, text || 'Unknown error', null)
      }
    }
    
    throw new HttpError(response.status, errorData?.error?.message || 'API Error', errorData)
  }
  
  if (contentType?.includes('application/json')) {
    return await response.json()
  }
  
  return (await response.text()) as unknown as T
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❌ КАСТОМНЫЕ ОШИБКИ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public data: ApiErrorResponse | null = null
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export class TimeoutError extends Error {
  constructor() {
    super('Request timeout')
    this.name = 'TimeoutError'
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 HTTP КЛИЕНТ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class HttpClient {
  private baseUrl: string
  private defaultTimeout: number

  constructor(baseUrl: string = API_BASE_URL, timeout: number = parseInt(API_TIMEOUT)) {
    this.baseUrl = baseUrl
    this.defaultTimeout = timeout
  }

  /**
   * Выполняет запрос с retry логикой
   */
  private async fetchWithRetry<T>(
    url: string,
    config: RequestConfig,
    attemptNumber = 0,
    maxRetries = 3
  ): Promise<T> {
    const controller = new AbortController()
    const timeout = config.timeout || this.defaultTimeout
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    const startedAt = Date.now()
    const method = (config.method || 'GET').toString().toUpperCase()

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        headers: this.getHeaders(config.headers as Record<string, string>)
      })

      clearTimeout(timeoutId)
      const result = await handleResponse<T>(response)

      logApiEvent({
        method,
        url,
        status: response.status,
        durationMs: Date.now() - startedAt,
        attempt: attemptNumber + 1,
        requestId: response.headers.get('x-request-id')
      })

      return result
    } catch (error) {
      clearTimeout(timeoutId)
      const durationMs = Date.now() - startedAt

      // Обработка таймаута
      if (error instanceof Error && error.name === 'AbortError') {
        logApiEvent({ method, url, durationMs, attempt: attemptNumber + 1, error: 'Request aborted (timeout)' })
        throw new TimeoutError()
      }

      // Обработка HTTP ошибок с retry
      if (error instanceof HttpError && shouldRetry(error.status, attemptNumber, maxRetries)) {
        const delay = getRetryDelay(attemptNumber)
        logApiEvent({
          method,
          url,
          status: error.status,
          durationMs,
          attempt: attemptNumber + 1,
          error: error.message,
          retryInMs: delay
        })
        logWarn('api', `Retrying request in ${delay}ms (attempt ${attemptNumber + 2}/${maxRetries})`, {
          url,
          status: error.status
        })
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.fetchWithRetry<T>(url, config, attemptNumber + 1, maxRetries)
      }

      logApiEvent({
        method,
        url,
        durationMs,
        attempt: attemptNumber + 1,
        error
      })

      throw error
    }

  }

  /**
   * Подготовляет заголовки запроса
   */
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    // Добавляем токен если есть
    const token = this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Получает токен из хранилища (реализовать по необходимости)
   */
  private getAuthToken(): string | null {
    return getStoredAuthToken()
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    return this.fetchWithRetry<T>(url, { method: 'GET', credentials: 'include', ...config })
  }

  /**
   * POST запрос
   */
  async post<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    return this.fetchWithRetry<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
      ...config
    })
  }

  /**
   * PUT запрос
   */
  async put<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    return this.fetchWithRetry<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
      ...config
    })
  }

  /**
   * PATCH запрос
   */
  async patch<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    return this.fetchWithRetry<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
      ...config
    })
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    return this.fetchWithRetry<T>(url, { method: 'DELETE', credentials: 'include', ...config })
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌍 ЭКСПОРТ ИНСТАНСА
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const http = new HttpClient()

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Error tracking helper for use in components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function trackApiError(error: unknown, context?: string): void {
  if (error instanceof HttpError) {
    logFrontendError('api', `API ${error.status}: ${error.message}`, {
      context: context || 'unknown',
      status: error.status,
      data: error.data
    })
    return
  }

  if (error instanceof TimeoutError) {
    logWarn('api', 'Request timeout', { context: context || 'unknown' })
    return
  }

  const message = error instanceof Error ? error.message : String(error)
  logFrontendError('api', `Unexpected error${context ? ` in ${context}` : ''}`, {
    context: context || 'unknown',
    message,
    error
  })
}
