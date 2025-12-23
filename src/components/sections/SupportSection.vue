<template>
  <section class="support-section">
    <div class="support-container">
      <div class="support-content">
        <div class="support-title-wrapper">
          <Icon class="support-title-icon" name="handshake" :size="32" title="Поддержка" />
          <h2 class="support-title">{{ content?.title || 'Поддержите наш проект' }}</h2>
        </div>
        <p class="support-subtitle">{{ content?.subtitle || '' }}</p>
        <div class="support-options">
          <div
            v-for="opt in (content?.options || [])"
            :key="opt.key"
            class="support-option"
          >
            <Icon class="support-option-icon" :name="opt.iconName || 'handshake'" :size="30" :title="opt.title" />
            <h3>{{ opt.title }}</h3>
            <p>{{ opt.text }}</p>
            <router-link
              class="support-link"
              :to="{ name: opt.routeName, hash: opt.routeHash || undefined }"
            >
              {{ opt.linkText || 'Перейти' }}
            </router-link>
          </div>
        </div>

        <div v-if="currentTestimonial" class="support-testimonials">
          <transition name="testimonial-slide" mode="out-in">
            <div :key="currentSlide" class="support-testimonial">
              <img class="testimonial-avatar" :src="currentTestimonial.avatarUrl" :alt="currentTestimonial.author" />
              <div class="testimonial-content">
                <div class="testimonial-role">{{ currentTestimonial.role }}</div>
                <p class="testimonial-text">{{ currentTestimonial.text }}</p>
                <p class="testimonial-author">{{ currentTestimonial.author }}</p>
              </div>
              <Icon class="testimonial-icon" :name="currentTestimonial.iconName || 'handshake'" :size="20" />
            </div>
          </transition>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import { http, trackApiError } from '@/services/api/http'

type SupportSectionOption = {
  key: string
  iconName?: string
  title: string
  text: string
  routeName: string
  routeHash?: string
  linkText?: string
}

type SupportSectionTestimonial = {
  avatarUrl: string
  role: string
  text: string
  author: string
  iconName?: string
}

type SupportSectionContent = {
  title: string
  subtitle: string
  options: SupportSectionOption[]
  testimonials: SupportSectionTestimonial[]
}

const content = ref<SupportSectionContent | null>(null)
const currentSlide = ref(0)
const slideInterval = ref<number | null>(null)

const testimonials = computed(() => content.value?.testimonials || [])
const currentTestimonial = computed(() => testimonials.value[currentSlide.value] || null)

async function loadContent() {
  try {
    content.value = await http.get<SupportSectionContent>('/site-content/supportSection')
  } catch (error) {
    trackApiError(error, 'SupportSection.fetchSiteContent')
    content.value = null
  }
}

function startAutoSlide() {
  if (slideInterval.value) return
  if (testimonials.value.length < 2) return
  slideInterval.value = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % testimonials.value.length
  }, 5000)
}

function stopAutoSlide() {
  if (slideInterval.value) {
    clearInterval(slideInterval.value)
    slideInterval.value = null
  }
}

onMounted(async () => {
  await loadContent()
  startAutoSlide()
})

onBeforeUnmount(() => {
  stopAutoSlide()
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
  color: $primary-teal;
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
  color: $white;
  margin-bottom: 0.5rem;
  opacity: 0.95;
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
  opacity: 0.55;
  color: $white;
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
