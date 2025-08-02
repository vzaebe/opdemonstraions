/**
 * Файл конфигурации маршрутизатора Vue Router.
 * Здесь объявляются публичные маршруты SPA-лендинга.
 *
 * При добавлении новых страниц достаточно добавить объект маршрута в массив
 * `routes` ниже.
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // разделение кода на уровне маршрута: каждая страница будет вынесена
      // в отдельный чанк (имя файла About.[hash].js). Такой кусок будет
      // загружен лениво только при первом переходе на страницу.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
