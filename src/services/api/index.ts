/**
 * Слой сервисов API
 * Единая точка экспорта для HTTP клиента и доменных сервисов
 */
import { http, HttpError, TimeoutError, trackApiError } from './http'

export { http, HttpError, TimeoutError, trackApiError }

// Пример доменного сервиса (заготовка)
export const contentService = {
  async loadPartners() {
    return http.get('/partners')
  },
}

