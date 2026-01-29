<template>
  <div class="landing">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Закажите <span class="highlight">3D-печать</span> онлайн
          </h1>
          <p class="hero-subtitle">
            Загрузите модель, получите мгновенную оценку стоимости и сроков
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" @click="goToCalculator">
              Рассчитать стоимость
            </button>
          </div>
        </div>
        
        <!-- TODO: 3D Text Animation (ThreeText3D) -->
        <div class="hero-3d">
          <div class="placeholder-3d">
            3D Animation будет здесь
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>Как это работает</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📤</div>
            <h3>Загрузите модель</h3>
            <p>STL, 3MF или другие форматы</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚙️</div>
            <h3>Выберите параметры</h3>
            <p>Материал, качество, постобработка</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Получите расчет</h3>
            <p>Мгновенная оценка стоимости и сроков</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>Оформите заказ</h3>
            <p>Оплата и производство</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TODO: Остальные секции -->
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToCalculator() {
  router.push({ name: 'print-calculator' })
}
</script>

<style scoped lang="scss">
.landing {
  width: 100%;
}

.hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: var(--spacing-10) 0;
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-4);
  line-height: 1.2;
}

.highlight {
  color: #ffd93d;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-6);
  opacity: 0.9;
}

.btn {
  display: inline-block;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: var(--transition-fast);
}

.btn-primary {
  background: var(--primary-teal);
  color: white;
}

.btn-primary:hover {
  background: #138496;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: 1.125rem;
}

.features {
  padding: var(--spacing-10) 0;
  background: white;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: var(--spacing-8);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-6);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-6);
  background: var(--gray-100);
  border-radius: var(--border-radius-lg);
  transition: var(--transition-fast);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-3);
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-2);
}

.placeholder-3d {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
