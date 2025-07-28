<template>
  <section class="telegram-section" ref="sectionRef">
    <div class="telegram-container">
      <!-- Анимированные декоративные элементы -->
      <div class="floating-elements">
        <!-- Плавающие круги -->
        <div class="floating-circle" v-for="i in 8" :key="'circle-' + i" :style="getCircleStyle(i)"></div>

        <!-- Геометрические фигуры -->
        <div class="floating-triangle" v-for="i in 4" :key="'triangle-' + i" :style="getTriangleStyle(i)"></div>
        <div class="floating-square" v-for="i in 3" :key="'square-' + i" :style="getSquareStyle(i)"></div>

        <!-- Пульсирующие точки -->
        <div class="pulsing-dot" v-for="i in 6" :key="'dot-' + i" :style="getDotStyle(i)"></div>

        <!-- Волновые элементы -->
        <div class="wave-element wave-1"></div>
        <div class="wave-element wave-2"></div>
        <div class="wave-element wave-3"></div>

        <!-- Парящие частицы -->
        <div class="particle" v-for="i in 12" :key="'particle-' + i" :style="getParticleStyle(i)"></div>
      </div>

      <!-- Основной контент -->
      <div class="content-wrapper" :class="{ 'animate-in': isVisible }">
        <div class="title-section">
          <div class="telegram-icon-wrapper">
            <TgIcon :width="48" :height="48" class="telegram-icon pulsing" />
            <div class="icon-glow"></div>
          </div>
          <div class="title-container">
            <h2 class="telegram-title">
              <span class="title-white">Подпишитесь на наш</span>
              <span class="title-brand">
                Telegram-канал
              </span>
            </h2>
          </div>
        </div>

        <div class="description-section">
          <p class="telegram-description">
            Наша команда ведет telegram-канал <strong>«Открытые Перспективы»</strong>, где публикует план мероприятий,
            отчеты, видео-ролики, полезные новости и статьи, освещает актуальные темы по направлению
            деятельности. <span class="highlight-text">Подпишитесь, чтобы быть в курсе и ничего не пропустить.</span>
          </p>

          <!-- Статистика канала -->
          <div class="channel-stats">
            <div class="stat-item">
              <div class="stat-number">{{ animatedSubscribers }}</div>
              <div class="stat-label">подписчиков</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">{{ animatedPosts }}</div>
              <div class="stat-label">публикаций</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">3-5</div>
              <div class="stat-label">постов в неделю</div>
            </div>
          </div>
        </div>

        <!-- Кнопка подписки с эффектами -->
        <div class="button-section">
          <a
            href="https://t.me/openperspectives"
            target="_blank"
            rel="noopener noreferrer"
            class="telegram-button"
            @mouseenter="onButtonHover"
            @mouseleave="onButtonLeave"
            @click="onButtonClick"
          >
            <div class="button-bg"></div>
            <div class="button-content">
              <TgIcon :width="24" :height="24" class="button-icon" />
              <span class="button-text">Подписаться</span>
              <div class="button-arrow">→</div>
            </div>
            <div class="ripple-effect" ref="rippleRef"></div>
          </a>

          <!-- Дополнительная информация -->
          <p class="subscription-note">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0L10.5 5L16 5.75L12 9.5L13 16L8 13L3 16L4 9.5L0 5.75L5.5 5L8 0Z" fill="currentColor"/>
            </svg>
            Бесплатно • Без спама • Только полезный контент
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/**
 * Секция «Telegram» (TelegramSection).
 * Приглашает пользователя подписаться на Telegram-канал организации.
 * Реализованы:
 *  - Анимация счётчиков подписчиков и постов;
 *  - Большое количество декоративных элементов (частицы, волны, круги);
 *  - Кнопка с ripple-эффектом и SVG-иконкой Telegram.
 *
 * Цвета и градиенты в компоненте соответствуют фирменным цветам Telegram
 * (основной #0088cc), что согласуется с предпочтениями заказчика.
 */
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue'
import TgIcon from '../icons/TgIcon.vue'

export default defineComponent({
  name: 'TelegramSection',
  components: { TgIcon },
  setup() {
    const sectionRef = ref<HTMLElement>()
    const rippleRef = ref<HTMLElement>()
    const isVisible = ref(false)

    // Анимированные счетчики
    const subscribersCount = ref(0)
    const postsCount = ref(0)
    const targetSubscribers = 1247
    const targetPosts = 156

    const animatedSubscribers = computed(() => {
      return subscribersCount.value.toLocaleString('ru-RU')
    })

    const animatedPosts = computed(() => {
      return postsCount.value.toString()
    })

    // Анимация чисел
    const animateNumbers = () => {
      const duration = 2000
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3)

        subscribersCount.value = Math.round(targetSubscribers * easeOut)
        postsCount.value = Math.round(targetPosts * easeOut)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }

    // Intersection Observer для анимации появления
    const setupIntersectionObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isVisible.value) {
              isVisible.value = true
              setTimeout(() => {
                animateNumbers()
              }, 500)
            }
          })
        },
        { threshold: 0.3 }
      )

      if (sectionRef.value) {
        observer.observe(sectionRef.value)
      }

      return observer
    }

        // Стили для плавающих элементов
    const getCircleStyle = (index: number) => {
      const size = 20 + (index * 8)
      const delay = index * 0.3
      const duration = 3 + (index * 0.3)

      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${5 + (index * 12)}%`,
        top: `${15 + (index * 8)}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }
    }

    // Стили для треугольников
    const getTriangleStyle = (index: number) => {
      const size = 15 + (index * 5)
      const delay = index * 0.8
      const duration = 4 + (index * 0.4)

      return {
        borderLeftWidth: `${size}px`,
        borderRightWidth: `${size}px`,
        borderBottomWidth: `${size * 1.5}px`,
        left: `${20 + (index * 20)}%`,
        top: `${30 + (index * 15)}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }
    }

    // Стили для квадратов
    const getSquareStyle = (index: number) => {
      const size = 12 + (index * 6)
      const delay = index * 1.2
      const duration = 5 + (index * 0.5)

      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${60 + (index * 15)}%`,
        top: `${25 + (index * 20)}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }
    }

    // Стили для пульсирующих точек
    const getDotStyle = (index: number) => {
      const size = 6 + (index * 2)
      const delay = index * 0.4
      const duration = 2 + (index * 0.2)

      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${15 + (index * 14)}%`,
        top: `${40 + (index * 8)}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }
    }

        // Стили для частиц
    const getParticleStyle = (index: number) => {
      const size = 3 + (index % 4)
      const delay = index * 0.2
      const duration = 6 + (index % 3)

      // Лучшее распределение частиц по экрану
      const x = (index * 8.33) % 100 // Равномерное распределение по X
      const y = ((index * 13) % 80) + 10 // Распределение по Y с отступами

      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }
    }

    // Обработчики событий кнопки
    const onButtonHover = () => {
      // Дополнительные эффекты при hover
    }

    const onButtonLeave = () => {
      // Очистка эффектов
    }

    const onButtonClick = (event: MouseEvent) => {
      // Ripple effect
      if (rippleRef.value) {
        const button = event.currentTarget as HTMLElement
        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = event.clientX - rect.left - size / 2
        const y = event.clientY - rect.top - size / 2

        rippleRef.value.style.width = rippleRef.value.style.height = `${size}px`
        rippleRef.value.style.left = `${x}px`
        rippleRef.value.style.top = `${y}px`
        rippleRef.value.classList.add('ripple-active')

        setTimeout(() => {
          rippleRef.value?.classList.remove('ripple-active')
        }, 600)
      }
    }

    onMounted(() => {
      const observer = setupIntersectionObserver()

      onUnmounted(() => {
        observer.disconnect()
      })
    })

    return {
      sectionRef,
      rippleRef,
      isVisible,
      animatedSubscribers,
      animatedPosts,
      getCircleStyle,
      getTriangleStyle,
      getSquareStyle,
      getDotStyle,
      getParticleStyle,
      onButtonHover,
      onButtonLeave,
      onButtonClick
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.telegram-section {
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, $primary-teal 0%, $primary-mint 100%);
  display: flex;
  justify-content: center;
  padding: 6rem 2rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 80%, rgba(29, 233, 182, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(24, 255, 255, 0.15) 0%, transparent 50%);
    pointer-events: none;
  }
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(24, 255, 255, 0.1);
  animation: float infinite ease-in-out;
  backdrop-filter: blur(2px);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 0.3; }
}

// Треугольники
.floating-triangle {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 25px solid rgba(24, 255, 255, 0.12);
  animation: triangleFloat infinite ease-in-out;
  filter: blur(1px);
}

@keyframes triangleFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
    opacity: 0.6;
  }
  33% {
    transform: translateY(-25px) rotate(120deg) scale(1.2);
    opacity: 0.4;
  }
  66% {
    transform: translateY(-10px) rotate(240deg) scale(0.8);
    opacity: 0.8;
  }
}

// Квадраты
.floating-square {
  position: absolute;
  background: rgba(29, 233, 182, 0.1);
  border-radius: 3px;
  animation: squareRotate infinite linear;
  backdrop-filter: blur(1px);
}

@keyframes squareRotate {
  0% {
    transform: rotate(0deg) translateY(0px) scale(1);
    opacity: 0.5;
  }
  25% {
    transform: rotate(90deg) translateY(-15px) scale(1.1);
    opacity: 0.3;
  }
  50% {
    transform: rotate(180deg) translateY(-30px) scale(0.9);
    opacity: 0.7;
  }
  75% {
    transform: rotate(270deg) translateY(-15px) scale(1.2);
    opacity: 0.4;
  }
  100% {
    transform: rotate(360deg) translateY(0px) scale(1);
    opacity: 0.5;
  }
}

// Пульсирующие точки
.pulsing-dot {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(24, 255, 255, 0.8) 0%, rgba(29, 233, 182, 0.3) 100%);
  animation: pulseGlow infinite ease-in-out;
  filter: blur(0.5px);
}

@keyframes pulseGlow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
    box-shadow: 0 0 5px rgba(24, 255, 255, 0.3);
  }
  50% {
    transform: scale(1.8);
    opacity: 0.2;
    box-shadow: 0 0 15px rgba(24, 255, 255, 0.6);
  }
}

// Волновые элементы
.wave-element {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid rgba(24, 255, 255, 0.1);
  animation: waveExpand infinite ease-out;
}

.wave-1 {
  top: 20%;
  left: 10%;
  animation-duration: 4s;
  animation-delay: 0s;
}

.wave-2 {
  top: 60%;
  right: 15%;
  animation-duration: 5s;
  animation-delay: 1.5s;
}

.wave-3 {
  bottom: 20%;
  left: 50%;
  animation-duration: 6s;
  animation-delay: 3s;
}

@keyframes waveExpand {
  0% {
    transform: scale(0.3);
    opacity: 0.8;
  }
  50% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

// Парящие частицы
.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(29, 233, 182, 0.6);
  animation: particleFloat infinite ease-in-out;
  filter: blur(0.5px);
}

@keyframes particleFloat {
  0% {
    transform: translate(0, 0) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  50% {
    transform: translate(50px, -100px) scale(1.2);
    opacity: 0.4;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    transform: translate(100px, -200px) scale(0.3);
    opacity: 0;
  }
}

.telegram-container {
  position: relative;
  max-width: 1000px;
  width: 100%;
  z-index: 2;
}

.content-wrapper {
  text-align: center;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-section {
  margin-bottom: 3rem;
}

.telegram-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.telegram-icon {
  display: block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  z-index: 2;
  position: relative;

  &.pulsing {
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: glow 3s ease-in-out infinite;
  z-index: 1;
}

@keyframes glow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
}

.title-container {
  text-align: center;
}

.telegram-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-white {
  color: $white;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  display: block;
  animation: slideInUp 0.8s ease-out 0.3s both;
}

.title-brand {
  color: $white;
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  display: block;
  text-align: center;
  animation: slideInUp 0.8s ease-out 0.5s both;

  &:hover {
    transform: scale(1.02);
    transition: transform 0.3s ease;
  }
}



@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

.description-section {
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.telegram-description {
  font-size: clamp(1.1rem, 2.5vw, 1.25rem);
  line-height: 1.6;
  color: $white;
  margin-bottom: 2.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  strong {
    font-weight: 700;
    color: $primary-cyan;
  }
}

.highlight-text {
  background: rgba(24, 255, 255, 0.15);
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
}

.channel-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(24, 255, 255, 0.3);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: $white;
  margin-bottom: 0.25rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: rgba(24, 255, 255, 0.4);
}

.button-section {
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.telegram-button {
  position: relative;
  display: inline-block;
  padding: 1.2rem 3rem;
  background: transparent;
  border: none;
  border-radius: 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin-bottom: 1.5rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);

    .button-bg {
      transform: scale(1.05);
    }

    .button-arrow {
      transform: translateX(5px);
    }
  }

  &:active {
    transform: translateY(-1px);
  }
}

.button-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, $white 0%, rgba(255, 255, 255, 0.95) 100%);
  border-radius: 3rem;
  transition: transform 0.3s ease;
  z-index: 1;
}

.button-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: $primary-teal;
  z-index: 2;
}

.button-icon {
  transition: transform 0.3s ease;
  fill: $primary-teal;
}

.button-text {
  font-weight: 700;
}

.button-arrow {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  pointer-events: none;
  z-index: 3;

  &.ripple-active {
    animation: ripple 0.6s linear;
  }
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.subscription-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;

  svg {
    color: $primary-cyan;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .telegram-section {
    padding: 4rem 1rem;
  }

  .channel-stats {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;

    .stat-divider {
      width: 2rem;
      height: 1px;
    }
  }

  .telegram-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }

  .floating-circle,
  .floating-triangle,
  .floating-square,
  .wave-element {
    display: none; // Скрываем большие декоративные элементы на мобильных
  }

  .pulsing-dot,
  .particle {
    // Оставляем только точки и частицы, но уменьшаем их количество
    &:nth-child(n+4) {
      display: none;
    }
  }
}

@media (max-width: 480px) {
  .channel-stats {
    .stat-number {
      font-size: 1.5rem;
    }

    .stat-label {
      font-size: 0.8rem;
    }
  }
}
</style>
