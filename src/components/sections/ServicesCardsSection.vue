<template>
  <section class="services-cards-section" ref="sectionRef">
    <div class="services-cards-container">
      <div
        class="service-card"
        v-for="(card, index) in serviceCards"
        :key="index"
        :class="{ 'visible': isVisible }"
        :style="{ '--animation-delay': index * 0.2 + 's' }"
        @mouseenter="onCardHover(index)"
        @mouseleave="onCardLeave"
      >
        <div class="service-info">
          <span class="service-category">{{ card.category }}</span>
          <h3 class="service-title">{{ card.title }}</h3>
        </div>
        <div class="service-image-container">
          <img
            class="service-image"
            :src="card.image"
            :alt="card.title"
            :class="{ 'hovered': hoveredCard === index }"
          />
          <div class="image-overlay">
            <div class="overlay-content">
              <span class="overlay-text">Узнать больше</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ServicesCardsSection',
  setup() {
    const sectionRef = ref<HTMLElement | null>(null)
    const isVisible = ref(false)
    const hoveredCard = ref<number | null>(null)

    const serviceCards = [
      {
        category: 'Компаниям',
        title: 'Мастер-классы',
        image: '/src/assets/png/SpecialCards/Product image-3.png'
      },
      {
        category: 'Разработчикам',
        title: 'Проект Адаптатион',
        image: '/src/assets/png/SpecialCards/Product image-2.png'
      },
      {
        category: 'Глухим инженерам',
        title: 'База знаний',
        image: '/src/assets/png/SpecialCards/Product image-1.png'
      },
      {
        category: 'Трудоустройство',
        title: 'Список вакансий',
        image: '/src/assets/png/SpecialCards/Product image.png'
      }
    ]

    const checkVisibility = () => {
      if (!sectionRef.value) return

      const rect = sectionRef.value.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.top < windowHeight * 0.8) {
        isVisible.value = true
      }
    }

    const onCardHover = (index: number) => {
      hoveredCard.value = index
    }

    const onCardLeave = () => {
      hoveredCard.value = null
    }

    onMounted(() => {
      checkVisibility()
      window.addEventListener('scroll', checkVisibility)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', checkVisibility)
    })

    return {
      sectionRef,
      isVisible,
      hoveredCard,
      serviceCards,
      onCardHover,
      onCardLeave
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
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

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.services-cards-section {
  width: 100%;
  background-color: $white;
  padding: 40px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1) 25%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0.1) 75%,
      transparent
    );
    animation: shimmer 8s ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
  }
}

.services-cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.service-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: $white;
  border: 2px solid $gray-200;
  border-radius: $border-radius-2xl;
  padding: 40px 32px;
  min-height: 260px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(60px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba($primary-teal, 0.1),
      transparent
    );
    transition: left 0.6s ease;
    z-index: 1;
  }

  &.visible {
    animation: slideInUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation-delay: var(--animation-delay);
  }

  &:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    border-color: $primary-teal;

    &::before {
      left: 100%;
    }

    .service-title {
      color: $primary-teal;
      transform: translateX(10px);
    }

    .service-category {
      transform: translateX(5px);
      color: $primary-teal;
    }
  }


}

.service-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1 1 0;
  position: relative;
  z-index: 2;
}

.service-category {
  font-size: $text-xs;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: $leading-snug;
  color: $gray-900;
  opacity: $opacity-40;
  text-transform: uppercase;
  text-decoration: underline;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: $primary-teal;
    transition: width 0.3s ease;
  }

  .service-card:hover & {
    &::after {
      width: 100%;
    }
  }
}

.service-title {
  font-size: $text-2xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $primary-teal;
  text-decoration: underline;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}



.service-image-container {
  position: relative;
  margin-left: 32px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: $border-radius-lg;
}

.service-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: $border-radius-lg;
  background: #f8f8f8;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 1;

  &.hovered {
    transform: scale(1.1) rotate(2deg);
    filter: brightness(1.1) saturate(1.2);
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba($primary-teal, 0.8),
    rgba(#4ade80, 0.8)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  border-radius: $border-radius-lg;
  backdrop-filter: blur(4px);
}

.overlay-content {
  text-align: center;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.overlay-text {
  color: white;
  font-weight: 600;
  font-size: $text-sm;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.service-card:hover .image-overlay {
  opacity: 1;

  .overlay-content {
    transform: translateY(0);
  }
}

@media (max-width: $breakpoint-lg) {
  .services-cards-container {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    gap: 24px;
  }

  .service-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 16px;
    min-height: 200px;

    &:hover {
      transform: translateY(-10px) scale(1.01);
    }
  }

  .service-image-container {
    width: 100%;
    margin-left: 0;
    margin-top: 16px;
  }

  .service-image {
    width: 100%;
    height: 160px;
  }
}

@media (max-width: $breakpoint-sm) {
  .service-card {
    padding: 20px 12px;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .service-title {
    font-size: $text-xl;
  }

  .service-category {
    font-size: $text-xs;
  }
}
</style>
