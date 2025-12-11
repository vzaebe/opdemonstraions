<template>
  <div class="charity-view">
    <!-- Hero Section -->
    <div class="request-hero">
      <div class="request-hero-background">
        <div class="request-hero-circle circle-1"></div>
        <div class="request-hero-circle circle-2"></div>
        <div class="request-hero-circle circle-3"></div>
      </div>
      <div class="request-hero-content">
        <div class="request-hero-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Бесплатная помощь</span>
        </div>
        <h1 class="request-hero-title">Подать заявку на 3D-печать</h1>
        <p class="request-hero-subtitle">
          Если вы представитель детского дома или родитель ребенка, которому нужна помощь 
          с изготовлением изделия на 3D-принтере (игрушка, протез, учебное пособие), 
          заполните форму ниже. Это совершенно бесплатно.
        </p>
        <div class="request-hero-features">
          <div class="feature-item">
            <span class="feature-icon">🆓</span>
            <span class="feature-text">Бесплатно</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">⚡</span>
            <span class="feature-text">Быстро</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">❤️</span>
            <span class="feature-text">От сердца</span>
          </div>
        </div>
      </div>
    </div>

    <UiSection background="bg-gray-50">
      <div class="back-row">
        <router-link :to="{ name: 'charity' }" class="back-link">
          ← Назад
        </router-link>
      </div>
      <!-- Process Steps -->
      <div class="process-steps">
        <div class="step-item">
          <div class="step-icon">1️⃣</div>
          <h3>Заполните форму</h3>
          <p>Расскажите, что вам нужно</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step-item">
          <div class="step-icon">2️⃣</div>
          <h3>Ждите ответа</h3>
          <p>Мы свяжемся с вами в течение 24 часов</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step-item">
          <div class="step-icon">3️⃣</div>
          <h3>Получите изделие</h3>
          <p>Волонтёр напечатает и отправит вам</p>
        </div>
      </div>

      <CharityRequestForm />
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import UiSection from '@/components/ui/Section.vue'
import CharityRequestForm from '@/components/charity/RequestForm.vue'
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.charity-view {
  min-height: 80vh;
  overflow: hidden;
}

.back-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: $spacing-4;
}

.back-link {
  color: $primary-teal;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: $spacing-1;

  &:hover {
    text-decoration: underline;
  }
}

.request-hero {
  position: relative;
  background: linear-gradient(135deg, #0694a2 0%, #0e9f6e 100%);
  color: $white;
  padding: $spacing-16 $spacing-4 $spacing-20;
  text-align: center;
  overflow: hidden;
}

.request-hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.1;
}

.request-hero-circle {
  position: absolute;
  border-radius: 50%;
  background: $white;
  animation: float 20s infinite ease-in-out;

  &.circle-1 {
    width: 400px;
    height: 400px;
    top: -150px;
    left: -100px;
  }

  &.circle-2 {
    width: 300px;
    height: 300px;
    bottom: -100px;
    right: -80px;
    animation-delay: 7s;
  }

  &.circle-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    right: 10%;
    animation-delay: 14s;
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(30px, -30px) rotate(180deg); }
}

.request-hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.request-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba($white, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.5rem;
  border-radius: $border-radius-full;
  margin-bottom: $spacing-6;
  font-size: $text-sm;
  font-weight: 600;
  border: 1px solid rgba($white, 0.3);
}

.badge-icon {
  width: 20px;
  height: 20px;
}

.request-hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: $spacing-4;
  font-weight: 800;
}

.request-hero-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto $spacing-10;
}

.request-hero-features {
  display: flex;
  justify-content: center;
  gap: $spacing-8;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: $spacing-4 $spacing-6;
  background: rgba($white, 0.15);
  backdrop-filter: blur(10px);
  border-radius: $border-radius-xl;
  border: 1px solid rgba($white, 0.25);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba($white, 0.25);
  }
}

.feature-icon {
  font-size: 2rem;
}

.feature-text {
  font-weight: 600;
  font-size: $text-sm;
}

.process-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-6;
  margin-bottom: $spacing-12;
  margin-top: -60px;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
  padding: 0 $spacing-4;
}

.step-item {
  background: $white;
  padding: $spacing-8;
  border-radius: $border-radius-xl;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex: 1;
  min-width: 200px;
  max-width: 280px;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  h3 {
    font-size: $text-xl;
    font-weight: 700;
    color: $gray-900;
    margin-bottom: $spacing-2;
  }

  p {
    font-size: $text-sm;
    color: $gray-600;
    line-height: $leading-relaxed;
  }
}

.step-icon {
  font-size: 3rem;
  margin-bottom: $spacing-3;
}

.step-arrow {
  font-size: 2rem;
  color: $primary-teal;
  font-weight: 700;

  @media (max-width: $breakpoint-md) {
    display: none;
  }
}
</style>




