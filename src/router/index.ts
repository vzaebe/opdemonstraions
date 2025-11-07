/**
 * Файл конфигурации маршрутизатора Vue Router.
 * Здесь объявляются публичные маршруты SPA-лендинга.
 *
 * При добавлении новых страниц достаточно добавить объект маршрута в массив
 * `routes` ниже.
 */
import { createRouter, createWebHistory } from 'vue-router'
// Используем ленивую загрузку для всех страниц
const HomeView = () => import('../views/HomeView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Главная' } },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), meta: { title: 'О нас' } },
    { path: '/test', name: 'test', component: () => import('../views/TestRoutingView.vue'), meta: { title: 'Тест роутинга' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { title: 'Страница не найдена' } },
  ],
})

// Устанавливаем заголовок страницы по meta.title, если задан
router.afterEach((to) => {
  const baseTitle = 'Открытые Перспективы'
  const pageTitle = (to.meta as any)?.title
  document.title = pageTitle ? `${pageTitle} — ${baseTitle}` : baseTitle
})

export default router
