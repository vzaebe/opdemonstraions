<template>
  <section class="test-routing">
    <div class="container">
      <h1 class="title">Тестовая страница роутинга</h1>
      <p class="text">Если вы видите эту страницу — маршрутизация работает.</p>
      <router-link class="link" :to="{ name: 'home' }">Вернуться на главную</router-link>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'TestRoutingView'
}
</script>

<style scoped>
.test-routing { min-height: 50vh; display: grid; place-items: center; padding: 2rem; }
.container { text-align: center; }
.title { margin: 0 0 0.5rem; font-size: clamp(1.5rem, 3vw, 2rem); }
.text { margin: 0 0 1rem; color: #6b7280; }
.link { color: #1f9e8f; text-decoration: none; }
.link:hover { text-decoration: underline; }
</style>


