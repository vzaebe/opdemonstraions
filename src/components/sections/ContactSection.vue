<template>
  <section class="contact-section">
    <div class="map-container">
      <iframe
        src="https://yandex.ru/map-widget/v1/?ll=37.622738%2C55.692389&pt=37.622738,55.692389,pm2rdm&z=16"
        width="100%"
        height="250"
        frameborder="0"
        style="border-radius: 16px;"
      ></iframe>
    </div>
    <div class="contact-container">
      <div class="contact-content">
        <div class="contact-form">
          <h2>Свяжитесь с нами</h2>
          <p>Мы всегда открыты новым перспективам</p>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">ИМЯ</label>
              <input type="text" id="name" v-model="form.name" placeholder="Ваше имя" />
            </div>
            <div class="form-group">
              <label for="phone">ТЕЛЕФОН</label>
              <input type="tel" id="phone" v-model="form.phone" placeholder="Ваш телефон" />
            </div>
            <div class="form-group">
              <label for="email">ПОЧТА</label>
              <input type="email" id="email" v-model="form.email" placeholder="Ваша почта" />
            </div>
            <div class="form-group">
              <label for="message">СООБЩЕНИЕ</label>
              <textarea id="message" v-model="form.message" placeholder="Оставьте своё сообщение"></textarea>
            </div>
            <button type="submit">ОТПРАВИТЬ</button>
            <p class="consent-text">Нажимая на кнопку, вы даёте согласие на обработку своих персональных данных.</p>
          </form>
        </div>

        <div class="contact-info">
          <h2>Контакты</h2>
          <p>Если хотите связаться лично или написать, то мы всегда открыты</p>
          <div class="contact-details">
            <div class="contact-item">
              <a href="tel:+79150033935">+7 915 003 39 35</a>
            </div>
            <div class="contact-item">
              <a href="mailto:info@openperspectives.ru">info@openperspectives.ru</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'ContactSection',
  data() {
    return {
      form: {
        name: '',
        phone: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    submitForm() {
      console.log('Form submitted:', this.form)
      this.form = {
        name: '',
        phone: '',
        email: '',
        message: ''
      }
    }
  }
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
}

@media (max-width: 1024px) {
  .contact-content {
    flex-direction: column;
    padding: 2rem;
  }

  .contact-form {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid #E5E7EB;
    padding-bottom: 2rem;
  }

  .contact-info {
    padding-left: 0;
    padding-top: 2rem;
  }
}

@media (max-width: 640px) {
  .contact-section {
    height: auto;
  }

  .map-container {
    height: 180px;
  }

  .contact-container {
    padding: 1rem;
  }

  .contact-content {
    padding: 1.5rem;
  }
}
</style>