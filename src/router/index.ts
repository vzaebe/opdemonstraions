/**
 * Файл конфигурации маршрутизатора Vue Router.
 * Здесь объявляются публичные маршруты SPA-лендинга.
 *
 * При добавлении новых страниц достаточно добавить объект маршрута в массив
 * `routes` ниже.
 *
 * Структура маршрутов:
 * - Публичные маршруты (главная, о нас, проекты, партнёры, контакты, знания, поддержка)
 * - Модуль благотворительности (/charity/*)
 * - Админ-панель (/admin)
 * - 404 страница
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 ОПРЕДЕЛЕНИЕ МАРШРУТОВ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Публичные маршруты
const publicRoutes: RouteRecordRaw[] = [
  { 
    path: '/', 
    name: 'home', 
    component: () => import('../views/HomeView.vue'), 
    meta: { title: 'Главная' } 
  },
  { 
    path: '/about', 
    name: 'about', 
    component: () => import('../views/AboutView.vue'), 
    meta: { title: 'О нас' } 
  },
  { 
    path: '/projects', 
    name: 'organization-projects', 
    component: () => import('../views/OrganizationProjectsView.vue'), 
    meta: { title: 'Проекты организации' } 
  },
  { 
    path: '/partners', 
    name: 'partners', 
    component: () => import('../views/PartnersView.vue'), 
    meta: { title: 'Партнёры' } 
  },
  { 
    path: '/contacts', 
    name: 'contacts', 
    component: () => import('../views/ContactView.vue'), 
    meta: { title: 'Контакты' } 
  },
  { 
    path: '/knowledge', 
    name: 'knowledge', 
    component: () => import('../views/KnowledgeView.vue'), 
    meta: { title: 'База знаний РЖЯ' } 
  },
  { 
    path: '/support', 
    name: 'support', 
    component: () => import('../views/SupportView.vue'), 
    meta: { title: 'Поддержать проект' } 
  },
  { 
    path: '/test', 
    name: 'test', 
    component: () => import('../views/TestRoutingView.vue'), 
    meta: { title: 'Тест роутинга' } 
  }
]

// Маршруты модуля благотворительности
const charityRoutes: RouteRecordRaw[] = [
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
  { 
    path: '/charity/articles', 
    name: 'charity-articles', 
    component: () => import('../views/charity/CharityArticlesView.vue'), 
    meta: { title: 'Статьи' } 
  },
  { 
    path: '/charity/videos', 
    name: 'charity-videos', 
    component: () => import('../views/charity/CharityVideosView.vue'), 
    meta: { title: 'Видео' } 
  },
  { 
    path: '/charity/materials', 
    name: 'charity-materials', 
    component: () => import('../views/charity/CharityMaterialsView.vue'), 
    meta: { title: 'Материалы' } 
  },
  { 
    path: '/charity/models', 
    name: 'charity-models', 
    component: () => import('../views/charity/CharityModelsView.vue'), 
    meta: { title: 'Список моделей' } 
  },
  { 
    path: '/charity/partners', 
    name: 'charity-partners', 
    component: () => import('../views/charity/CharityPartnersView.vue'), 
    meta: { title: 'Партнёры' } 
  },
  { 
    path: '/charity/projects', 
    name: 'charity-projects', 
    component: () => import('../views/charity/CharityProjectsView.vue'), 
    meta: { title: 'Проекты' } 
  },
  { 
    path: '/charity/projects/:id', 
    name: 'project-detail', 
    component: () => import('../views/charity/ProjectDetailView.vue'), 
    meta: { title: 'Детали проекта' } 
  }
]

// Админ-панель
const adminRoutes: RouteRecordRaw[] = [
  { 
    path: '/admin', 
    name: 'admin', 
    component: () => import('../views/admin/AdminDashboardView.vue'), 
    meta: { title: 'Панель администратора', hideLayout: true } 
  }
]

// Объединение всех маршрутов
const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...charityRoutes,
  ...adminRoutes,
  // 404 страница должна быть последней
  { 
    path: '/:pathMatch(.*)*', 
    name: 'not-found', 
    component: () => import('../views/NotFoundView.vue'), 
    meta: { title: 'Страница не найдена' } 
  }
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 СОЗДАНИЕ РОУТЕРА
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Восстанавливаем позицию прокрутки при навигации назад/вперёд
    if (savedPosition) {
      return savedPosition
    }
    // Прокрутка к якорю при наличии hash
    if (to.hash) {
      return { 
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Прокрутка в начало страницы
    return { top: 0, behavior: 'smooth' }
  },
  routes
})

// Устанавливаем заголовок страницы по meta.title, если задан
router.afterEach((to) => {
  const baseTitle = 'Открытые Перспективы'
  const pageTitle = (to.meta as any)?.title
  document.title = pageTitle ? `${pageTitle} — ${baseTitle}` : baseTitle
})

export default router
