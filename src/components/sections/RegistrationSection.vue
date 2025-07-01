<template>
  <section class="registration-section">
    <div class="registration-content">
      <h2 class="registration-title">Откройте новые возможности</h2>
      <form class="registration-form">
        <div class="form-group">
          <label>Имя</label>
          <input type="text" placeholder="Ваше имя" />
        </div>
        <div class="form-group">
          <label>Почта</label>
          <input type="email" placeholder="Ваша почта" />
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input type="password" placeholder="Ваш пароль" />
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-button">Зайти</button>
          <p class="form-note">При регистрации вы соглашаетесь с нашими правилами</p>
        </div>
      </form>
    </div>
    <div class="registration-image">
      <img src="@/assets/png/openurfeatures.png" alt="Регистрация" />
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'RegistrationSection'
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '@/assets/styles/variables.scss' as *;
.registration-section {
  position: relative;
  width: 100%;
  height: 800px;
  background-color: $white;
}

.registration-content {
  position: absolute;
  left: 115px;
  top: 100px;
  width: 470px;
  height: auto;
  display: inline-flex;
  flex-direction: column;
  gap: 2.5rem;
  align-items: flex-start;
  justify-content: center;
}

.registration-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $primary-teal;
  width: 470px;
  margin: 0;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: $text-sm;
    font-weight: 700;
    letter-spacing: 0.1em;
    line-height: $leading-relaxed;
    color: $primary-teal;
    text-transform: uppercase;
  }
  
  input {
    width: 100%;
    height: 60px;
    padding: 1rem 1.5rem;
    border: 1px solid $gray-200;
    border-radius: $border-radius-lg;
    font-size: $text-base;
    font-weight: 500;
    line-height: $leading-relaxed;
    color: $gray-500;
    
    &::placeholder {
      color: $gray-400;
    }
  }
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.submit-button {
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  background-color: $primary-teal;
  border: none;
  border-radius: $border-radius-full;
  color: $white;
  font-size: $text-base;
  font-weight: 700;
  line-height: $leading-relaxed;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: color.adjust($primary-teal, $lightness: -10%);
  }
}

.form-note {
  width: 15rem;
  font-size: $text-sm;
  line-height: $leading-relaxed;
  color: $gray-500;
  opacity: 1;
  margin: 0;
}

.registration-image {
  position: absolute;
  right: 0;
  top: 0;
  width: 685px;
  height: 800px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $border-radius-lg 0 0 $border-radius-lg;
  }
}

@media (max-width: $breakpoint-lg) {
  .registration-section {
    height: auto;
    padding: 4rem 2rem;
    flex-direction: column;
  }
  
  .registration-content {
    position: static;
    width: 100%;
    height: auto;
    margin-bottom: 3rem;
    padding: 0;
    align-items: center;
    text-align: center;
    gap: 2rem;
  }
  
  .registration-title {
    width: 100%;
    font-size: $text-3xl;
  }
  
  .form-group input {
    width: 100%;
  }

  .form-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .submit-button {
    width: 100%;
  }
  
  .registration-image {
    position: static;
    width: 100%;
    height: 400px;

    img {
      border-radius: $border-radius-lg;
    }
  }
}
</style> 