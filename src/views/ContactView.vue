<template>
  <div class="contact-view">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="hero-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">Свяжитесь с нами</span>
        </h1>
        <p class="hero-subtitle">Мы всегда открыты новым перспективам и готовы ответить на ваши вопросы</p>
      </div>
    </section>

    <!-- Main Contact Section -->
    <section class="main-contact-section">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Form -->
          <div id="contact-form" class="contact-form-wrapper">
            <div class="form-card">
              <div class="card-header">
                <div class="icon-wrapper">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h2>Напишите нам</h2>
                <p>Заполните форму, и мы свяжемся с вами в ближайшее время</p>
              </div>

              <!-- Status Message -->
              <transition name="fade">
                <div v-if="submitMessage" :class="['status-message', submitMessage.type]">
                  <svg v-if="submitMessage.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{{ submitMessage.text }}</span>
                </div>
              </transition>

              <form @submit.prevent="handleSubmit" class="contact-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="name">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Имя
                    </label>
                    <input
                      id="name"
                      v-model="formData.name"
                      type="text"
                      placeholder="Введите ваше имя"
                      :class="{ 'has-error': errors.name }"
                      @blur="validateField('name')"
                    />
                    <transition name="slide-down">
                      <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                    </transition>
                  </div>

                  <div class="form-group">
                    <label for="phone">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      Телефон
                    </label>
                    <input
                      id="phone"
                      v-model="formData.phone"
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      :class="{ 'has-error': errors.phone }"
                      @blur="validateField('phone')"
                    />
                    <transition name="slide-down">
                      <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
                    </transition>
                  </div>
                </div>

                <div class="form-group">
                  <label for="email">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Email
                  </label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    placeholder="your@email.com"
                    :class="{ 'has-error': errors.email }"
                    @blur="validateField('email')"
                  />
                  <transition name="slide-down">
                    <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                  </transition>
                </div>

                <div class="form-group">
                  <label for="message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Сообщение
                  </label>
                  <textarea
                    id="message"
                    v-model="formData.message"
                    placeholder="Расскажите, чем мы можем вам помочь..."
                    rows="5"
                    :class="{ 'has-error': errors.message }"
                    @blur="validateField('message')"
                  ></textarea>
                  <transition name="slide-down">
                    <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
                  </transition>
                </div>

                <button type="submit" :disabled="isSubmitting" class="submit-btn">
                  <span v-if="!isSubmitting">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Отправить сообщение
                  </span>
                  <span v-else class="loading">
                    <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    Отправка...
                  </span>
                </button>

                <p class="privacy-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Нажимая на кнопку, вы даёте согласие на <a href="#" class="policy-link">обработку персональных данных</a>
                </p>
              </form>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="contact-info-wrapper">
            <!-- Direct Contact Card -->
            <div class="info-card">
              <div class="card-header">
                <div class="icon-wrapper">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3>Контактная информация</h3>
              </div>

              <div class="contact-items">
                <a :href="`tel:${CONTACT.PHONE.replace(/\s/g, '')}`" class="contact-item">
                  <div class="item-icon phone">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div class="item-content">
                    <span class="item-label">Телефон</span>
                    <span class="item-value">{{ CONTACT.PHONE }}</span>
                  </div>
                </a>

                <a :href="`mailto:${CONTACT.EMAIL}`" class="contact-item">
                  <div class="item-icon email">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div class="item-content">
                    <span class="item-label">Email</span>
                    <span class="item-value">{{ CONTACT.EMAIL }}</span>
                  </div>
                </a>

                <a :href="CONTACT.TELEGRAM_URL" target="_blank" rel="noopener noreferrer" class="contact-item">
                  <div class="item-icon telegram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.093.036.306.02.472z"/>
                    </svg>
                  </div>
                  <div class="item-content">
                    <span class="item-label">Telegram</span>
                    <span class="item-value">Написать в мессенджер</span>
                  </div>
                </a>

                <div class="contact-item address">
                  <div class="item-icon location">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div class="item-content">
                    <span class="item-label">Адрес</span>
                    <span class="item-value">117105, г. Москва, Варшавское шоссе, д. 33</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Working Hours Card -->
            <div class="info-card hours-card">
              <div class="card-header">
                <div class="icon-wrapper">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3>График работы</h3>
              </div>
              <div class="hours-list">
                <div class="hours-item">
                  <span class="day">Понедельник - Пятница</span>
                  <span class="time">10:00 - 19:00</span>
                </div>
                <div class="hours-item">
                  <span class="day">Суббота - Воскресенье</span>
                  <span class="time">Выходной</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="map-section">
      <div class="container">
        <div class="map-header">
          <h2>Как нас найти</h2>
          <p>Мы находимся в Москве на Варшавском шоссе</p>
        </div>
        <div class="map-wrapper">
          <iframe
            :src="mapUrl"
            width="100%"
            height="500"
            frameborder="0"
            allowfullscreen
            title="Наше местоположение на карте"
          ></iframe>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <div class="faq-header">
          <h2>Часто задаваемые вопросы</h2>
          <p>Ответы на популярные вопросы о наших услугах</p>
        </div>
        <div class="faq-list">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index" 
            class="faq-item"
            :class="{ 'active': activeFaq === index }"
            @click="toggleFaq(index)"
          >
            <div class="faq-question">
              <h3>{{ faq.question }}</h3>
              <svg 
                class="faq-icon" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <transition name="expand">
              <div v-show="activeFaq === index" class="faq-answer">
                <p>{{ faq.answer }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CONTACT, VALIDATION } from '../config'
import { contactService } from '../services/api/contact'
import { useAnalytics } from '../composables/useAnalytics'
import type { ContactFormData } from '../types/models'

// Map URL
const mapUrl = 'https://yandex.ru/map-widget/v1/?ll=37.622738%2C55.692389&pt=37.622738,55.692389,pm2rdm&z=16'

// Form state
const formData = reactive<ContactFormData>({
  name: '',
  email: '',
  phone: undefined,
  message: ''
})

const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)
const submitMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// Analytics
const { trackButtonClick, trackError } = useAnalytics()

// FAQ state
const activeFaq = ref<number | null>(null)

const faqs = [
  {
    question: 'Как быстро вы отвечаете на обращения?',
    answer: 'Мы стараемся отвечать на все обращения в течение 24 часов в рабочие дни. В выходные дни ответ может занять немного больше времени.'
  },
  {
    question: 'Можно ли приехать в офис лично?',
    answer: 'Да, вы можете посетить наш офис по предварительной записи. Пожалуйста, свяжитесь с нами заранее, чтобы согласовать удобное время встречи.'
  },
  {
    question: 'Какие способы связи наиболее удобны?',
    answer: 'Вы можете связаться с нами через форму на сайте, по телефону, email или Telegram. Выберите наиболее удобный для вас способ связи.'
  },
  {
    question: 'Работаете ли вы с регионами?',
    answer: 'Да, мы работаем со всеми регионами России. Многие наши услуги доступны онлайн, что позволяет эффективно сотрудничать удаленно.'
  }
]

function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

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

async function handleSubmit(): Promise<void> {
  // Validate all fields
  Object.keys(formData).forEach(key => {
    validateField(key as keyof ContactFormData)
  })

  // Check for errors
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
    const result = await contactService.sendMessage(formData)

    if (result.success) {
      submitMessage.value = {
        type: 'success',
        text: 'Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.'
      }

      trackButtonClick('contact_form_submit')

      // Reset form
      formData.name = ''
      formData.email = ''
      formData.phone = undefined
      formData.message = ''

      // Clear message after 5 seconds
      setTimeout(() => {
        submitMessage.value = null
      }, 5000)
    } else {
      const errorText = result.message || 'Ошибка при отправке сообщения'
      submitMessage.value = {
        type: 'error',
        text: errorText
      }

      trackError(new Error(errorText), 'contact_form_submission')
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

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.contact-view {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

// Hero Section
.contact-hero {
  position: relative;
  padding: 8rem 2rem 6rem;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .hero-background {
    position: absolute;
    inset: 0;
    overflow: hidden;

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float 20s ease-in-out infinite;

      &.orb-1 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.8), transparent);
        top: -100px;
        left: -100px;
        animation-delay: 0s;
      }

      &.orb-2 {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(118, 75, 162, 0.8), transparent);
        top: 50%;
        right: -50px;
        animation-delay: -7s;
      }

      &.orb-3 {
        width: 350px;
        height: 350px;
        background: radial-gradient(circle, rgba(46, 172, 180, 0.6), transparent);
        bottom: -100px;
        left: 50%;
        animation-delay: -14s;
      }
    }
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      line-height: 1.2;

      .gradient-text {
        background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

// Main Contact Section
.main-contact-section {
  padding: 4rem 2rem;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .contact-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 3rem;
  }
}

// Form Card
.contact-form-wrapper {
  .form-card {
    background: white;
    border-radius: 24px;
    padding: 3rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      margin-bottom: 2rem;

      .icon-wrapper {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        color: white;
      }

      h2 {
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.5rem;
      }

      p {
        color: #64748b;
        font-size: 1rem;
        line-height: 1.6;
      }
    }
  }
}

.status-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;

  svg {
    flex-shrink: 0;
  }

  &.success {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
    border: 1px solid #6ee7b7;
  }

  &.error {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
    border: 1px solid #fca5a5;
  }
}

.contact-form {
  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.75rem;

      svg {
        color: #667eea;
      }
    }

    input,
    textarea {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s ease;
      background: #f8fafc;

      &:focus {
        outline: none;
        border-color: #667eea;
        background: white;
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
      }

      &.has-error {
        border-color: #ef4444;
        background: #fef2f2;
      }

      &::placeholder {
        color: #94a3b8;
      }
    }

    textarea {
      resize: vertical;
      min-height: 140px;
    }
  }

  .error-message {
    display: block;
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-weight: 500;
  }
}

.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.privacy-note {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.6;

  svg {
    flex-shrink: 0;
    margin-top: 0.25rem;
    color: #94a3b8;
  }

  .policy-link {
    color: #667eea;
    text-decoration: underline;
    transition: color 0.2s ease;

    &:hover {
      color: #764ba2;
    }
  }
}

// Contact Info Cards
.contact-info-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .info-card {
    background: white;
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      margin-bottom: 2rem;

      .icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: 14px;
        background: linear-gradient(135deg, #2eacb4 0%, #1a8891 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.25rem;
        color: white;
      }

      h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e293b;
      }
    }
  }
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;

    &:not(.address) {
      cursor: pointer;

      &:hover {
        background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
        transform: translateX(4px);

        .item-icon {
          transform: scale(1.1);
        }
      }
    }

    .item-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;

      &.phone {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
      }

      &.email {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
      }

      &.telegram {
        background: linear-gradient(135deg, #0088cc 0%, #006699 100%);
        color: white;
      }

      &.location {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
      }
    }

    .item-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;

      .item-label {
        font-size: 0.875rem;
        color: #64748b;
        font-weight: 500;
      }

      .item-value {
        font-size: 1rem;
        color: #1e293b;
        font-weight: 600;
      }
    }
  }
}

.hours-card {
  .hours-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .hours-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

      .day {
        font-size: 0.95rem;
        color: #475569;
        font-weight: 500;
      }

      .time {
        font-size: 1rem;
        color: #1e293b;
        font-weight: 700;
      }
    }
  }
}

// Map Section
.map-section {
  padding: 4rem 2rem;
  background: white;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .map-header {
    text-align: center;
    margin-bottom: 3rem;

    h2 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.125rem;
      color: #64748b;
    }
  }

  .map-wrapper {
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
    height: 500px;

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}

// FAQ Section
.faq-section {
  padding: 4rem 2rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .faq-header {
    text-align: center;
    margin-bottom: 3rem;

    h2 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.125rem;
      color: #64748b;
    }
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .faq-item {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
      }

      &.active {
        .faq-icon {
          transform: rotate(180deg);
        }
      }

      .faq-question {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;

        h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .faq-icon {
          flex-shrink: 0;
          color: #667eea;
          transition: transform 0.3s ease;
        }
      }

      .faq-answer {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;

        p {
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }
      }
    }
  }
}

// Animations
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  animation: slideDown 0.3s ease-out;
}

.slide-down-leave-active {
  animation: slideDown 0.3s ease-out reverse;
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}

// Responsive
@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .contact-hero {
    padding: 6rem 1.5rem 4rem;

    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.125rem;
    }
  }
}

@media (max-width: 768px) {
  .contact-hero {
    padding: 5rem 1rem 3rem;

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }
  }

  .main-contact-section,
  .map-section,
  .faq-section {
    padding: 3rem 1rem;
  }

  .form-card,
  .info-card {
    padding: 2rem;
  }

  .contact-form .form-row {
    grid-template-columns: 1fr;
  }

  .map-wrapper {
    height: 350px;
  }

  .faq-header h2,
  .map-header h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .contact-hero {
    padding: 4rem 1rem 2rem;

    .hero-title {
      font-size: 1.75rem;
    }
  }

  .form-card,
  .info-card {
    padding: 1.5rem;
  }

  .card-header .icon-wrapper {
    width: 48px;
    height: 48px;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .map-wrapper {
    height: 300px;
  }
}
</style>








