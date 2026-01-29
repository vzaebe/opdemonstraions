<template>
  <div class="admin-orders">
    <div class="page-header">
      <h1>Управление заказами</h1>
      <div class="filters">
        <select v-model="statusFilter" @change="loadOrders">
          <option value="">Все статусы</option>
          <option value="pending">Ожидает</option>
          <option value="confirmed">Подтвержден</option>
          <option value="in_production">В производстве</option>
          <option value="ready">Готов</option>
          <option value="shipped">Отправлен</option>
          <option value="delivered">Доставлен</option>
          <option value="cancelled">Отменен</option>
        </select>
      </div>
    </div>

    <div v-if="adminStore.loading" class="loading">Загрузка...</div>

    <div v-else class="orders-table">
      <table>
        <thead>
          <tr>
            <th>№ Заказа</th>
            <th>Email</th>
            <th>Дата</th>
            <th>Статус</th>
            <th>Сумма</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in adminStore.orders" :key="order.id">
            <td>{{ order.order_number }}</td>
            <td>{{ order.guest_email || 'N/A' }}</td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td>
              <select
                :value="order.status"
                @change="updateStatus(order.id, $event)"
                class="status-select"
              >
                <option value="pending">Ожидает</option>
                <option value="confirmed">Подтвержден</option>
                <option value="in_production">В производстве</option>
                <option value="ready">Готов</option>
                <option value="shipped">Отправлен</option>
                <option value="delivered">Доставлен</option>
                <option value="cancelled">Отменен</option>
              </select>
            </td>
            <td>{{ order.totals_json ? JSON.parse(order.totals_json).grand_total.toFixed(2) : '0.00' }} ₽</td>
            <td>
              <div class="action-buttons">
                <button @click="viewOrder(order.id)" class="btn-view">👁️</button>
                <button @click="editOrder(order.id)" class="btn-edit">✏️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()
const statusFilter = ref('')

onMounted(async () => {
  await loadOrders()
})

async function loadOrders() {
  const params = statusFilter.value ? { status: statusFilter.value } : {}
  await adminStore.loadOrders(params)
}

async function updateStatus(orderId: number, event: Event) {
  const target = event.target as HTMLSelectElement
  const newStatus = target.value
  
  if (confirm(`Изменить статус заказа на "${newStatus}"?`)) {
    await adminStore.updateOrder(orderId, { status: newStatus })
    await loadOrders()
  }
}

function viewOrder(orderId: number) {
  router.push({ name: 'print-order-detail', params: { id: orderId } })
}

function editOrder(orderId: number) {
  // TODO: Implement edit modal
  alert(`Редактирование заказа ${orderId}`)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped lang="scss">
.admin-orders {
  padding: var(--spacing-8) 0;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);

  h1 {
    font-size: 2.5rem;
  }
}

.filters {
  select {
    padding: var(--spacing-2) var(--spacing-4);
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius-md);
    font-size: 1rem;
  }
}

.loading {
  text-align: center;
  padding: var(--spacing-10);
}

.orders-table {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background: var(--gray-100);

      th {
        padding: var(--spacing-4);
        text-align: left;
        font-weight: 600;
        color: var(--gray-700);
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid var(--gray-200);

        &:hover {
          background: var(--gray-50);
        }

        td {
          padding: var(--spacing-4);
        }
      }
    }
  }
}

.status-select {
  padding: var(--spacing-1) var(--spacing-2);
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-2);

  button {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: var(--spacing-1);

    &:hover {
      transform: scale(1.2);
    }
  }
}
</style>
