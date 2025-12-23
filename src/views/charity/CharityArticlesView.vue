<template>
  <div class="charity-articles">
    <UiSection>
      <h1 class="page-title">Статьи</h1>
      <p class="page-description">
        Читайте наши статьи о социальной 3D-печати, опыте волонтёров и историях поддержки
      </p>

      <div v-if="store.articles.length === 0" class="empty-state">
        <p>Статьи пока не добавлены. Скоро здесь появятся интересные материалы!</p>
      </div>

      <div v-else class="articles-grid">
        <article v-for="article in store.articles" :key="article.id" class="article-card">
          <img v-if="article.image" :src="article.image" :alt="article.title" class="article-image" />
          <div class="article-content">
            <span v-if="article.category" class="article-category">{{ article.category }}</span>
            <h2 class="article-title">{{ article.title }}</h2>
            <div class="article-meta">
              <span class="article-author">{{ article.author }}</span>
              <span class="article-date">{{ formatDate(article.date) }}</span>
            </div>
            <p class="article-excerpt">{{ getExcerpt(article.content) }}</p>
            <button class="read-more-btn">Читать далее</button>
          </div>
        </article>
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'

const store = useCharityStore()

onMounted(() => {
  store.fetchArticles()
})

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getExcerpt(content: string, maxLength: number = 150): string {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.page-title {
  font-size: $text-3xl;
  text-align: center;
  margin-bottom: $spacing-4;
  color: $primary-teal;
}

.page-description {
  text-align: center;
  color: $gray-600;
  margin-bottom: $spacing-8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.empty-state {
  text-align: center;
  padding: $spacing-12;
  color: $gray-500;
  font-size: $text-lg;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $spacing-6;
  max-width: 1200px;
  margin: 0 auto;
}

.article-card {
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;
  transition: transform $transition-fast, box-shadow $transition-fast;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }
}

.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-content {
  padding: $spacing-6;
}

.article-category {
  display: inline-block;
  background: $primary-orange;
  color: $white;
  padding: $spacing-1 $spacing-3;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  margin-bottom: $spacing-3;
}

.article-title {
  font-size: $text-xl;
  color: $gray-800;
  margin-bottom: $spacing-3;
  line-height: $leading-tight;
}

.article-meta {
  display: flex;
  gap: $spacing-4;
  color: $gray-500;
  font-size: $text-sm;
  margin-bottom: $spacing-4;
}

.article-excerpt {
  color: $gray-600;
  line-height: $leading-relaxed;
  margin-bottom: $spacing-4;
}

.read-more-btn {
  background: $primary-teal;
  color: $white;
  border: none;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-md;
  cursor: pointer;
  font-weight: 500;
  transition: background $transition-fast;

  &:hover {
    background: $primary-mint;
  }
}
</style>

