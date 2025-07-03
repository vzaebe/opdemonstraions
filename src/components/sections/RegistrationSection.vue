<template>
  <section class="registration-section">
    <div class="registration-content">
      <div class="registration-form contact-form">
        <h2>Регистрация</h2>
        <p>Заполните форму для регистрации на платформе</p>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="reg-name">Имя</label>
            <input type="text" id="reg-name" v-model="form.name" placeholder="Ваше имя" />
          </div>
          <div class="form-group">
            <label for="reg-email">Почта</label>
            <input type="email" id="reg-email" v-model="form.email" placeholder="Ваша почта" />
          </div>
          <div class="form-group">
            <label for="reg-password">Пароль</label>
            <input type="password" id="reg-password" v-model="form.password" placeholder="Ваш пароль" />
          </div>
          <button type="submit">Зарегистрироваться</button>
          <p class="consent-text">Нажимая на кнопку, вы даёте согласие на обработку своих персональных данных.</p>
        </form>
      </div>
      <div class="registration-image">
        <img src="@/assets/png/openurfeatures.png" alt="Регистрация" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'RegistrationSection',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submitForm() {
      console.log('Registration form submitted:', this.form)
      this.form = {
        name: '',
        email: '',
        password: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.registration-section {
  position: relative;
  width: 100%;
  background: white;
  min-height: 800px;
}

.registration-content {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 0;
  align-items: flex-start;
  justify-content: center;
}

.registration-form.contact-form {
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

.consent-text {
  font-size: 0.75rem;
  color: #6B7280;
  margin-top: 0.5rem;
}

.registration-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;
  max-width: 600px;
  height: 100%;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 1rem;
  }
}

@media (max-width: 1024px) {
  .registration-content {
    flex-direction: column;
    padding: 2rem 0;
  }
  .registration-form.contact-form {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid #E5E7EB;
    padding-bottom: 2rem;
  }
  .registration-image {
    min-width: 0;
    max-width: 100%;
    margin-top: 2rem;
  }
}

@media (max-width: 640px) {
  .registration-section {
    min-height: auto;
  }
  .registration-content {
    padding: 1rem 0;
  }
  .registration-form.contact-form {
    padding: 1.5rem;
  }
  .registration-image {
    height: 200px;
    img {
      border-radius: 1rem;
    }
  }
}
</style>

