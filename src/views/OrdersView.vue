<template>
  <div class="orders-view">
    <div class="container">
      <h1>Мои заказы</h1>

      <div v-if="ordersStore.loading" class="loading">Загрузка заказов...</div>

      <div v-else-if="ordersStore.orders.length === 0" class="empty-state">
        <p>У вас пока нет заказов</p>
        <button class="btn btn-primary" @click="goToCalculator">Создать заказ</button>
      </div>

      <div v-else class="orders-list">
        <div
          v-for="order in ordersStore.orders"
          :key="order.id"
          class="order-card"
          @click="goToOrder(order.id)"
        >
          <div class="order-header">
            <div>
              <h3>Заказ {{ order.order_number }}</h3>
              <p class="order-date">{{ formatDate(order.created_at) }}</p>
            </div>
            <UiBadge :variant="getStatusVariant(order.status)">
              {{ getStatusLabel(order.status) }}
            </UiBadge>
          </div>

          <div class="order-body">
            <div class="order-items">
              <p>
                <strong>{{ order.items?.length || 0 }}</strong> {{ pluralize(order.items?.length || 0, 'модель', 'модели', 'моделей') }}
              </p>
            </div>
            <div class="order-total">
              <span class="label">Итого:</span>
              <span class="value">{{ order.totals?.grand_total?.toFixed(2) || '0.00' }} ₽</span>
            </div>
          </div>

          <div v-if="order.tracking_number" class="order-tracking">
            <span>Трек-номер: {{ order.tracking_number }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import UiBadge from '@/components/ui/UiBadge.vue'

const router = useRouter()
const ordersStore = useOrdersStore()

onMounted(async () => {
  await ordersStore.loadMyOrders()
})

function goToCalculator() {
  router.push({ name: 'print-calculator' })
}

function goToOrder(orderId: number) {
  router.push({ name: 'print-order-detail', params: { id: orderId } })
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Ожидает',
    confirmed: 'Подтвержден',
    in_production: 'В производстве',
    ready: 'Готов',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
  }
  return labels[status] || status
}

function getStatusVariant(status: string) {
  const variants: Record<string, any> = {
    pending: 'warning',
    confirmed: 'info',
    in_production: 'info',
    ready: 'success',
    shipped: 'success',
    delivered: 'success',
    cancelled: 'danger',
  }
  return variants[status] || 'default'
}

function pluralize(count: number, one: string, few: string, many: string) {
  if (count % 10 === 1 && count % 100 !== 11) return one
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return few
  return many
}
</script>

<style scoped lang="scss">
.orders-view {
  padding: var(--spacing-8) 0;
  min-height: 100vh;

  h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-6);
  }
}

.loading,
.empty-state {
  text-align: center;
  padding: var(--spacing-10);
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  p {
    font-size: 1.125rem;
    color: var(--gray-600);
    margin-bottom: var(--spacing-4);
  }
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.order-card {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: var(--transition-fast);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-4);

  h3 {
    font-size: 1.25rem;
    margin-bottom: var(--spacing-1);
  }

  .order-date {
    font-size: 0.875rem;
    color: var(--gray-600);
  }
}

.order-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3) 0;
  border-top: 1px solid var(--gray-200);
  border-bottom: 1px solid var(--gray-200);
}

.order-items {
  font-size: 0.875rem;
  color: var(--gray-700);
}

.order-total {
  .label {
    font-size: 0.875rem;
    color: var(--gray-600);
    margin-right: var(--spacing-2);
  }

  .value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-teal);
  }
}

.order-tracking {
  margin-top: var(--spacing-3);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--gray-100);
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  color: var(--gray-700);
}

.btn {
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: var(--transition-fast);
}

.btn-primary {
  background: var(--primary-teal);
  color: white;

  &:hover {
    background: #138496;
  }
}
</style>
