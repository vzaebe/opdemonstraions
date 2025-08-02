<script lang="ts" setup>
/**
 * Секция «Регистрация» (RegistrationSection).
 * Форма регистрации на мероприятие/платформу. Состояние хранится в ref,
 * отправка выводит данные в консоль и сбрасывает форму.
 */
import { ref } from 'vue'
import openurfeatures from '@/assets/png/openurfeatures.png'
import { POLICY_LINKS } from '@/config/links'

const form = ref({
  name: '',
  email: '',
  password: ''
})

function submitForm() {
  console.log('Registration form submitted:', form.value)
  form.value = { name: '', email: '', password: '' }
}
</script>

<template>
  <section class="registration-section">
    <div class="image-container">
      <img :src="openurfeatures" alt="Регистрация" />
    </div>
    <div class="registration-container">
      <div class="form-container">
        <div class="form-content">
          <h2>Откройте новые возможности</h2>
          <form @submit.prevent="submitForm" class="registration-form">
            <div class="form-group">
              <label for="reg-name">ИМЯ</label>
              <input type="text" id="reg-name" v-model="form.name" placeholder="Ваше имя" />
            </div>
            <div class="form-group">
              <label for="reg-email">ПОЧТА</label>
              <input type="email" id="reg-email" v-model="form.email" placeholder="Ваша почта" />
            </div>
            <div class="form-group">
              <label for="reg-password">ПАРОЛЬ</label>
              <input type="password" id="reg-password" v-model="form.password" placeholder="Ваш пароль" />
            </div>
            <button type="submit" class="submit-btn">Зайти</button>
            <p class="consent-text">
              При регистрации вы соглашаетесь с 
              <a :href="POLICY_LINKS.TERMS_OF_USE" class="policy-link" target="_blank" rel="noopener">правилами</a> и 
              <a :href="POLICY_LINKS.PERSONAL_DATA_AGREEMENT" class="policy-link" target="_blank" rel="noopener">обработкой персональных данных</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.registration-section {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    animation: float 20s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.registration-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  max-width: 1200px;
  position: relative;
  z-index: 1;
}

.form-container {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4rem;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    animation: shimmer 3s infinite;
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.form-content {
  width: 50%;
  max-width: 500px;
  position: relative;
  z-index: 2;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 3rem;
    line-height: 1.2;
    animation: slideInFromTop 1s ease-out;
  }
}

@keyframes slideInFromTop {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: slideInFromBottom 1s ease-out 0.3s both;
}

@keyframes slideInFromBottom {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}



.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;

  &:nth-child(1) { animation-delay: 0.5s; }
  &:nth-child(2) { animation-delay: 0.7s; }
  &:nth-child(3) { animation-delay: 0.9s; }

  animation: slideInFromLeft 0.8s ease-out both;

  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }
  }

  input {
    padding: 1rem;
    border: 2px solid transparent;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #667eea, #764ba2) border-box;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    position: relative;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    &:focus {
      outline: none;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      background: linear-gradient(white, white) padding-box,
                  linear-gradient(135deg, #667eea, #764ba2) border-box;
    }

    &::placeholder {
      color: #999;
      transition: all 0.3s;
    }

    &:focus::placeholder {
      transform: translateY(-2px);
      opacity: 0.7;
    }
  }

  &:hover label::after {
    width: 100%;
  }

  &:focus-within label {
    color: #667eea;
    transform: translateY(-2px);
  }
}

@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  animation: slideInFromBottom 0.8s ease-out 1.1s both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #764ba2, #667eea);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
    transition: all 0.1s;
  }
}

.consent-text {
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;
  text-align: center;
  opacity: 0.8;
  animation: fadeIn 1s ease-out 1.3s both;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: translateY(-1px);
  }

  .policy-link {
    color: #667eea;
    text-decoration: underline;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.8;
  }
}

.image-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg,
      rgba(102, 126, 234, 0.3) 0%,
      rgba(118, 75, 162, 0.3) 50%,
      rgba(102, 126, 234, 0.3) 100%);
    z-index: 1;
    animation: colorShift 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    z-index: 2;
    animation: borderPulse 3s ease-in-out infinite;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    animation: slideInFromRight 1s ease-out 0.5s both;

    &:hover {
      transform: scale(1.05);
    }
  }
}

@keyframes slideInFromRight {
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes colorShift {
  0%, 100% {
    background: linear-gradient(45deg,
      rgba(102, 126, 234, 0.3) 0%,
      rgba(118, 75, 162, 0.3) 50%,
      rgba(102, 126, 234, 0.3) 100%);
  }
  50% {
    background: linear-gradient(45deg,
      rgba(118, 75, 162, 0.3) 0%,
      rgba(102, 126, 234, 0.3) 50%,
      rgba(118, 75, 162, 0.3) 100%);
  }
}

@keyframes borderPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.02);
  }
}

@media (max-width: 1024px) {
  .registration-container {
    flex-direction: column;
  }
  .form-container {
    width: 100%;
    padding: 2rem;
    justify-content: center;

    &::before {
      animation: shimmer 4s infinite;
    }
  }
  .form-content {
    width: 100%;
    max-width: 600px;
  }
  .image-container {
    position: relative;
    width: 100%;
    height: 400px;
    top: auto;
    right: auto;

    &::after {
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
    }
  }
}

@media (max-width: 640px) {
  .registration-section {
    height: auto;
    min-height: 100vh;

    &::before {
      animation: float 15s ease-in-out infinite;
    }
  }
  .form-container {
    padding: 1.5rem;
  }
  .form-content {
    width: 100%;
    max-width: 100%;

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
  }
  .image-container {
    height: 300px;

    &::after {
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      border-radius: 15px;
    }
  }
  .form-group {
    gap: 0.5rem;

    input {
      padding: 0.875rem;
    }
  }
  .submit-btn {
    padding: 0.875rem 1.5rem;
  }
}
</style>

