<template>
  <div class="order-detail-view">
    <div class="container">
      <div v-if="ordersStore.loading" class="loading">Загрузка заказа...</div>

      <div v-else-if="order" class="order-detail">
        <div class="detail-header">
          <div>
            <h1>Заказ {{ order.order_number }}</h1>
            <p class="order-date">{{ formatDate(order.created_at) }}</p>
          </div>
          <UiBadge :variant="getStatusVariant(order.status)" size="lg">
            {{ getStatusLabel(order.status) }}
          </UiBadge>
        </div>

        <div class="detail-grid">
          <!-- Order Items -->
          <section class="detail-section">
            <h2>Состав заказа</h2>
            <div class="items-list">
              <div v-for="(item, index) in order.items" :key="index" class="item-card">
                <div class="item-info">
                  <h3>Модель {{ item.model_id }}</h3>
                  <p>Количество: {{ item.quantity }} шт.</p>
                  <p class="item-params">
                    {{ item.material }}, {{ item.quality }}, заполнение {{ item.infill }}%
                  </p>
                </div>
                <div class="item-price">{{ item.price?.toFixed(2) || '0.00' }} ₽</div>
              </div>
            </div>

            <div class="totals">
              <div class="total-row">
                <span>Подытог:</span>
                <span>{{ order.totals?.subtotal?.toFixed(2) || '0.00' }} ₽</span>
              </div>
              <div class="total-row">
                <span>Доставка:</span>
                <span>{{ order.totals?.shipping_cost?.toFixed(2) || '0.00' }} ₽</span>
              </div>
              <div class="total-row grand-total">
                <strong>Итого:</strong>
                <strong>{{ order.totals?.grand_total?.toFixed(2) || '0.00' }} ₽</strong>
              </div>
            </div>
          </section>

          <!-- Contact & Shipping -->
          <section class="detail-section">
            <h2>Информация о доставке</h2>
            <div class="info-block">
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span>{{ order.guest_email || 'N/A' }}</span>
              </div>
              <div v-if="order.shipping" class="info-row">
                <span class="info-label">Адрес:</span>
                <span>{{ order.shipping.address || 'Самовывоз' }}</span>
              </div>
              <div v-if="order.tracking_number" class="info-row">
                <span class="info-label">Трек-номер:</span>
                <span class="tracking-number">{{ order.tracking_number }}</span>
              </div>
            </div>

            <h2 style="margin-top: var(--spacing-6)">История статусов</h2>
            <div class="status-timeline">
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <strong>{{ getStatusLabel(order.status) }}</strong>
                  <p>{{ formatDate(order.updated_at) }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Messages -->
        <section class="detail-section messages-section">
          <h2>Комментарии и сообщения</h2>
          
          <div class="messages-list">
            <div v-for="message in ordersStore.messages" :key="message.id" class="message-card">
              <div class="message-header">
                <strong>{{ message.author_name }}</strong>
                <span class="message-date">{{ formatDate(message.created_at) }}</span>
              </div>
              <p class="message-text">{{ message.message }}</p>
            </div>
          </div>

          <div class="message-form">
            <textarea
              v-model="newMessage"
              rows="3"
              placeholder="Напишите сообщение..."
            ></textarea>
            <button class="btn btn-primary" @click="sendMessage">Отправить</button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import UiBadge from '@/components/ui/UiBadge.vue'

const route = useRoute()
const ordersStore = useOrdersStore()
const newMessage = ref('')

const order = computed(() => ordersStore.currentOrder)

onMounted(async () => {
  const orderId = parseInt(route.params.id as string)
  await Promise.all([
    ordersStore.loadOrder(orderId),
    ordersStore.loadMessages(orderId),
  ])
})

async function sendMessage() {
  if (!newMessage.value.trim()) return
  
  const orderId = parseInt(route.params.id as string)
  await ordersStore.addMessage(orderId, newMessage.value)
  newMessage.value = ''
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
    pending: 'Ожидает подтверждения',
    confirmed: 'Подтвержден',
    in_production: 'В производстве',
    ready: 'Готов к отправке',
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
</script>

<style scoped lang="scss">
.order-detail-view {
  padding: var(--spacing-8) 0;
  min-height: 100vh;
}

.loading {
  text-align: center;
  padding: var(--spacing-10);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-6);

  h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-2);
  }

  .order-date {
    color: var(--gray-600);
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-6);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
}

.detail-section {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);

  h2 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-4);
    color: var(--primary-teal);
  }
}

.items-list {
  margin-bottom: var(--spacing-4);
}

.item-card {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--gray-200);

  &:last-child {
    border-bottom: none;
  }

  .item-info h3 {
    font-size: 1rem;
    margin-bottom: var(--spacing-1);
  }

  .item-params {
    font-size: 0.875rem;
    color: var(--gray-600);
  }

  .item-price {
    font-weight: 600;
    color: var(--primary-teal);
  }
}

.totals {
  padding-top: var(--spacing-4);
  border-top: 2px solid var(--gray-300);
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-2) 0;

  &.grand-total {
    font-size: 1.25rem;
    padding-top: var(--spacing-3);
    border-top: 1px solid var(--gray-300);
    margin-top: var(--spacing-2);
    color: var(--primary-teal);
  }
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.info-row {
  display: flex;
  gap: var(--spacing-3);

  .info-label {
    font-weight: 600;
    min-width: 100px;
    color: var(--gray-700);
  }
}

.tracking-number {
  font-family: monospace;
  background: var(--gray-100);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
}

.status-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.timeline-item {
  display: flex;
  gap: var(--spacing-3);
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary-teal);
  margin-top: 6px;
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;

  strong {
    display: block;
    margin-bottom: var(--spacing-1);
  }

  p {
    font-size: 0.875rem;
    color: var(--gray-600);
  }
}

.messages-section {
  grid-column: 1 / -1;
}

.messages-list {
  margin-bottom: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.message-card {
  padding: var(--spacing-4);
  background: var(--gray-100);
  border-radius: var(--border-radius-md);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-2);

  strong {
    color: var(--primary-teal);
  }

  .message-date {
    font-size: 0.875rem;
    color: var(--gray-600);
  }
}

.message-text {
  color: var(--gray-700);
}

.message-form {
  display: flex;
  gap: var(--spacing-3);
  align-items: flex-end;

  textarea {
    flex: 1;
    padding: var(--spacing-3);
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius-md);
    font-size: 1rem;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: var(--primary-teal);
    }
  }

  .btn {
    padding: var(--spacing-3) var(--spacing-6);
    border-radius: var(--border-radius-md);
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: var(--primary-teal);
    color: white;
    transition: var(--transition-fast);

    &:hover {
      background: #138496;
    }
  }
}
</style>
