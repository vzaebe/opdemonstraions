<template>
  <section class="contact-section">
    <div class="map-container">
      <iframe
        :src="mapUrl"
        width="100%"
        height="250"
        frameborder="0"
        style="border-radius: 16px;"
        title="Наше местоположение на карте"
      ></iframe>
    </div>
    <div class="contact-container">
      <div class="contact-content">
        <!-- Форма контакта -->
        <div class="contact-form">
          <h2>Свяжитесь с нами</h2>
          <p>Мы всегда открыты новым перспективам</p>

          <!-- Сообщение об успехе/ошибке -->
          <div v-if="submitMessage" :class="['form-message', submitMessage.type]">
            {{ submitMessage.text }}
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">ИМЯ</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Ваше имя"
                required
                @blur="validateField('name')"
              />
              <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="phone">ТЕЛЕФОН</label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                placeholder="Ваш телефон"
                @blur="validateField('phone')"
              />
              <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label for="email">ПОЧТА</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="Ваша почта"
                required
                @blur="validateField('email')"
              />
              <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="message">СООБЩЕНИЕ</label>
              <textarea
                id="message"
                v-model="formData.message"
                placeholder="Оставьте своё сообщение"
                required
                @blur="validateField('message')"
              ></textarea>
              <span v-if="errors.message" class="error-text">{{ errors.message }}</span>
            </div>

            <button type="submit" :disabled="isSubmitting" class="submit-button">
              {{ isSubmitting ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ' }}
            </button>

            <p class="consent-text">
              Нажимая на кнопку, вы даёте согласие на
              <a href="#" class="policy-link">обработку своих персональных данных</a>.
            </p>
          </form>
        </div>

        <!-- Информация о контактах -->
        <div class="contact-info">
          <h2>Контакты</h2>
          <p>Если хотите связаться лично или написать, то мы всегда открыты</p>
          <div class="contact-details">
            <div class="contact-item">
              <a :href="`tel:${CONTACT.PHONE}`" :title="CONTACT.PHONE">
                {{ CONTACT.PHONE }}
              </a>
            </div>
            <div class="contact-item">
              <a :href="`mailto:${CONTACT.EMAIL}`" :title="CONTACT.EMAIL">
                {{ CONTACT.EMAIL }}
              </a>
            </div>
            <div class="contact-item">
              <a :href="CONTACT.TELEGRAM_URL" target="_blank" rel="noopener noreferrer">
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CONTACT, VALIDATION } from '../../config'
import { contactService } from '../../services/api/contact'
import { useAnalytics } from '../../composables/useAnalytics'
import type { ContactFormData, FormValidationError } from '../../types/models'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Константы
const mapUrl = 'https://yandex.ru/map-widget/v1/?ll=37.622738%2C55.692389&pt=37.622738,55.692389,pm2rdm&z=16'

// Состояние формы
const formData = reactive<ContactFormData>({
  name: '',
  email: '',
  phone: undefined,
  message: ''
})

const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)
const submitMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// Аналитика
const { trackButtonClick, trackError } = useAnalytics()

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Валидирует отдельное поле формы
 */
function validateField(fieldName: keyof ContactFormData): void {
  const value = formData[fieldName]

  switch (fieldName) {
    case 'name':
      if (!value || (value as string).trim().length < VALIDATION.NAME_MIN_LENGTH) {
        errors[fieldName] = `Имя должно быть не менее ${VALIDATION.NAME_MIN_LENGTH} символов`
      } else if ((value as string).length > VALIDATION.NAME_MAX_LENGTH) {
        errors[fieldName] = `Имя должно быть не более ${VALIDATION.NAME_MAX_LENGTH} символов`
      } else {
        delete errors[fieldName]
      }
      break

    case 'email':
      if (!value || !VALIDATION.EMAIL_REGEX.test(value as string)) {
        errors[fieldName] = 'Пожалуйста, введите корректный email адрес'
      } else {
        delete errors[fieldName]
      }
      break

    case 'phone':
      if (value && !VALIDATION.PHONE_REGEX.test(value as string)) {
        errors[fieldName] = 'Пожалуйста, введите корректный номер телефона'
      } else {
        delete errors[fieldName]
      }
      break

    case 'message':
      if (!value || (value as string).trim().length < VALIDATION.MESSAGE_MIN_LENGTH) {
        errors[fieldName] = `Сообщение должно быть не менее ${VALIDATION.MESSAGE_MIN_LENGTH} символов`
      } else if ((value as string).length > VALIDATION.MESSAGE_MAX_LENGTH) {
        errors[fieldName] = `Сообщение должно быть не более ${VALIDATION.MESSAGE_MAX_LENGTH} символов`
      } else {
        delete errors[fieldName]
      }
      break
  }
}

/**
 * Обработчик отправки формы
 */
async function handleSubmit(): Promise<void> {
  // Валидируем все поля
  Object.keys(formData).forEach(key => {
    validateField(key as keyof ContactFormData)
  })

  // Если есть ошибки, не отправляем
  if (Object.keys(errors).length > 0) {
    submitMessage.value = {
      type: 'error',
      text: 'Пожалуйста, исправьте ошибки в форме'
    }
    return
  }

  isSubmitting.value = true
  submitMessage.value = null

  try {
    // Отправляем через service
    const result = await contactService.sendMessage(formData)

    if (result.success) {
      // Успех
      submitMessage.value = {
        type: 'success',
        text: 'Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.'
      }

      // Трекируем событие
      trackButtonClick('contact_form_submit')

      // Очищаем форму
      formData.name = ''
      formData.email = ''
      formData.phone = undefined
      formData.message = ''

      // Очищаем сообщение через 5 секунд
      setTimeout(() => {
        submitMessage.value = null
      }, 5000)
    } else {
      // Ошибка
      const errorText = result.message || 'Ошибка при отправке сообщения'
      submitMessage.value = {
        type: 'error',
        text: errorText
      }

      trackError(
        new Error(errorText),
        'contact_form_submission'
      )
    }
  } catch (error) {
    const errorMessage = 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.'
    submitMessage.value = {
      type: 'error',
      text: errorMessage
    }

    trackError(
      error instanceof Error ? error : new Error(String(error)),
      'contact_form_error'
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<script lang="ts">
export default {
  name: 'ContactSection'
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.contact-section {
  position: relative;
  width: 100%;
  background: white;
}

.map-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  height: 250px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.contact-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.contact-content {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem;
}

.contact-form {
  flex: 1;
  padding-right: 3rem;
  border-right: 1px solid #E5E7EB;
  background: linear-gradient(135deg, $white, rgba(46, 172, 180, 0.05));
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, $primary-teal, $primary-mint, $primary-cyan, $primary-coral, $primary-orange);
    background-size: 300% 100%;
    animation: colorFlow 3s ease-in-out infinite;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6B7280;
    margin-bottom: 2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

@keyframes colorFlow {
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
  }

  input, textarea {
    padding: 0.75rem;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    &::placeholder {
      color: #9CA3AF;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
}

button {
  background: linear-gradient(135deg, #2193b0, #6dd5ed);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s, transform 0.3s;
  position: relative;
  overflow: hidden;
  z-index: 1;
  text-shadow: 0 2px 12px rgba(0,0,0,0.35), 0 0 4px #fff;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(46, 172, 180, 0.3);
    background: linear-gradient(135deg, #f7971e, #ffd200);
  }
}

.contact-info {
  flex: 1;
  padding-left: 2rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1F2937;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6B7280;
    margin-bottom: 2rem;
  }
}

.contact-details {
  margin-bottom: 2rem;

  .contact-item {
    margin-bottom: 1rem;

    a {
      color: var(--color-primary);
      text-decoration: none;
      font-size: 1.125rem;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

/* Consent text styling */
.consent-text {
  font-size: 0.75rem;
  color: #6B7280;
  margin-top: 0.5rem;

  .policy-link {
    color: $primary-teal;
    text-decoration: underline;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ✨ Новые стили для валидации и сообщений об ошибках ✨ */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

.error-text {
  display: block;
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  animation: slideDown 0.2s ease-out;
}

.form-message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  animation: slideDown 0.3s ease-out;
  font-weight: 500;

  &.success {
    background-color: #d1fae5;
    border: 1px solid #6ee7b7;
    color: #065f46;
  }

  &.error {
    background-color: #fee2e2;
    border: 1px solid #fca5a5;
    color: #7f1d1d;
  }
}

.submit-button {
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 12px rgba(46, 172, 180, 0.2);
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Планшеты
@media (max-width: $breakpoint-lg) {
  .contact-content {
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
  }

  .contact-form {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid #E5E7EB;
    padding-bottom: 2rem;
  }

  .contact-info {
    padding-left: 0;
    padding-top: 0;
  }

  .map-container {
    height: 200px;
  }
}

// Мобильные устройства
@media (max-width: $breakpoint-md) {
  .contact-section {
    height: auto;
    min-height: auto;
  }

  .map-container {
    height: 180px;

    iframe {
      border-radius: 12px;
    }
  }

  .contact-container {
    padding: 1rem;
  }

  .contact-content {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .contact-form {
    h2 {
      font-size: 1.75rem;
    }

    p {
      font-size: 0.95rem;
    }

    button {
      padding: 1rem;
      font-size: 1rem;
      min-height: 48px; // touch-friendly
      border-radius: 8px;
    }
  }

  .contact-info {
    h2 {
      font-size: 1.75rem;
    }

    p {
      font-size: 0.95rem;
    }
  }

  .contact-item a {
    font-size: 1rem;
    padding: 0.5rem 0;
    display: block;
    min-height: 44px; // touch-friendly
    display: flex;
    align-items: center;
  }

  .form-group {
    input, textarea {
      padding: 1rem;
      font-size: 1rem;
      border-radius: 8px;
    }

    textarea {
      min-height: 120px;
    }

    label {
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }
  }
}

// Маленькие мобильные экраны
@media (max-width: $breakpoint-sm) {
  .map-container {
    height: 160px;
    margin: 1rem 0;
  }

  .contact-container {
    padding: 0.75rem;
  }

  .contact-content {
    padding: 1rem;
    gap: 1rem;
  }

  .contact-form {
    padding-bottom: 1.5rem;

    h2 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    button {
      padding: 0.875rem;
      font-size: 0.95rem;
    }
  }

  .contact-info {
    h2 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
  }

  .form-group {
    margin-bottom: 1.25rem;

    input, textarea {
      padding: 0.875rem;
      font-size: 0.95rem;
    }

    label {
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }
  }

  .consent-text {
    font-size: 0.7rem;
    line-height: 1.4;
    margin-top: 0.75rem;
  }
}
</style>
