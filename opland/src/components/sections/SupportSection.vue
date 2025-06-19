<template>
  <section class="support-section">
    <div class="support-container">
      <div class="support-content">
        <h2 class="support-title">Поддержите наш проект</h2>
        <p class="support-subtitle">
          Ваша поддержка помогает нам создавать инклюзивное будущее для всех
        </p>
        <div class="support-options">
          <div class="support-option">
            <h3>Волонтёрство</h3>
            <p>Помогите нам в организации мероприятий и проектов</p>
            <a href="#" class="support-link">Стать волонтёром</a>
          </div>
          <div class="support-option">
            <h3>Партнёрство</h3>
            <p>Сотрудничайте с нами для создания инклюзивной среды</p>
            <a href="#" class="support-link">Стать партнёром</a>
          </div>
          <div class="support-option">
            <h3>Пожертвования</h3>
            <p>Финансовая поддержка для развития наших проектов</p>
            <a href="#" class="support-link">Сделать пожертвование</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SupportSection'
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '@/assets/styles/variables.scss' as *;
.support-section {
  width: 100%;
  height: 500px;
  background-color: $primary-indigo;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.support-container {
  max-width: 1200px;
  width: 100%;
}

.support-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  text-align: center;
}

.support-title {
  font-size: $text-4xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $white;
  margin: 0;
}

.support-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  color: $white;
  opacity: $opacity-80;
  max-width: 600px;
  margin: 0;
}

.support-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
}

.support-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background-color: rgba($white, 0.1);
  border-radius: $border-radius-xl;
  backdrop-filter: blur(10px);
  border: 1px solid rgba($white, 0.2);
  
  h3 {
    font-size: $text-xl;
    font-weight: 700;
    color: $white;
    margin: 0;
  }
  
  p {
    font-size: $text-base;
    line-height: $leading-relaxed;
    color: $white;
    opacity: $opacity-80;
    text-align: center;
    margin: 0;
  }
}

.support-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: $primary-green;
  color: $white;
  text-decoration: none;
  border-radius: $border-radius-lg;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: color.adjust($primary-green, $lightness: -10%);
  }
}

@media (max-width: $breakpoint-lg) {
  .support-section {
    height: auto;
  }
  
  .support-content {
    gap: 2rem;
  }
  
  .support-title {
    font-size: $text-3xl;
  }
  
  .support-options {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: $breakpoint-md) {
  .support-options {
    grid-template-columns: 1fr;
  }
  
  .support-option {
    padding: 1.5rem;
  }
}
</style> 