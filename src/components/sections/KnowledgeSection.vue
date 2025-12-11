<template>
  <section id="knowledge" ref="sectionRef" class="knowledge-section">
    <div class="knowledge-container">
      <!-- Декоративные элементы -->
      <div class="decorative-elements">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <!-- Основной контент -->
      <div class="knowledge-content" :class="{ 'visible': isVisible }">
        <!-- Иконка/Лого -->
        <div class="knowledge-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="15" width="60" height="50" rx="4" stroke="currentColor" stroke-width="3" fill="none"/>
            <line x1="10" y1="25" x2="70" y2="25" stroke="currentColor" stroke-width="3"/>
            <line x1="20" y1="35" x2="50" y2="35" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="20" y1="43" x2="60" y2="43" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="20" y1="51" x2="55" y2="51" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="58" cy="58" r="12" fill="currentColor"/>
            <path d="M58 52 L58 58 L62 61" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </div>

        <!-- Заголовок -->
        <h2 class="knowledge-title">
          База знаний <span class="highlight">РЖЯ</span>
        </h2>

        <!-- Подзаголовок -->
        <p class="knowledge-subtitle">
          Специализированная база знаний для глухих и слабослышащих технарей
        </p>

        <!-- Описание -->
        <div class="knowledge-description">
          <p>
            Мы создаём уникальное пространство технических знаний, адаптированное специально 
            для глухих и слабослышащих специалистов. Здесь будут собраны материалы по 3D-печати, 
            программированию, инженерным решениям и многому другому — всё на русском жестовом языке 
            и с текстовым сопровождением.
          </p>
        </div>

        <!-- Особенности -->
        <div class="knowledge-features">
          <div class="feature" v-for="(feature, index) in features" :key="index" :style="{ '--delay': index * 0.1 + 's' }">
            <div class="feature-icon">
              <!-- Видео иконка -->
              <svg v-if="index === 0" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M13 11L21 16L13 21V11Z" fill="currentColor"/>
              </svg>
              <!-- Документ иконка -->
              <svg v-else-if="index === 1" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4H18L24 10V28H8V4Z" stroke="currentColor" stroke-width="2"/>
                <path d="M18 4V10H24" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="20" x2="20" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <!-- Инструменты иконка -->
              <svg v-else-if="index === 2" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 26L12 20M12 20L8 16L16 8L20 12L12 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="24" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
              <!-- Люди иконка -->
              <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="10" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M4 26C4 22.6863 6.68629 20 10 20H14C17.3137 20 20 22.6863 20 26" stroke="currentColor" stroke-width="2"/>
                <circle cx="22" cy="8" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="M28 22C28 19.7909 26.2091 18 24 18H22C21.4 18 20.8 18.2 20.4 18.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <!-- Статус -->
        <div class="coming-soon-badge">
          <div class="badge-pulse"></div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2"/>
            <path d="M10 6V10L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Скоро здесь появится новая информация</span>
        </div>

        <!-- CTA кнопка -->
        <div class="knowledge-cta">
          <button class="cta-button" @click="handleNotify">
            <span class="button-text">Уведомить меня о запуске</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <p class="cta-note">Мы сообщим вам, когда база знаний будет готова</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

const features = [
  {
    title: 'Видеоматериалы на РЖЯ',
    description: 'Все обучающие материалы сопровождаются видео на русском жестовом языке'
  },
  {
    title: 'Технические статьи',
    description: 'Подробные гайды по 3D-печати, моделированию и инженерным решениям'
  },
  {
    title: 'Практические примеры',
    description: 'Реальные кейсы и проекты с пошаговыми инструкциями'
  },
  {
    title: 'Сообщество экспертов',
    description: 'Общение с профессионалами и обмен опытом в доступном формате'
  }
]

const checkVisibility = () => {
  if (!sectionRef.value) return
  
  const rect = sectionRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  
  if (rect.top < windowHeight * 0.75) {
    isVisible.value = true
  }
}

const handleNotify = () => {
  alert('Спасибо за интерес! Мы обязательно уведомим вас о запуске базы знаний.')
}

onMounted(() => {
  checkVisibility()
  window.addEventListener('scroll', checkVisibility)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkVisibility)
})
</script>

<style lang="scss" scoped>
.knowledge-section {
  position: relative;
  min-height: 100vh;
  padding: clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 4rem);
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: white;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.knowledge-container {
  position: relative;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  z-index: 2;
}

.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
    animation: float 20s ease-in-out infinite;

    &.circle-1 {
      width: 400px;
      height: 400px;
      top: -100px;
      right: -100px;
      animation-delay: 0s;
    }

    &.circle-2 {
      width: 300px;
      height: 300px;
      bottom: -50px;
      left: -50px;
      animation-delay: 5s;
    }

    &.circle-3 {
      width: 200px;
      height: 200px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 10s;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.knowledge-content {
  position: relative;
  z-index: 2;
  text-align: center;
  opacity: 0;
  transform: translateY(40px);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.knowledge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%);
  border-radius: 24px;
  color: #60a5fa;
  animation: iconPulse 3s ease-in-out infinite;

  svg {
    filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.knowledge-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  letter-spacing: -0.02em;

  .highlight {
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.knowledge-subtitle {
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  color: #cbd5e1;
  margin-bottom: 3rem;
  font-weight: 500;
}

.knowledge-description {
  max-width: 800px;
  margin: 0 auto 4rem;

  p {
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    line-height: 1.8;
    color: #e2e8f0;
  }
}

.knowledge-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.feature {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: left;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: var(--delay);

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(96, 165, 250, 0.5);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  color: #60a5fa;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: white;
}

.feature-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #cbd5e1;
}

.coming-soon-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
  border: 2px solid rgba(168, 85, 247, 0.4);
  border-radius: 50px;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 3s infinite;
  }

  .badge-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50px;
    background: rgba(168, 85, 247, 0.3);
    animation: pulse 2s ease-in-out infinite;
  }

  svg {
    color: #e879f9;
    position: relative;
    z-index: 2;
  }

  span {
    font-size: 1rem;
    font-weight: 600;
    color: #fae8ff;
    position: relative;
    z-index: 2;
  }
}

@keyframes shimmer {
  to {
    left: 100%;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.knowledge-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);

    &::before {
      opacity: 1;
    }

    svg {
      transform: translateX(5px);
    }
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    transition: transform 0.3s ease;
  }
}

.cta-note {
  font-size: 0.875rem;
  color: #94a3b8;
  font-style: italic;
}

@media (max-width: 768px) {
  .knowledge-section {
    padding: 3rem 1.5rem;
  }

  .knowledge-features {
    grid-template-columns: 1fr;
  }

  .feature {
    padding: 1.5rem;
  }

  .coming-soon-badge {
    padding: 0.875rem 1.5rem;
    
    span {
      font-size: 0.875rem;
    }
  }

  .cta-button {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}
</style>

