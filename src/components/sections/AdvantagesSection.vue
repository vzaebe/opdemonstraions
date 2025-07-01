<template>
  <section class="advantages-section">
    <h2 class="advantages-title">Наши преимущества</h2>
    <div class="advantages-grid">
      <div class="advantage">
        <span class="advantage-icon">
          <RealBusinessIcon />
        </span>
        <h3>Реальное производство</h3>
        <p>Нашими партнерами являются производственные компании, производящие реальную продукцию</p>
      </div>
      <div class="advantage">
        <span class="advantage-icon">
          <OpenDecisionsIcon />
        </span>
        <h3>Открытость решений</h3>
        <p>Все наши решения, материалы, разработки вы можете получить напрямую</p>
      </div>
      <div class="advantage">
        <span class="advantage-icon">
          <OpenInfoIcon />
        </span>
        <h3>Доступность информации</h3>
        <p>Все наши материалы переведены на жестовый язык и доступны на сайте</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import RealBusinessIcon from '../icons/RealBusinessIcon.vue'
import OpenDecisionsIcon from '../icons/OpenDecisionsIcon.vue'
import OpenInfoIcon from '../icons/OpenInfoIcon.vue'
</script>

<style lang="scss" scoped>
.advantages-section {
  width: 100%;
  height: 580px;
  background-color: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 6rem 14rem;
  gap: 3.5rem;
}

.advantages-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  text-align: center;
  color: $primary-teal;
  margin: 0;
}

.advantages-grid {
  display: inline-flex;
  gap: 5rem;
  align-items: flex-start;
  justify-content: flex-start;
  width: 964px;
  height: 279px;
}

.advantage {
  display: inline-flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  justify-content: flex-start;
  width: 16rem;
  height: 100%;
  transition: transform 0.3s ease-in-out;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.advantage:nth-child(1) {
  animation-delay: 0.1s;
}

.advantage:nth-child(2) {
  animation-delay: 0.3s;
}

.advantage:nth-child(3) {
  animation-delay: 0.5s;
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

.advantage:hover {
  transform: translateY(-10px);
}

.advantage-icon {
  font-size: $text-6xl;
  line-height: $leading-10;
  text-align: center;
  color: $primary-coral;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(46, 172, 180, 0.1), rgba(29, 233, 182, 0.05));
  position: relative;
  overflow: hidden;
}

.advantage-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(29, 233, 182, 0.3), transparent);
  transition: left 0.5s ease-in-out;
}

.advantage:hover .advantage-icon {
  transform: scale(1.1) rotate(5deg);
  color: $primary-teal;
  box-shadow: 0 8px 25px rgba(29, 233, 182, 0.3);
}

.advantage:hover .advantage-icon::before {
  left: 100%;
}

.advantage-icon svg {
  width: 48px;
  height: 48px;
  transition: all 0.3s ease-in-out;
}

.advantage:hover .advantage-icon svg {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.advantage h3 {
  font-size: $text-xl;
  font-weight: 500;
  line-height: $leading-loose;
  text-align: center;
  color: $primary-teal;
  margin: 0;
}

.advantage p {
  font-size: $text-base;
  line-height: $leading-relaxed;
  text-align: center;
  color: $gray-900;
  opacity: $opacity-40;
  margin: 0;
}

@media (max-width: $breakpoint-lg) {
  .advantages-section {
    height: auto;
    padding: 4rem 2rem;
  }
  
  .advantages-grid {
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 2rem;
  }
  
  .advantage {
    width: 100%;
    height: auto;
  }
}
</style> 