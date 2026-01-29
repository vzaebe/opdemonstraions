<template>
  <UiCard class="work-card" :padded="false">
    <div class="work-card__image-wrapper">
      <img :src="image" :alt="title" class="work-card__image" loading="lazy" />
    </div>
    <div class="work-card__content">
      <h3 class="work-card__title">{{ title }}</h3>
      <p class="work-card__description">{{ description }}</p>
      <div class="work-card__footer">
        <span class="work-card__date">{{ formattedDate }}</span>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UiCard } from '../../ui'

const props = defineProps<{
  title: string
  image: string
  description: string
  date: string
}>()

const formattedDate = computed(() => {
  return new Date(props.date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.work-card {
  overflow: hidden;
  box-shadow: $shadow;
  transition: transform $transition-normal, box-shadow $transition-normal;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }

  &__image-wrapper {
    position: relative;
    padding-top: 60%; // 16:9 aspect ratio roughly
    background: $gray-100;
    overflow: hidden;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-slow;

    .work-card:hover & {
      transform: scale(1.05);
    }
  }

  &__content {
    padding: $spacing-4;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 600;
    color: $gray-900;
    margin-bottom: $spacing-2;
  }

  &__description {
    font-size: $text-base;
    color: $gray-600;
    margin-bottom: $spacing-4;
    flex-grow: 1;
    line-height: $leading-relaxed;
  }

  &__footer {
    border-top: 1px solid $gray-200;
    padding-top: $spacing-3;
    text-align: right;
  }

  &__date {
    font-size: $text-sm;
    color: $gray-500;
  }
}
</style>




