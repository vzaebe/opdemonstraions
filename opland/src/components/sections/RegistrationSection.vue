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
        <button type="submit" class="submit-button">Зайти</button>
        <p class="form-note">При регистрации вы соглашаетесь с нашими правилами</p>
      </form>
    </div>
    <div class="registration-image">
      <img src="@/assets/images/placeholder.svg" alt="Регистрация" />
    </div>
  </section>
</template>

<script>
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
  height: 471px;
  display: inline-flex;
  flex-direction: column;
  gap: 0.625rem;
  align-items: flex-start;
  justify-content: flex-end;
}

.registration-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $primary-indigo;
  width: 470px;
  margin: 0;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  
  label {
    font-size: $text-sm;
    font-weight: 700;
    letter-spacing: 0.1em;
    line-height: $leading-relaxed;
    color: $primary-indigo;
    text-transform: uppercase;
  }
  
  input {
    width: 470px;
    height: 60px;
    padding: 1rem 20rem 1rem 1.5rem;
    border: 2px solid $gray-200;
    border-radius: $border-radius-full;
    font-size: $text-xl;
    font-weight: 500;
    line-height: $leading-relaxed;
    color: $gray-200;
    
    &::placeholder {
      color: $gray-200;
    }
  }
}

.submit-button {
  width: 13rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 5rem;
  background-color: $primary-green;
  border: none;
  border-radius: $border-radius-full;
  color: $white;
  font-size: $text-lg;
  font-weight: 500;
  line-height: $leading-relaxed;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: color.adjust($primary-green, $lightness: -10%);
  }
}

.form-note {
  width: 15rem;
  font-size: $text-base;
  line-height: $leading-relaxed;
  color: $gray-900;
  opacity: $opacity-40;
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
    border-radius: $border-radius-lg;
  }
}

@media (max-width: $breakpoint-lg) {
  .registration-section {
    height: auto;
    padding: 4rem 2rem;
  }
  
  .registration-content {
    position: static;
    width: 100%;
    height: auto;
    margin-bottom: 3rem;
  }
  
  .registration-title {
    width: 100%;
    font-size: $text-3xl;
  }
  
  .form-group input {
    width: 100%;
  }
  
  .registration-image {
    position: static;
    width: 100%;
    height: 400px;
  }
}
</style> 