<template>
  <section class="about-section">
    <div class="about-background">
      <div class="overlay"></div>
      <div class="container">
        <div class="about-content">
          <h2 class="about-title">Больше, чем АНО</h2>
          <div class="about-features">
            <div class="feature" @mouseenter="onFeatureHover" @mouseleave="onFeatureLeave">
              <div class="feature-glow"></div>
              <div class="feature-particles">
                <span class="particle" v-for="n in 6" :key="n"></span>
              </div>
              <HtmlFileIcon class="feature-icon smaller-icon" />
              <h3>Решения для всех</h3>
              <p>Разрабатываем открытые решения для обеспечения адаптации</p>
            </div>
            <div class="feature" @mouseenter="onFeatureHover" @mouseleave="onFeatureLeave">
              <div class="feature-glow"></div>
              <div class="feature-particles">
                <span class="particle" v-for="n in 6" :key="n"></span>
              </div>
              <CircleIcon class="feature-icon" />
              <h3>Только реальное дело</h3>
              <p>Мы нацелены на работу в самых стабильных и важных отраслях российской экономики</p>
            </div>
            <div class="feature" @mouseenter="onFeatureHover" @mouseleave="onFeatureLeave">
              <div class="feature-glow"></div>
              <div class="feature-particles">
                <span class="particle" v-for="n in 6" :key="n"></span>
              </div>
              <TgIcon class="feature-icon smaller-icon" />
              <h3>Главное результат</h3>
              <p>Наша задача качественно улучшить ситуацию с профориентацией в области инженерии</p>
            </div>
          </div>
                  <div class="about-quote">
          <p>
            Сколько еще новых, неизведанных задач на этом пути предстоит решить специалистам, экспертам, организаторам!
            Хочется работать и работать, достигая новых высот и улучшая жизнь каждого.<br />В этом и заключается смысл и цель работы нашей команды
          </p>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HtmlFileIcon from '../icons/HtmlFileIcon.vue'
import CircleIcon from '../icons/CircleIcon.vue'
import TgIcon from '../icons/TgIcon.vue'

export default defineComponent({
  name: 'AboutSection',
  components: {
    HtmlFileIcon,
    CircleIcon,
    TgIcon
  },
  data() {
    return {}
  },
  methods: {
    onFeatureHover(event: Event) {
      const target = event.currentTarget as HTMLElement
      target.classList.add('feature-active')
    },
    onFeatureLeave(event: Event) {
      const target = event.currentTarget as HTMLElement
      target.classList.remove('feature-active')
    }

  }
})
</script>

<style lang="scss" scoped>
.about-section {
  width: 100%;
  min-height: 120vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: $spacing-16 $spacing-8;
}

.about-background {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/png/airplane.png');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;



  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle,
      rgba(29, 233, 182, 0.15) 0%,    /* $primary-mint */
      rgba(24, 255, 255, 0.1) 30%,    /* $primary-cyan */
      transparent 50%);
    animation: floatingGlow 12s linear infinite;
  }
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 $spacing-8;
  width: 100%;
  position: relative;
  z-index: 2;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
    background: rgba(46, 172, 180, 0.4);
  opacity: 0;
  animation: fadeIn 1.2s ease forwards;
}

.about-content {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  grid-template-rows: auto auto;
  gap: $spacing-12;
  align-items: center;
  min-height: 100vh;
}

.about-title {
  grid-column: 1 / -1;
  text-align: center;
  margin-bottom: $spacing-4;
  font-size: $text-5xl;
  font-weight: 700;
  background: linear-gradient(45deg,
    $primary-mint,      /* Мятный */
    $primary-cyan,      /* Голубой */
    $primary-yellow,    /* Желтый */
    $primary-mint);     /* Мятный */
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  filter: drop-shadow(0 0 20px rgba(29, 233, 182, 0.5));
  opacity: 0;
  transform: translateY(-50px);
  animation: slideInDown 1s ease 0.3s forwards, titleGlow 3s ease-in-out infinite 1.5s;
}

.about-features {
  grid-column: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-6;
  align-content: start;
}

.feature {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
  color: $white;
  text-align: left;
  opacity: 0;
  transform: translateY(50px);
  animation: slideInUp 1s ease forwards;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  padding: $spacing-6;
  background: linear-gradient(135deg,
    rgba(46, 172, 180, 0.1) 0%,      /* $primary-teal */
    rgba(29, 233, 182, 0.05) 100%);  /* $primary-mint */
  border: 1px solid rgba(29, 233, 182, 0.2);

  &:nth-child(1) { animation-delay: 0.5s; }
  &:nth-child(2) { animation-delay: 0.7s; }
  &:nth-child(3) { animation-delay: 0.9s; }

  .feature-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle,
      rgba(29, 233, 182, 0.2) 0%,     /* $primary-mint */
      rgba(24, 255, 255, 0.1) 50%,    /* $primary-cyan */
      transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .feature-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: linear-gradient(45deg,
        $primary-mint,     /* Мятный */
        $primary-cyan);    /* Голубой */
      border-radius: 50%;
      opacity: 0;
      animation: particleFloat 3s ease-in-out infinite;
      box-shadow: 0 0 6px currentColor;

      &:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
      &:nth-child(2) { top: 30%; left: 80%; animation-delay: 0.5s; }
      &:nth-child(3) { top: 60%; left: 30%; animation-delay: 1s; }
      &:nth-child(4) { top: 80%; left: 70%; animation-delay: 1.5s; }
      &:nth-child(5) { top: 40%; left: 60%; animation-delay: 2s; }
      &:nth-child(6) { top: 70%; left: 10%; animation-delay: 2.5s; }
    }
  }

  &:hover,
  &.feature-active {
    transform: translateY(-15px) scale(1.05) rotateX(5deg);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(29, 233, 182, 0.4);    /* $primary-mint */
    background: linear-gradient(135deg,
      rgba(46, 172, 180, 0.2) 0%,          /* $primary-teal */
      rgba(29, 233, 182, 0.15) 100%);      /* $primary-mint */
    border-color: rgba(29, 233, 182, 0.5);

    .feature-glow {
      opacity: 1;
    }

    .feature-particles .particle {
      opacity: 1;
    }

    .feature-icon {
      transform: scale(1.2) rotate(10deg);
      filter: drop-shadow(0 0 10px rgba(29, 233, 182, 0.8));
    }
  }
}

.feature-icon {
  width: 48px;
  height: 48px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 5px rgba(29, 233, 182, 0.4));
}

.smaller-icon {
  width: 32px;
  height: 32px;
}

.feature h3 {
  font-size: $text-xl;
  font-weight: 500;
  line-height: $leading-relaxed;
  margin: 0;
}

.feature p {
  opacity: $opacity-70;
  font-size: $text-base;
  line-height: $leading-relaxed;
  margin: 0;
}

.about-quote {
  grid-column: 2;
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.25rem 4rem;
    background: linear-gradient(135deg,
    rgba(46, 172, 180, 0.6) 0%,      /* $primary-teal */
    rgba(29, 233, 182, 0.5) 25%,     /* $primary-mint */
    rgba(203, 136, 22, 0.4) 50%,     /* $primary-orange */
    rgba(24, 255, 255, 0.5) 75%,     /* $primary-cyan */
    rgba(46, 172, 180, 0.6) 100%);   /* $primary-teal */
  background-size: 300% 300%;
  animation: gradientFlow 8s ease-in-out infinite;
  border: 2px solid rgba(29, 233, 182, 0.3);
  backdrop-filter: blur(15px);
  border-radius: $border-radius-lg;
  opacity: 0;
  transform: scale(0.95);
  animation: fadeInScale 1s ease 1.1s forwards;
  position: relative;
  overflow: hidden;



  &.quote-pulse {
    animation: quotePulse 1.5s ease-in-out infinite;
  }



  .copy-tooltip {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    background: linear-gradient(45deg,
      rgba(46, 172, 180, 0.9) 0%,        /* $primary-teal */
      rgba(29, 233, 182, 0.8) 100%);     /* $primary-mint */
    padding: 0.5rem 1rem;
    border-radius: $border-radius-sm;
    font-size: $text-xs;
    color: $white;
    pointer-events: none;
    opacity: 0.7;
    transform: translateY(10px) scale(0.8);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(29, 233, 182, 0.3);

    .tooltip-text {
      display: block;
    }

    .tooltip-sparkle {
      position: absolute;
      top: -0.5rem;
      right: -0.5rem;
      font-size: 1rem;
      color: $primary-yellow;              /* Желтый для звездочки */
      animation: sparkleRotate 0.6s ease-out;
    }
  }

  &:hover .copy-tooltip,
  &.copied .copy-tooltip.active {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  p {
    font-size: $text-xl;
    font-weight: 500;
    line-height: $leading-loose;
    color: $white;
    margin: 0;
    text-align: left;
    position: relative;
    z-index: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

@media (max-width: $breakpoint-lg) {
  .about-section {
    min-height: auto;
    padding: $spacing-8 0;
  }

  .about-content {
    grid-template-columns: 1fr;
    gap: $spacing-8;
    min-height: auto;
  }

  .about-title {
    font-size: $text-4xl;
    margin-bottom: $spacing-3;
  }

  .about-features {
    grid-column: 1;
    gap: $spacing-4;
  }

  .about-quote {
    grid-column: 1;
    padding: $spacing-6;
    min-height: 250px;

    p {
      font-size: $text-lg;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .container {
    padding: 0 $spacing-4;
  }

  .about-title {
    font-size: $text-4xl;
  }

  .feature {
    padding: $spacing-4;
  }

  .about-quote {
    padding: $spacing-4;
    min-height: 200px;

    p {
      font-size: $text-base;
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideInDown {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes floatingGlow {
  0% {
    transform: rotate(0deg) translate(-50%, -50%);
  }
  100% {
    transform: rotate(360deg) translate(-50%, -50%);
  }
}

@keyframes shimmer {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes titleGlow {
  0%, 100% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 20px rgba(29, 233, 182, 0.5));
  }
  50% {
    background-position: 100% 50%;
    filter: drop-shadow(0 0 30px rgba(24, 255, 255, 0.8));
  }
}

@keyframes particleFloat {
  0%, 100% {
    opacity: 0;
    transform: translateY(0px) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1);
  }
}

@keyframes gradientFlow {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}


</style>
