<template>
  <div class="charity-done">
    <UiSection>
      <h1 class="page-title">Выполненные работы</h1>
      <p class="page-subtitle">
        Галерея проектов, которые мы уже реализовали и передали детям.
      </p>
      
      <div class="works-grid">
        <WorkCard
          v-for="work in store.doneWorks"
          :key="work.id"
          :title="work.title"
          :image="work.image"
          :description="work.description"
          :date="work.date"
        />
      </div>
      
      <div v-if="store.doneWorks.length === 0" class="empty-state">
        Пока нет выполненных работ. Но мы работаем над этим!
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import WorkCard from '@/components/charity/WorkCard.vue'

const store = useCharityStore()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.page-title {
  font-size: $text-3xl;
  color: $gray-900;
  text-align: center;
  margin-bottom: $spacing-4;
}

.page-subtitle {
  text-align: center;
  color: $gray-600;
  max-width: 600px;
  margin: 0 auto $spacing-10;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-6;
}

.empty-state {
  text-align: center;
  padding: $spacing-10;
  color: $gray-500;
  font-size: $text-lg;
}
</style>




