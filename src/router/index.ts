/**
 * Файл конфигурации маршрутизатора Vue Router.
 * Здесь объявляются публичные маршруты SPA-лендинга.
 *
 * При добавлении новых страниц достаточно добавить объект маршрута в массив
 * `routes` ниже.
 *
 * Структура маршрутов:
 * - Публичные маршруты (главная, о нас, проекты, партнёры, контакты, знания, поддержка)
 * - Модуль социальной 3D-печати (/charity/*)
 * - Админ-панель (/admin)
 * - 404 страница
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePrintAuthStore } from '@/stores/print-auth'
import { printServiceRoutes } from './print-service-routes'

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
    path: '/projects/:slug',
    name: 'organization-project-detail',
    component: () => import('../views/OrganizationProjectDetailView.vue'),
    meta: { title: 'Проект' }
  },
  { 
    path: '/partners', 
    name: 'partners', 
    component: () => import('../views/PartnersView.vue'), 
    meta: { title: 'Партнёры' } 
  },
  {
    path: '/partners/:id',
    name: 'partner-detail',
    component: () => import('../views/PartnerDetailView.vue'),
    meta: { title: 'Партнёр' }
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

// Маршруты модуля социальной 3D-печати
const charityRoutes: RouteRecordRaw[] = [
  { 
    path: '/charity', 
    name: 'charity', 
    component: () => import('../views/charity/CharityMainView.vue'), 
    meta: { title: 'Социальная 3D-печать' } 
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
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/admin/AdminLoginView.vue'),
    meta: { title: 'Вход', hideLayout: true }
  },
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
  ...printServiceRoutes,
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
    const behavior: ScrollBehavior = 'smooth'

    // Прокрутка к якорю при наличии hash (с учётом sticky header)
    if (to.hash) {
      return new Promise((resolve) => {
        // даём DOM обновиться (в т.ч. после смены роутов)
        window.requestAnimationFrame(() => {
          const target = document.querySelector(to.hash) as HTMLElement | null
          if (!target) {
            resolve({ left: 0, top: 0, behavior })
            return
          }

          // фиксированная шапка
          const header = document.querySelector('header.header') as HTMLElement | null
          const headerOffset = (header?.offsetHeight ?? 0) + 12

          const top = target.getBoundingClientRect().top + window.scrollY - headerOffset
          resolve({ left: 0, top: Math.max(0, top), behavior })
        })
      })
    }

    // Прокрутка в начало страницы
    return { left: 0, top: 0, behavior }
  },
  routes
})

// Admin auth guard (JWT token in localStorage)
router.beforeEach(async (to) => {
  const path = String(to.path || '')
  const isPrintArea = path.startsWith('/print')
  if (isPrintArea) {
    const printAuth = usePrintAuthStore()

    if (to.meta.requiresAuth && !printAuth.isAuthenticated) {
      return { name: 'print-calculator', query: { redirect: to.fullPath } }
    }

    if (to.meta.requiresAdmin && printAuth.user?.role !== 'admin' && printAuth.user?.role !== 'superadmin') {
      return { name: 'print-calculator' }
    }

    return true
  }

  const isAdminArea = path.startsWith('/admin')
  if (!isAdminArea) return true

  const auth = useAuthStore()

  // Allow opening login page, but redirect away if already authenticated.
  if (to.name === 'admin-login') {
    if (auth.isAuthenticated) {
      const ok = await auth.checkSession()
      if (ok) return { name: 'admin' }
    }
    return true
  }

  if (!auth.isAuthenticated) {
    return { name: 'admin-login', query: { next: to.fullPath } }
  }

  // Validate token once when entering admin area.
  if (!auth.role) {
    const ok = await auth.checkSession()
    if (!ok) return { name: 'admin-login', query: { next: to.fullPath } }
  }

  return true
})

// Устанавливаем заголовок страницы по meta.title, если задан
router.afterEach((to) => {
  const baseTitle = 'Открытые Перспективы'
  const pageTitle = (to.meta as any)?.title
  document.title = pageTitle ? `${pageTitle} — ${baseTitle}` : baseTitle

  // Lightweight telemetry (best-effort, no secrets)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  try {
    fetch(`${apiBase}/telemetry/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: to.fullPath, referrer: document.referrer || '' }),
      keepalive: true
    }).catch(() => {})
  } catch {
    // ignore
  }
})

export default router
