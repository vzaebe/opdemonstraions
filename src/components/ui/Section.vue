<template>
  <section :class="['ui-section', padding, background]">
    <div class="ui-section__container">
      <slot />
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'UiSection',
  props: {
    padding: { type: String, default: 'py-16' },
    background: { type: String, default: '' },
  },
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.ui-section__container {
  width: 100%;
  max-width: $container-width;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>


