<template>
  <div class="testimonial-card">
    <img class="testimonial-avatar" :src="testimonial.avatar" :alt="testimonial.author" />
    <div class="testimonial-content">
      <span class="testimonial-role">{{ testimonial.role }}</span>
      <p class="testimonial-text">{{ testimonial.text }}</p>
      <p class="testimonial-author">{{ testimonial.author }}</p>
    </div>
    <span class="testimonial-icon">{{ testimonial.icon }}</span>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

interface Testimonial {
  avatar: string
  role: string
  text: string
  author: string
  icon: string
}

defineProps<{ testimonial: Testimonial }>()
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '@/assets/styles/variables.scss' as *;
.testimonial-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: $primary-teal;
  border-radius: $border-radius-lg;
  padding: 1.5rem 2.5rem;
  box-shadow: 0 4px 16px rgba($primary-teal, 0.15);
  max-width: 450px;
  width: 100%;
  position: relative;
}

.testimonial-avatar {
  width: 3.5rem;
  height: 3.5rem;
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
  font-size: 1rem;
  font-weight: 700;
  color: $white;
  margin-bottom: 0.25rem;
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
  opacity: 0.8;
  font-size: $text-sm;
  margin: 0;
  margin-top: 0.25rem;
}

.testimonial-icon {
  position: absolute;
  right: 1.25rem;
  bottom: 1.25rem;
  font-size: 1.75rem;
  opacity: 0.45;
  filter: brightness(0) invert(1);
}

@media (max-width: $breakpoint-sm) {
  .testimonial-card {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem 1.5rem 2.5rem 1.5rem;
  }
  .testimonial-icon {
    position: static;
    margin-top: 0.75rem;
  }
}
</style>
