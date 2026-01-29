<template>
  <div id="print-app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePrintStore } from '@/stores/print'

const printStore = usePrintStore()

onMounted(async () => {
  // Load feature flags and initial data
  await printStore.loadFeatureFlags()
})
</script>

<style scoped lang="scss">
#print-app {
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
}
</style>
