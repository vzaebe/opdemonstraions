<template>
  <section class="contact-section">
    <div class="contact-container">
      <div class="contact-info">
        <h2 class="contact-title">Свяжитесь с нами</h2>
        <p class="contact-subtitle">
          У вас есть вопросы или предложения? Мы всегда готовы помочь!
        </p>
        <div class="contact-details">
          <div class="contact-item">
            <img src="@/assets/images/icon.svg" alt="Email" />
            <span>info@opland.ru</span>
          </div>
          <div class="contact-item">
            <img src="@/assets/images/icon.svg" alt="Phone" />
            <span>+7 (495) 123-45-67</span>
          </div>
          <div class="contact-item">
            <img src="@/assets/images/icon.svg" alt="Address" />
            <span>г. Москва, ул. Примерная, д. 123</span>
          </div>
        </div>
      </div>
      <div class="contact-form">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Имя</label>
            <input type="text" id="name" v-model="form.name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="form.email" required />
          </div>
          <div class="form-group">
            <label for="message">Сообщение</label>
            <textarea id="message" v-model="form.message" rows="4" required></textarea>
          </div>
          <button type="submit" class="submit-btn">Отправить сообщение</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ContactSection',
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    submitForm() {
      // Здесь будет логика отправки формы
      console.log('Form submitted:', this.form)
      // Сброс формы
      this.form = {
        name: '',
        email: '',
        message: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '@/assets/styles/variables.scss' as *;
.contact-section {
  width: 100%;
  height: 600px;
  background-color: $gray-50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.contact-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  gap: 4rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
}

.contact-title {
  font-size: $text-4xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $primary-indigo;
  margin: 0;
}

.contact-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  color: $gray-700;
  margin: 0;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  
  img {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  span {
    font-size: $text-base;
    color: $gray-900;
    font-weight: 500;
  }
}

.contact-form {
  flex: 1;
  background-color: $white;
  padding: 2rem;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-lg;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  label {
    font-size: $text-sm;
    font-weight: 600;
    color: $gray-700;
  }
  
  input, textarea {
    padding: 0.75rem;
    border: 2px solid $gray-200;
    border-radius: $border-radius-md;
    font-size: $text-base;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: $primary-indigo;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
}

.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background-color: $primary-indigo;
  color: $white;
  border: none;
  border-radius: $border-radius-lg;
  font-size: $text-base;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: color.adjust($primary-indigo, $lightness: -10%);
  }
  
  &:active {
    transform: translateY(1px);
  }
}

@media (max-width: $breakpoint-lg) {
  .contact-section {
    height: auto;
  }
  
  .contact-container {
    flex-direction: column;
    text-align: center;
  }
  
  .contact-details {
    align-items: center;
  }
  
  .contact-item {
    width: 100%;
    max-width: 400px;
    justify-content: center;
  }
}

@media (max-width: $breakpoint-md) {
  .contact-form {
    padding: 1.5rem;
  }
}
</style> 