import { http, trackApiError } from './http'
import type { ContactFormData, FormSubmissionResult } from '@/types/models'
import { VALIDATION } from '@/config/constants'

/**
 * 📧 Contact Service
 * 
 * Бизнес-логика для работы с контактами:
 * - Отправка сообщений
 * - Получение контактной информации
 * - Валидация контактных данных
 * 
 * Используется компонентами ContactSection и др.
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔐 ВАЛИДАЦИЯ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function validateEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email)
}

function validatePhone(phone?: string): boolean {
  if (!phone) return true // Phone is optional
  return VALIDATION.PHONE_REGEX.test(phone)
}

function validateContactForm(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < VALIDATION.NAME_MIN_LENGTH) {
    errors.push(`Имя должно быть не менее ${VALIDATION.NAME_MIN_LENGTH} символов`)
  }

  if (data.name.length > VALIDATION.NAME_MAX_LENGTH) {
    errors.push(`Имя должно быть не более ${VALIDATION.NAME_MAX_LENGTH} символов`)
  }

  if (!validateEmail(data.email)) {
    errors.push('Пожалуйста, введите корректный email адрес')
  }

  if (!validatePhone(data.phone)) {
    errors.push('Пожалуйста, введите корректный номер телефона')
  }

  if (!data.message || data.message.trim().length < VALIDATION.MESSAGE_MIN_LENGTH) {
    errors.push(`Сообщение должно быть не менее ${VALIDATION.MESSAGE_MIN_LENGTH} символов`)
  }

  if (data.message.length > VALIDATION.MESSAGE_MAX_LENGTH) {
    errors.push(`Сообщение должно быть не более ${VALIDATION.MESSAGE_MAX_LENGTH} символов`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📡 API SERVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const contactService = {
  /**
   * Отправить сообщение с контактной формы
   */
  async sendMessage(data: ContactFormData): Promise<FormSubmissionResult> {
    try {
      // Локальная валидация
      const validation = validateContactForm(data)
      if (!validation.valid) {
        return {
          success: false,
          message: 'Пожалуйста, заполните форму корректно',
          errors: validation.errors.map(message => ({
            field: 'form',
            message
          }))
        }
      }

      // Отправка на backend
      const response = await http.post('/contacts/send', data)

      return {
        success: true,
        message: 'Ваше сообщение успешно отправлено',
        data: response as Record<string, unknown>
      }
    } catch (error) {
      trackApiError(error, 'sendMessage')

      if (error instanceof Error) {
        return {
          success: false,
          message: error.message || 'Ошибка при отправке сообщения'
        }
      }

      return {
        success: false,
        message: 'Произошла неизвестная ошибка при отправке сообщения'
      }
    }
  },

  /**
   * Получить информацию о контактах
   */
  async getContactInfo(): Promise<{
    phone: string
    email: string
    telegram: string
    office?: string
  } | null> {
    try {
      const data = await http.get('/contacts/info')
      return data as {
        phone: string
        email: string
        telegram: string
        office?: string
      } | null
    } catch (error) {
      trackApiError(error, 'getContactInfo')
      return null
    }
  },

  /**
   * Подписать пользователя на рассылку
   */
  async subscribeToNewsletter(email: string): Promise<FormSubmissionResult> {
    try {
      if (!validateEmail(email)) {
        return {
          success: false,
          message: 'Пожалуйста, введите корректный email адрес'
        }
      }

      const response = await http.post('/contacts/subscribe', { email })

      return {
        success: true,
        message: 'Вы успешно подписаны на рассылку',
        data: response as Record<string, unknown>
      }
    } catch (error) {
      trackApiError(error, 'subscribeToNewsletter')

      if (error instanceof Error) {
        return {
          success: false,
          message: error.message || 'Ошибка при подписке на рассылку'
        }
      }

      return {
        success: false,
        message: 'Произошла неизвестная ошибка при подписке'
      }
    }
  },

  /**
   * Валидировать email
   */
  validateEmail,

  /**
   * Валидировать форму контакта
   */
  validateContactForm
}
