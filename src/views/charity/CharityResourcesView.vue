<template>
  <div class="charity-resources">
    <UiSection>
      <h1 class="page-title">Полезные ресурсы</h1>
      <div class="resources-list">
        <div v-for="(group, category) in groupedResources" :key="category" class="resource-group">
          <h2>{{ category }}</h2>
          <ul>
            <li v-for="resource in group" :key="resource.id">
              <a :href="resource.url" target="_blank">{{ resource.title }}</a>
              <span v-if="resource.description" class="desc"> - {{ resource.description }}</span>
            </li>
          </ul>
        </div>
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import type { Resource } from '@/types/charity'

const store = useCharityStore()

onMounted(() => {
  store.fetchResources()
})

const groupedResources = computed(() => {
  const groups: Record<string, Resource[]> = {}
  store.resources.forEach((r) => {
    ;(groups[r.category] ||= []).push(r)
  })
  return groups
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.page-title {
  font-size: $text-3xl;
  text-align: center;
  margin-bottom: $spacing-8;
}

.resources-list {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  gap: $spacing-8;
}

.resource-group {
  background: $white;
  padding: $spacing-6;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;

  h2 {
    color: $primary-teal;
    margin-bottom: $spacing-4;
    border-bottom: 1px solid $gray-100;
    padding-bottom: $spacing-2;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: $spacing-2;
    padding-left: $spacing-4;
    position: relative;

    &::before {
      content: "•";
      color: $primary-orange;
      position: absolute;
      left: 0;
    }

    a {
      color: $gray-800;
      text-decoration: none;
      font-weight: 500;
      transition: color $transition-fast;

      &:hover {
        color: $primary-teal;
      }
    }
    
    .desc {
      color: $gray-500;
      font-size: $text-sm;
    }
  }
}
</style>
