<template>
  <tr class="expandable-row" :class="{ 'is-expanded': isExpanded }">
    <slot name="row" :toggle="toggleExpand" :is-expanded="isExpanded"></slot>
  </tr>
  <tr v-if="isExpanded" class="expanded-content">
    <td :colspan="colspan">
      <div class="expansion-panel">
        <slot name="expansion"></slot>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  colspan: number
}>()

const isExpanded = ref(false)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

defineExpose({
  toggle: toggleExpand,
  isExpanded
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.expandable-row {
  transition: background $transition-fast;

  &.is-expanded {
    background: rgba($primary-teal, 0.02);
  }
}

.expanded-content {
  background: $gray-50;
  
  td {
    padding: 0 !important;
    border-bottom: 2px solid $primary-teal !important;
  }
}

.expansion-panel {
  padding: $spacing-6;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
