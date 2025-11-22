<script lang="ts">
/**
 * Корневой компонент приложения.
 * Здесь собираются все секции лендинга, а также глобальные элементы —
 * шапка (AppHeader), футер (AppFooter) и баннер согласия на использование
 * cookie (CookieBanner).
 *
 * Каждая секция вынесена в отдельный компонент в директории
 * `src/components/sections`, что упрощает поддержку и возможность
 * переиспользования.
 *
 * При необходимости изменить порядок секций или добавить новую — достаточно
 * отредактировать разметку в теге <template> ниже (без изменений логики).
 */
// Импортируем только layout-элементы. Контентные секции живут в маршрутах
import { defineAsyncComponent } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
const CookieBanner = defineAsyncComponent(() => import('./components/CookieBanner.vue'))

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    CookieBanner
  }
}
</script>

<template>
  <!-- Главный контейнер приложения -->
  <div id="app">
    <!-- Компонент навигации -->
    <AppHeader v-if="!$route.meta.hideLayout" />

    <!-- Основной контент (маршруты) -->
    <main>
      <router-view />
      <CookieBanner v-if="!$route.meta.hideLayout" />
    </main>

    <!-- Футер -->
    <AppFooter v-if="!$route.meta.hideLayout" />
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/global.scss' as *;
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $gray-900;
  line-height: $leading-relaxed;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

// Основной контейнер приложения
.app {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden; // Предотвращаем горизонтальную прокрутку
}

// Контейнер для основного контента
.main-content {
  width: 100%;
}

// Основной контент
main {
  flex: 1;
  width: 100%;
  overflow-x: hidden; // Предотвращает горизонтальную прокрутку
}

// Smooth scrolling for anchor links
html {
  scroll-behavior: smooth;
}

// Reset default margins and paddings
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
