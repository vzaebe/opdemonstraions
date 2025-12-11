<template>
  <section class="support-section">
    <div class="support-container">
      <div class="support-content">
        <div class="support-title-wrapper">
          <span class="support-title-icon">🤝</span>
          <h2 class="support-title">Поддержите наш проект</h2>
        </div>
        <p class="support-subtitle">
          Ваша поддержка помогает нам создавать инклюзивное будущее для всех
        </p>
        <div class="support-options">
          <div class="support-option support-option--volunteer">
            <span class="support-option-icon">👐</span>
            <h3>Волонтёрство</h3>
            <p>Помогите нам в организации мероприятий и проектов</p>
            <a href="#" class="support-link" @click.prevent="openModal('volunteer')">Стать волонтёром</a>
          </div>
          <div class="support-option support-option--partner">
            <span class="support-option-icon">🤝</span>
            <h3>Партнёрство</h3>
            <p>Сотрудничайте с нами для создания инклюзивной среды</p>
            <a href="#" class="support-link" @click.prevent="openModal('partner')">Стать партнёром</a>
          </div>
          <div class="support-option support-option--donate">
            <span class="support-option-icon">💸</span>
            <h3>Пожертвования</h3>
            <p>Финансовая поддержка для развития наших проектов</p>
            <router-link :to="{ name: 'support' }" class="support-link">Сделать пожертвование</router-link>
          </div>
        </div>

        <!-- Отзывы
        <div class="support-testimonials">
          <transition name="testimonial-slide" mode="out-in">
            <TestimonialCard :key="currentSlide" :testimonial="testimonials[currentSlide]" />
          </transition>
        </div> -->

        <!-- Модальное окно -->
        <teleport to="body">
          <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
              <h3>Спасибо за вашу поддержку!</h3>
              <p v-if="modalType === 'volunteer'">Мы свяжемся с вами для участия в волонтёрских программах.</p>
              <p v-else-if="modalType === 'partner'">Наш менеджер свяжется с вами для обсуждения партнёрства.</p>
              <p v-else-if="modalType === 'donate'">Спасибо за ваш вклад! Вместе мы делаем мир лучше.</p>
              <button class="modal-close" @click="closeModal">Закрыть</button>
            </div>
          </div>
        </teleport>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/**
 * Секция «Поддержка» (SupportSection).
 * Предлагает три варианта поддержки: волонтёрство, партнёрство, пожертвование.
 * Секция содержит собственное модальное окно и автослайдер отзывов.
 */
import { defineComponent } from 'vue'
import ivanovaPic from '../../assets/png/face/ivanova pic.png'
import komarovPic from '../../assets/png/face/komarov pic.png'
import mironovaPic from '../../assets/png/face/mironova pic.png'

export default defineComponent({
  name: 'SupportSection',
  components: {},
  data() {
    return {
      showModal: false,
      modalType: null as string | null,
      currentSlide: 0,
      slideInterval: null as number | null,
      testimonials: [
        {
          avatar: ivanovaPic,
          role: 'Волонтёр',
          text: 'Быть частью команды — это вдохновляет! Я помогаю другим и развиваюсь сама.',
          author: 'Алла Гурнова',
          icon: '👐'
        },
        {
          avatar: komarovPic,
          role: 'Партнёр',
          text: 'Совместные проекты с вами — это вклад в будущее, которым мы гордимся.',
          author: 'Евгений Баранов',
          icon: '🤝'
        },
        {
          avatar: mironovaPic,
          role: 'Донор',
          text: 'Я вижу реальные результаты своей поддержки. Это важно для меня!',
          author: 'Елена Долина',
          icon: '💸'
        }
      ]
    }
  },
  mounted() {
    this.startAutoSlide()
  },
  beforeUnmount() {
    this.stopAutoSlide()
  },
  methods: {
    openModal(type: string) {
      this.modalType = type
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.modalType = null
    },
    startAutoSlide() {
      this.slideInterval = window.setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.testimonials.length
      }, 5000)
    },
    stopAutoSlide() {
      if (this.slideInterval) {
        clearInterval(this.slideInterval)
        this.slideInterval = null
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '@/assets/styles/variables.scss' as *;
.support-section {
  width: 100%;
  min-height: 520px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem 6rem 2rem;
  position: relative;
  z-index: 1;
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

.support-title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.support-title-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 8px rgba($primary-teal, 0.2));
}

.support-title {
  font-size: 2.8rem;
  font-weight: 900;
  line-height: $leading-10;
  color: $primary-teal;
  margin: 0;
  text-shadow: 0 2px 8px rgba($primary-teal, 0.15);
  letter-spacing: 0.03em;
}

.support-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  color: $primary-teal;
  opacity: 0.8;
  max-width: 600px;
  margin: 0;
}

.support-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-bottom: 2.5rem;
}

.support-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background-color: $primary-teal;
  border-radius: $border-radius-xl;
  border: 1px solid rgba($primary-teal, 0.2);
  box-shadow: 0 2px 16px rgba($primary-teal, 0.08);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: color.adjust($primary-teal, $lightness: -5%);
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 8px 32px rgba($primary-teal, 0.18);
    z-index: 2;
  }
}

.support-option-icon {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.support-option h3 {
  font-size: $text-xl;
  font-weight: 700;
  color: $white;
  margin: 0;
}

.support-option p {
  font-size: $text-base;
  line-height: $leading-relaxed;
  color: $white;
  opacity: 0.9;
  text-align: center;
  margin: 0;
}

.support-link {
  display: inline-block;
  padding: 1rem 2rem;
  background: $white;
  color: $primary-teal;
  text-decoration: none;
  border-radius: $border-radius-lg;
  font-weight: 700;
  font-size: $text-lg;
  box-shadow: 0 4px 24px rgba($white, 0.3);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s, filter 0.2s;
  cursor: pointer;
  margin-top: 1rem;
  &:hover {
    background: color.adjust($white, $lightness: -5%);
    transform: scale(1.07);
    box-shadow: 0 8px 32px rgba($white, 0.4);
  }
  animation: pulse 2.5s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba($white, 0.3); }
  70% { box-shadow: 0 0 0 12px rgba($white, 0); }
  100% { box-shadow: 0 0 0 0 rgba($white, 0.3); }
}

.support-testimonials {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
}

.support-testimonial {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: $primary-teal;
  border-radius: $border-radius-lg;
  padding: 1.2rem 2rem;
  box-shadow: 0 4px 16px rgba($primary-teal, 0.15);
  min-width: 260px;
  max-width: 320px;
  flex: 1 1 260px;
  position: relative;
}

.testimonial-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: $border-radius-full;
  object-fit: cover;
  border: 2px solid $white;
}

.testimonial-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.testimonial-role {
  font-size: 0.95rem;
  font-weight: 700;
  color: $white;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.testimonial-text {
  color: $white;
  font-size: $text-base;
  margin: 0;
}

.testimonial-author {
  color: $white;
  opacity: 0.7;
  font-size: $text-sm;
  margin: 0;
}

.testimonial-icon {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  font-size: 1.5rem;
  opacity: 0.5;
  filter: brightness(0) invert(1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647;
  pointer-events: all;
}

.modal-content {
  background: $white;
  color: $primary-teal;
  border-radius: $border-radius-lg;
  padding: 2rem 3rem;
  min-width: 320px;
  text-align: center;
  box-shadow: 0 8px 32px rgba($primary-teal, 0.15);
  position: relative;
  z-index: 10000;
}

.modal-close {
  margin-top: 1.5rem;
  padding: 0.5rem 1.5rem;
  background: $primary-teal;
  color: $white;
  border: none;
  border-radius: $border-radius-md;
  font-size: $text-base;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: color.adjust($primary-teal, $lightness: -10%);
  }
}

@media (max-width: $breakpoint-lg) {
  .support-section {
    min-height: auto;
    padding: 4rem 2rem;
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
  .support-testimonials {
    flex-direction: column;
    align-items: center;
  }
}

/* Transition classes for the testimonial slider */
.testimonial-slide-enter-active,
.testimonial-slide-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.testimonial-slide-enter-from,
.testimonial-slide-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
.testimonial-slide-enter-to,
.testimonial-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
