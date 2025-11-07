<template>
  <section class="not-found">
    <div class="container">
      <h1 class="title">404 — Страница не найдена</h1>
      <p class="subtitle">Похоже, вы перешли по неверной ссылке или страница была перемещена.</p>
      <router-link class="button" :to="{ name: 'home' }">На главную</router-link>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'NotFoundView'
}
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  text-align: center;
}

.container {
  max-width: 720px;
}

.title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
}

.subtitle {
  margin: 0 0 1.5rem;
  color: #6b7280;
}

.button {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #fff;
  background: #1f9e8f;
  transition: transform .15s ease, opacity .15s ease;

  &:hover { opacity: .9; transform: translateY(-1px); }
}
</style>


