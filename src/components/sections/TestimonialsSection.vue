<template>
  <section class="testimonials-section">
    <div class="testimonials-shell">
      <header class="testimonials-header">
        <h2 class="testimonials-title">Отзывы</h2>
        <p class="testimonials-subtitle">Что говорят участники наших программ</p>
      </header>

      <div class="carousel">
        <button class="carousel-nav prev" type="button" @click="goPrev" :disabled="activeIndex === 0" aria-label="Предыдущий отзыв">
          <Icon name="chevron-left" :size="18" class="nav-icon" />
        </button>

        <div ref="trackEl" class="carousel-track" @scroll.passive="onScroll">
          <article
            v-for="(t, idx) in testimonials"
            :key="idx"
            class="testimonial-card"
            :aria-current="idx === activeIndex ? 'true' : 'false'"
          >
            <img class="testimonial-avatar" :src="t.avatar" :alt="t.author" />
            <div class="testimonial-content">
              <p class="testimonial-text">{{ t.text }}</p>
              <p class="testimonial-author">{{ t.author }}</p>
            </div>
          </article>
        </div>

        <button
          class="carousel-nav next"
          type="button"
          @click="goNext"
          :disabled="activeIndex === testimonials.length - 1"
          aria-label="Следующий отзыв"
        >
          <Icon name="chevron-right" :size="18" class="nav-icon" />
        </button>
      </div>

      <div class="carousel-dots" role="tablist" aria-label="Пагинация отзывов">
        <button
          v-for="(_, idx) in testimonials"
          :key="idx"
          type="button"
          class="dot"
          :class="{ active: idx === activeIndex }"
          @click="scrollToIndex(idx)"
          :aria-label="`Отзыв ${idx + 1}`"
          :aria-current="idx === activeIndex ? 'true' : 'false'"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/**
 * Секция «Отзывы» (TestimonialsSection).
 * Отображает два отзыва с аватаром. Шаблон можно расширить, заменив статическую
 * разметку на v-for по массиву отзывов.
 */
export default {
  name: 'TestimonialsSection'
}
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import Icon from '@/components/ui/Icon.vue'

const face1Url = new URL('../../assets/png/1face.png', import.meta.url).href
const face2Url = new URL('../../assets/png/2face.png', import.meta.url).href

const testimonials = [
  {
    avatar: face1Url,
    author: 'Андрей Иванов',
    text: 'Я поступил в Бауманку, несмотря на инвалидность по слуху. Всё благодаря команде «Открытых перспектив» и их проектам в университете.'
  },
  {
    avatar: face2Url,
    author: 'Алина Гришко',
    text: 'Я из небольшого города, из детского дома. «Открытые Перспективы» помогли мне поступить в Губкинский университет.'
  }
]

const trackEl = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const scrollToIndex = (idx: number) => {
  const el = trackEl.value
  if (!el) return
  const cards = Array.from(el.querySelectorAll<HTMLElement>('.testimonial-card'))
  const target = cards[idx]
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
}

const goPrev = () => scrollToIndex(Math.max(0, activeIndex.value - 1))
const goNext = () => scrollToIndex(Math.min(testimonials.length - 1, activeIndex.value + 1))

const onScroll = () => {
  const el = trackEl.value
  if (!el) return
  const cards = Array.from(el.querySelectorAll<HTMLElement>('.testimonial-card'))
  if (!cards.length) return

  // Determine active card by closest left edge to scrollLeft
  const left = el.scrollLeft
  let bestIdx = 0
  let bestDist = Number.POSITIVE_INFINITY
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    if (!card) continue
    const dist = Math.abs(card.offsetLeft - left)
    if (dist < bestDist) {
      bestDist = dist
      bestIdx = i
    }
  }
  activeIndex.value = bestIdx
}
</script>

<style lang="scss" scoped>
.testimonials-section {
  width: 100%;
  background: linear-gradient(135deg, $primary-teal 0%, $primary-mint 100%);
  padding: 5rem 0;
}

.testimonials-shell {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
}

.testimonials-header {
  text-align: center;
  margin-bottom: 2rem;
}

.testimonials-title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: $white;
  margin: 0 0 0.5rem 0;
}

.testimonials-subtitle {
  color: rgba($white, 0.9);
  max-width: 680px;
  margin: 0 auto;
}

.carousel {
  position: relative;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 0.75rem;
}

.carousel-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(260px, 1fr);
  gap: 1rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding: 0.5rem;
  padding: 0.5rem;

  // hide scrollbar (most browsers)
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.testimonial-card {
  scroll-snap-align: start;
  background: rgba($white, 0.12);
  border: 1px solid rgba($white, 0.22);
  backdrop-filter: blur(10px);
  border-radius: $border-radius-xl;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 1rem;
  align-items: start;
  min-height: 160px;
}

.testimonial-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.testimonial-avatar {
  width: 56px;
  height: 56px;
  border-radius: $border-radius-full;
  object-fit: cover;
  border: 2px solid rgba($white, 0.85);
}

.testimonial-text {
  font-size: $text-base;
  font-weight: 500;
  line-height: $leading-relaxed;
  color: $white;
  margin: 0;
}

.testimonial-author {
  opacity: 0.85;
  font-size: $text-sm;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: $leading-relaxed;
  color: $white;
  text-transform: uppercase;
  margin: 0;
}

.carousel-nav {
  width: 44px;
  height: 44px;
  border-radius: $border-radius-full;
  border: 1px solid rgba($white, 0.3);
  background: rgba($white, 0.12);
  color: $white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, opacity 0.2s ease;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
  }

  &:hover:not(:disabled) {
    background: rgba($white, 0.18);
    transform: translateY(-1px);
  }
}

@media (max-width: $breakpoint-md) {
  .carousel {
    grid-template-columns: 1fr;
  }

  .carousel-nav {
    display: none;
  }
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 1px solid rgba($white, 0.5);
  background: rgba($white, 0.18);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;

  &.active {
    background: $white;
    transform: scale(1.15);
  }
}
</style>