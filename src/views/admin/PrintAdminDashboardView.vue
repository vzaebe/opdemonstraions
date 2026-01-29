<template>
  <div class="admin-dashboard">
    <h1>Панель администратора</h1>

    <div v-if="adminStore.loading" class="loading">Загрузка...</div>

    <div v-else-if="adminStore.stats" class="dashboard-content">
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-value">{{ adminStore.stats.orders_today }}</div>
            <div class="stat-label">Заказов сегодня</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ adminStore.stats.orders_week }}</div>
            <div class="stat-label">Заказов за неделю</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-value">{{ adminStore.stats.revenue_today.toFixed(0) }} ₽</div>
            <div class="stat-label">Выручка сегодня</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💵</div>
          <div class="stat-content">
            <div class="stat-value">{{ adminStore.stats.revenue_week.toFixed(0) }} ₽</div>
            <div class="stat-label">Выручка за неделю</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-value">{{ adminStore.stats.queue_pending }}</div>
            <div class="stat-label">В очереди</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🖨️</div>
          <div class="stat-content">
            <div class="stat-value">{{ adminStore.stats.queue_printing }}</div>
            <div class="stat-label">Печатается</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Быстрые действия</h2>
        <div class="actions-grid">
          <router-link to="/print/admin/orders" class="action-card">
            <span class="action-icon">📋</span>
            <span class="action-label">Управление заказами</span>
          </router-link>
          <router-link to="/print/admin/queue" class="action-card">
            <span class="action-icon">🔄</span>
            <span class="action-label">Очередь печати</span>
          </router-link>
          <router-link :to="{ name: 'print-admin-settings', query: { tab: 'materials' } }" class="action-card">
            <span class="action-icon">🧱</span>
            <span class="action-label">Материалы</span>
          </router-link>
          <router-link :to="{ name: 'print-admin-settings', query: { tab: 'printers' } }" class="action-card">
            <span class="action-icon">🖨️</span>
            <span class="action-label">Принтеры</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

onMounted(async () => {
  await adminStore.loadDashboard()
})
</script>

<style scoped lang="scss">
.admin-dashboard {
  padding: var(--spacing-8) 0;
  min-height: 100vh;

  h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-6);
  }
}

.loading {
  text-align: center;
  padding: var(--spacing-10);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
}

.stat-card {
  display: flex;
  gap: var(--spacing-4);
  background: white;
  padding: var(--spacing-5);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

.stat-icon {
  font-size: 3rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-teal);
  margin-bottom: var(--spacing-1);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.quick-actions {
  background: white;
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  h2 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-4);
    color: var(--primary-teal);
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  background: var(--gray-100);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: var(--gray-900);
  transition: var(--transition-fast);

  &:hover {
    background: var(--primary-teal);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .action-icon {
    font-size: 2.5rem;
  }

  .action-label {
    font-weight: 600;
    text-align: center;
  }
}
</style>
