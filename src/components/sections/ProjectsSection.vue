<template>
  <section ref="sectionRef" class="projects-section">
    <div
      ref="headerRef"
      class="projects-header"
      :class="{ 'animate-in': isHeaderVisible }"
    >
      <h2 class="projects-title">Наши основные проекты</h2>
      <p class="projects-subtitle">
        История наших проектов в разных университетах, предприятиях<br/>и организациях
      </p>
    </div>
    <div
      ref="gridRef"
      class="projects-grid"
      :class="{ 'animate-in': isGridVisible }"
    >
      <div class="project-card" style="animation-delay: 0s">
        <div class="project-image-container">
          <img
            class="project-image"
            :src="p0"
            alt="Летние интенсивы в Бауманке"
          />
          <div class="project-image-overlay">
            <div class="overlay-content">
              <span class="overlay-text">Смотреть проект</span>
            </div>
          </div>
        </div>
        <div class="project-content">
          <h3 class="project-title">Летние интенсивы в Бауманке</h3>
          <p class="project-description">Три дня невероятного погружения в бауманскую атмосферу через диалоги и 3D печать</p>
          <a href="#" class="project-link">
            <span class="link-text">Узнать больше о мероприятии</span>
            <span class="link-arrow">→</span>
          </a>
        </div>
      </div>

      <div class="project-card" style="animation-delay: 0.2s">
        <div class="project-image-container">
          <img
            class="project-image"
            :src="p1"
            alt="Грант Росмолодежи"
          />
          <div class="project-image-overlay">
            <div class="overlay-content">
              <span class="overlay-text">Смотреть проект</span>
            </div>
          </div>
        </div>
        <div class="project-content">
          <h3 class="project-title">Грант Росмолодежи</h3>
          <p class="project-description">В 2024 году проект выиграл заявку. Было проведено 11 мероприятий, которые посетило около 400 человек</p>
          <a href="#" class="project-link">
            <span class="link-text">Перейти к списку мероприятий и отчету</span>
            <span class="link-arrow">→</span>
          </a>
        </div>
      </div>

      <div class="project-card" style="animation-delay: 0.4s">
        <div class="project-image-container">
          <img
            class="project-image"
            :src="p2"
            alt="Инклюзивные лекции"
          />
          <div class="project-image-overlay">
            <div class="overlay-content">
              <span class="overlay-text">Смотреть проект</span>
            </div>
          </div>
        </div>
        <div class="project-content">
          <h3 class="project-title">Инклюзивные лекции</h3>
          <p class="project-description">Проводим лекции про интеграцию в реальный сектор, инновации и способы реализации</p>
          <a href="#" class="project-link">
            <span class="link-text">Посмотреть лекции и материалы</span>
            <span class="link-arrow">→</span>
          </a>
        </div>
      </div>

      <div class="project-card" style="animation-delay: 0.6s">
        <div class="project-image-container">
          <img
            class="project-image"
            :src="p3"
            alt="Перевод науки на РЖЯ"
          />
          <div class="project-image-overlay">
            <div class="overlay-content">
              <span class="overlay-text">Смотреть проект</span>
            </div>
          </div>
        </div>
        <div class="project-content">
          <h3 class="project-title">Перевод науки на РЖЯ</h3>
          <p class="project-description">Делаем науку доступной с помощью переведения русского жестового языка</p>
          <a href="#" class="project-link">
            <span class="link-text">Открыть перечень переводов</span>
            <span class="link-arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/**
 * Секция «Проекты» (ProjectsSection).
 * Содержит интерактивную сетку карточек проектов с изображениями.
 * При прокрутке используется IntersectionObserver для триггера анимаций
 * появления заголовка и грид-карточек.
 *
 * Карточки статичны, но могут быть заменены на динамический список через
 * props или загрузку с бэкенда.
 */
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ProjectsSection',
  setup() {
    const sectionRef = ref<HTMLElement>()
    const headerRef = ref<HTMLElement>()
    const gridRef = ref<HTMLElement>()

    const isHeaderVisible = ref(false)
    const isGridVisible = ref(false)

    let headerObserver: IntersectionObserver
    let gridObserver: IntersectionObserver

    onMounted(() => {
      // Create observers for scroll animations
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }

      headerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isHeaderVisible.value = true
          }
        })
      }, observerOptions)

      gridObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isGridVisible.value = true
          }
        })
      }, observerOptions)

      if (headerRef.value) {
        headerObserver.observe(headerRef.value)
      }

      if (gridRef.value) {
        gridObserver.observe(gridRef.value)
      }
    })

    onUnmounted(() => {
      if (headerObserver && headerRef.value) {
        headerObserver.unobserve(headerRef.value)
      }
      if (gridObserver && gridRef.value) {
        gridObserver.unobserve(gridRef.value)
      }
    })

    const p0 = new URL('../../assets/png/Projects/Photo.png', import.meta.url).href
    const p1 = new URL('../../assets/png/Projects/Photo-1.png', import.meta.url).href
    const p2 = new URL('../../assets/png/Projects/Photo-2.png', import.meta.url).href
    const p3 = new URL('../../assets/png/Projects/Photo-3.png', import.meta.url).href

    return {
      sectionRef,
      headerRef,
      gridRef,
      isHeaderVisible,
      isGridVisible,
      p0,
      p1,
      p2,
      p3
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.projects-section {
  width: 100%;
  padding: 120px 135px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
}

.projects-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 758px;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.projects-title {
  color: $primary-teal;
  font-size: 48px;
  font-weight: 700;
  line-height: 60px;
  margin: 0;
  text-align: center;
  background: linear-gradient(135deg, $primary-teal 0%, #0ea5e9 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, $primary-orange, $primary-teal);
    border-radius: 2px;
    animation: fadeInUp 1s ease-out 0.5s both;
  }
}

.projects-subtitle {
  color: rgba($gray-900, 0.6);
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  text-align: center;
  margin: 0;
  animation: fadeInUp 1s ease-out 0.3s both;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  max-width: 1170px;
  opacity: 0;
  transition: opacity 0.8s ease-out;

  &.animate-in {
    opacity: 1;

    .project-card {
      animation: slideInFromBottom 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
  }
}

.project-card {
  width: 570px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  opacity: 0;
  transform: translateY(50px);

  &:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);

    .project-image {
      transform: scale(1.1);
    }

    .project-image-overlay {
      opacity: 1;
    }

    .project-title {
      color: $primary-orange;
    }

    .project-link {
      color: $primary-teal;

      .link-arrow {
        transform: translateX(10px);
      }
    }
  }

  &:nth-child(even) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  &:nth-child(4) {
    animation-delay: 0.6s;
  }
}

.project-image-container {
  position: relative;
  overflow: hidden;
  height: 330px;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.project-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba($primary-teal, 0.8) 0%, rgba($primary-orange, 0.8) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-content {
  text-align: center;
  transform: translateY(20px);
  transition: transform 0.4s ease;
}

.project-card:hover .overlay-content {
  transform: translateY(0);
}

.overlay-text {
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.project-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
  background: white;
}

.project-title {
  color: $primary-teal;
  font-size: 22px;
  font-weight: 600;
  line-height: 32px;
  margin: 0;
  transition: color 0.3s ease;
  position: relative;
}

.project-description {
  color: rgba($gray-900, 0.6);
  font-size: 16px;
  line-height: 26px;
  margin: 0;
  flex-grow: 1;
}

.project-link {
  color: $primary-orange;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-top: auto;

  &:hover {
    text-decoration: none;
  }
}

.link-text {
  transition: color 0.3s ease;
}

.link-arrow {
  font-size: 18px;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: normal;
}

@media (max-width: $breakpoint-lg) {
  .projects-section {
    padding: 64px 32px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .project-card {
    width: 100%;
  }

  .project-image-container {
    height: 250px;
  }

  .project-content {
    padding: 24px;
  }

  .projects-title {
    font-size: 36px;
    line-height: 44px;
  }

  .projects-subtitle {
    font-size: 18px;
    line-height: 28px;
  }
}

@media (max-width: $breakpoint-md) {
  .projects-section {
    padding: 48px 16px;
    gap: 48px;
  }

  .project-image-container {
    height: 200px;
  }

  .project-content {
    padding: 20px;
  }

  .projects-title {
    font-size: 28px;
    line-height: 36px;
  }

  .projects-subtitle {
    font-size: 16px;
    line-height: 24px;
  }

  .project-card:hover {
    transform: translateY(-8px) scale(1.01);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
