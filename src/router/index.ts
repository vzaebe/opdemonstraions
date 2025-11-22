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
    
    // Charity Module Routes
    { 
      path: '/charity', 
      name: 'charity', 
      component: () => import('../views/charity/CharityMainView.vue'), 
      meta: { title: 'Благотворительная 3D-печать' } 
    },
    { 
      path: '/charity/request', 
      name: 'charity-request', 
      component: () => import('../views/charity/CharityRequestView.vue'), 
      meta: { title: 'Подать заявку' } 
    },
    { 
      path: '/charity/done', 
      name: 'charity-done', 
      component: () => import('../views/charity/CharityDoneView.vue'), 
      meta: { title: 'Выполненные работы' } 
    },
    { 
      path: '/charity/community', 
      name: 'charity-community', 
      component: () => import('../views/charity/CharityCommunityView.vue'), 
      meta: { title: 'Сообщество' } 
    },
    { 
      path: '/charity/help', 
      name: 'charity-help', 
      component: () => import('../views/charity/CharityHelpView.vue'), 
      meta: { title: 'Помочь проекту' } 
    },
    { 
      path: '/charity/fundraising', 
      name: 'charity-fundraising', 
      component: () => import('../views/charity/CharityFundraisingView.vue'), 
      meta: { title: 'Целевые сборы' } 
    },
    { 
      path: '/charity/resources', 
      name: 'charity-resources', 
      component: () => import('../views/charity/CharityResourcesView.vue'), 
      meta: { title: 'Ресурсы' } 
    },

    // Admin Panel
    { 
      path: '/admin', 
      name: 'admin', 
      component: () => import('../views/admin/AdminDashboardView.vue'), 
      meta: { title: 'Панель администратора', hideLayout: true } 
    },

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
