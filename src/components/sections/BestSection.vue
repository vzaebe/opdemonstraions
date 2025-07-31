<template>
  <section class="best-section" ref="sectionRef">
    <div class="best-content" :class="{ 'animate-in': isVisible }">
      <div class="content-wrapper">
        <h2 class="best-title" :class="{ 'slide-up': isVisible }">
          Лучшее, что может человек
        </h2>
        <p class="best-description" :class="{ 'slide-up': isVisible, 'delay-1': isVisible }">
          Наши мероприятия посвящены реальному производству<br />от самолетостроения до разработки и
          эксплуатации нефтяных скважин и подкреплены опытом ведущих университетов страны и
          отраслевых компаний
        </p>
        <div class="best-cards" :class="{ 'cards-animate': isVisible }">
          <div
            class="best-card"
            :class="{ 'slide-up': isVisible, 'delay-2': isVisible }"
            @mouseenter="handleCardHover"
            @mouseleave="handleCardLeave"
          >
            <div class="card-content">
              <div class="card-icon">
                <div class="icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="m12 14 6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3>Профориентация в университетах</h3>
              <p>Лаборатории, мастер-классы, консультации по условиям поступления в университеты страны</p>
              <button class="best-button">
                <span>Больше</span>
                <svg class="button-arrow" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div
            class="best-card"
            :class="{ 'slide-up': isVisible, 'delay-3': isVisible }"
            @mouseenter="handleCardHover"
            @mouseleave="handleCardLeave"
          >
            <div class="card-content">
              <div class="card-icon">
                <div class="icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3>Экскурсии на предприятия</h3>
              <p>Знакомство, лекции и стажировки в российских промышленных компаниях</p>
              <button class="best-button">
                <span>Больше</span>
                <svg class="button-arrow" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="best-image" :class="{ 'image-animate': isVisible }">
      <div class="image-wrapper">
        <img src="@/assets/png/TheBestOfMan.png" alt="Два инженера у самолета" />
        <div class="image-overlay"></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/**
 * Секция «Лучшее, что может человек» (BestSection).
 * Содержит интерактивные карточки с описанием программ и экскурсий.
 * Видимость и анимация карточек триггерятся через IntersectionObserver.
 */
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'BestSection',
  setup() {
    const sectionRef = ref<HTMLElement | null>(null)
    const isVisible = ref(false)

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    })

    onMounted(() => {
      if (sectionRef.value) {
        observer.observe(sectionRef.value)
      }
    })

    onUnmounted(() => {
      observer.disconnect()
    })

    const handleCardHover = (event: Event) => {
      const card = event.currentTarget as HTMLElement
      card.style.transform = 'translateY(-8px) scale(1.02)'
    }

    const handleCardLeave = (event: Event) => {
      const card = event.currentTarget as HTMLElement
      card.style.transform = 'translateY(0) scale(1)'
    }

    return {
      sectionRef,
      isVisible,
      handleCardHover,
      handleCardLeave
    }
  }
}
</script>

<style lang="scss" scoped>
.best-section {
  display: flex;
  width: 100%;
  height: 700px;
  background: linear-gradient(135deg, $primary-teal 0%, darken($primary-teal, 10%) 100%);
  color: $white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: none;
    pointer-events: none;
  }
}

.best-content {
  flex: 1;
  padding: clamp(2rem, 4vw, 4rem) clamp(1rem, 5vw, 3rem) clamp(2rem, 4vw, 4rem) clamp(2rem, 20vw, 25rem);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  min-width: 0; // Предотвращает переполнение
}

.content-wrapper {
  max-width: min(900px, 90vw);
  width: 100%;
  margin: 0 auto; // Центрирование контента
}

.best-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: $leading-tight;
  margin: 0 0 clamp(1rem, 3vw, 2rem) 0;
  background: linear-gradient(135deg, $white 0%, rgba($white, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
  word-wrap: break-word;
  hyphens: auto;

  &.slide-up {
    opacity: 1;
    transform: translateY(0);
  }
}

.best-description {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 400;
  line-height: $leading-relaxed;
  margin: 0 0 clamp(1.5rem, 4vw, 3rem) 0;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
  word-wrap: break-word;
  hyphens: auto;

  &.slide-up {
    opacity: 0.9;
    transform: translateY(0);

    &.delay-1 {
      transition-delay: 0.2s;
    }
  }
}

.best-cards {
  display: flex;
  gap: clamp(1rem, 3vw, 2rem);
  width: 100%;
  max-width: 100%;

  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 1.5rem;
  }
}

.best-card {
  flex: 1;
  min-width: 0; // Предотвращает переполнение
  max-width: 100%;
  background: rgba($white, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba($white, 0.1);
  border-radius: $border-radius-xl;
  padding: clamp(1.25rem, 3vw, 2rem);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(50px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba($white, 0.1), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    background: rgba($white, 0.08);
    border-color: rgba($white, 0.2);
    box-shadow: 0 20px 40px rgba($black, 0.1);

    &::before {
      left: 100%;
    }

    .card-icon .icon-circle {
      background: linear-gradient(135deg, $primary-mint 0%, $primary-cyan 100%);
      transform: scale(1.1) rotate(5deg);
    }

    .best-button {
      background: rgba($white, 0.1);
      transform: translateX(5px);

      .button-arrow {
        transform: translateX(5px);
      }
    }
  }

  &.slide-up {
    opacity: 1;
    transform: translateY(0);

    &.delay-2 {
      transition-delay: 0.4s;
    }

    &.delay-3 {
      transition-delay: 0.6s;
    }
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
}

.icon-circle {
  width: 3rem;
  height: 3rem;
  background: rgba($white, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: $white;
  }
}

.best-card h3 {
  font-size: $text-lg;
  font-weight: 600;
  line-height: $leading-snug;
  margin: 0;
  color: $white;
}

.best-card p {
  font-size: $text-base;
  line-height: $leading-relaxed;
  margin: 0;
  flex-grow: 1;
  color: rgba($white, 0.8);
}

.best-button {
  width: fit-content;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba($white, 0.3);
  border-radius: $border-radius-full;
  background: rgba($white, 0.05);
  color: $white;
  font-size: $text-sm;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  .button-arrow {
    width: 1rem;
    height: 1rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    border-color: rgba($white, 0.5);
    box-shadow: 0 4px 15px rgba($black, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
}

.best-image {
  width: clamp(30%, 35vw, 40%);
  height: 100%;
  position: relative;
  opacity: 0;
  transform: translateX(50px);
  transition: all 1s ease;
  flex-shrink: 0; // Предотвращает сжатие изображения

  &.image-animate {
    opacity: 1;
    transform: translateX(0);
    transition-delay: 0.3s;
  }

  @media (max-width: 1200px) {
    display: none; // Скрываем изображение на средних экранах для лучшего отображения карточек
  }
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 0 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.image-wrapper img {
  width: 87.5%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1);
  transition: transform 0.8s ease;
  filter: brightness(1.1) contrast(1.05);
}

.image-overlay {
  display: none;
}

.best-section:hover .image-wrapper img {
  transform: scale(1.05);
}

// Анимации
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

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Responsive
@media (max-width: 1200px) {
  .best-content {
    padding: clamp(2rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
    width: 100%;
    max-width: 100%;
  }

  .content-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .best-section {
    height: auto;
    min-height: 600px;
    padding: 2rem 0;
  }

  .best-content {
    padding: 2rem 1rem;
  }

  .best-title {
    text-align: center;
  }

  .best-description {
    text-align: center;
  }

  .best-cards {
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .best-section {
    min-height: 500px;
  }

  .best-content {
    padding: 1.5rem 0.75rem;
  }

  .best-card h3 {
    font-size: clamp(1rem, 4vw, 1.125rem);
  }

  .best-card p {
    font-size: clamp(0.875rem, 3.5vw, 1rem);
  }
}
</style>
