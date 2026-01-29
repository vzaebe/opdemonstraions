import type { RouteRecordRaw } from 'vue-router'

export const printServiceRoutes: RouteRecordRaw[] = [
  {
    path: '/print',
    name: 'print-landing',
    component: () => import('@/views/LandingView.vue'),
    meta: { hideLayout: true },
  },
  {
    path: '/print/calculator',
    name: 'print-calculator',
    component: () => import('@/views/CalculatorView.vue'),
    meta: { hideLayout: true },
  },
  {
    path: '/print/checkout',
    name: 'print-checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { requiresAuth: false, hideLayout: true },
  },
  {
    path: '/print/orders',
    name: 'print-orders',
    component: () => import('@/views/OrdersView.vue'),
    meta: { requiresAuth: true, hideLayout: true },
  },
  {
    path: '/print/orders/:id',
    name: 'print-order-detail',
    component: () => import('@/views/OrderDetailView.vue'),
    meta: { requiresAuth: true, hideLayout: true },
  },
  {
    path: '/print/admin',
    name: 'print-admin',
    component: () => import('@/views/admin/PrintAdminDashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, hideLayout: true },
  },
  {
    path: '/print/admin/orders',
    name: 'print-admin-orders',
    component: () => import('@/views/admin/AdminOrdersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, hideLayout: true },
  },
  {
    path: '/print/admin/queue',
    name: 'print-admin-queue',
    component: () => import('@/views/admin/AdminQueueView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, hideLayout: true },
  },
  {
    path: '/print/admin/settings',
    name: 'print-admin-settings',
    component: () => import('@/views/admin/AdminSettingsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, hideLayout: true },
  },
]
