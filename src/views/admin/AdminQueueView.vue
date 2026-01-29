<template>
  <div class="admin-queue">
    <h1>Очередь печати</h1>

    <div v-if="adminStore.loading" class="loading">Загрузка...</div>

    <div v-else class="queue-list">
      <div v-for="item in adminStore.queue" :key="item.id" class="queue-card">
        <div class="queue-header">
          <div>
            <h3>Заказ {{ item.order_number }}</h3>
            <p class="queue-model">Модель: {{ item.model_id }}</p>
          </div>
          <UiBadge :variant="getStatusVariant(item.status)">
            {{ getStatusLabel(item.status) }}
          </UiBadge>
        </div>

        <div class="queue-body">
          <div class="queue-info">
            <div class="info-item">
              <span class="label">Принтер:</span>
              <select
                :value="item.printer_id || ''"
                @change="assignPrinter(item.id, $event)"
                class="printer-select"
              >
                <option value="">Не назначен</option>
                <option v-for="printer in adminStore.printers" :key="printer.id" :value="printer.id">
                  {{ printer.name }}
                </option>
              </select>
            </div>
            <div class="info-item">
              <span class="label">Приоритет:</span>
              <input
                type="number"
                :value="item.priority || 0"
                @change="updatePriority(item.id, $event)"
                class="priority-input"
                min="0"
                max="100"
              />
            </div>
            <div v-if="item.scheduled_at" class="info-item">
              <span class="label">Запланировано:</span>
              <span>{{ formatDate(item.scheduled_at) }}</span>
            </div>
          </div>

          <div class="queue-actions">
            <button
              v-if="item.status === 'queued'"
              @click="startPrinting(item.id)"
              class="btn btn-primary"
            >
              Начать печать
            </button>
            <button
              v-if="item.status === 'printing'"
              @click="completePrinting(item.id)"
              class="btn btn-success"
            >
              Завершить
            </button>
            <button @click="removeFromQueue(item.id)" class="btn btn-danger">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import UiBadge from '@/components/ui/UiBadge.vue'

const adminStore = useAdminStore()

onMounted(async () => {
  await Promise.all([adminStore.loadQueue(), adminStore.loadPrinters()])
})

async function assignPrinter(itemId: number, event: Event) {
  const target = event.target as HTMLSelectElement
  const printerId = target.value ? parseInt(target.value) : null
  await adminStore.updateQueueItem(itemId, { printer_id: printerId })
  await adminStore.loadQueue()
}

async function updatePriority(itemId: number, event: Event) {
  const target = event.target as HTMLInputElement
  const priority = parseInt(target.value)
  await adminStore.updateQueueItem(itemId, { priority })
  await adminStore.loadQueue()
}

async function startPrinting(itemId: number) {
  if (confirm('Начать печать этого задания?')) {
    await adminStore.updateQueueItem(itemId, {
      status: 'printing',
      started_at: new Date().toISOString(),
    })
    await adminStore.loadQueue()
  }
}

async function completePrinting(itemId: number) {
  if (confirm('Завершить печать?')) {
    await adminStore.updateQueueItem(itemId, {
      status: 'done',
      finished_at: new Date().toISOString(),
    })
    await adminStore.loadQueue()
  }
}

async function removeFromQueue(itemId: number) {
  if (confirm('Удалить из очереди?')) {
    await adminStore.updateQueueItem(itemId, { status: 'cancelled' })
    await adminStore.loadQueue()
  }
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    queued: 'В очереди',
    assigned: 'Назначено',
    printing: 'Печатается',
    done: 'Готово',
    failed: 'Ошибка',
    cancelled: 'Отменено',
  }
  return labels[status] || status
}

function getStatusVariant(status: string) {
  const variants: Record<string, any> = {
    queued: 'warning',
    assigned: 'info',
    printing: 'info',
    done: 'success',
    failed: 'danger',
    cancelled: 'default',
  }
  return variants[status] || 'default'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped lang="scss">
.admin-queue {
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

.queue-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.queue-card {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-sm);
}

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-4);

  h3 {
    font-size: 1.25rem;
    margin-bottom: var(--spacing-1);
  }

  .queue-model {
    font-size: 0.875rem;
    color: var(--gray-600);
  }
}

.queue-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--gray-200);
}

.queue-info {
  display: flex;
  gap: var(--spacing-6);
  flex: 1;
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);

  .label {
    font-weight: 500;
    color: var(--gray-700);
  }
}

.printer-select,
.priority-input {
  padding: var(--spacing-1) var(--spacing-2);
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
}

.priority-input {
  width: 60px;
}

.queue-actions {
  display: flex;
  gap: var(--spacing-2);
}

.btn {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: var(--transition-fast);
  font-size: 0.875rem;

  &:hover {
    transform: translateY(-1px);
  }
}

.btn-primary {
  background: var(--primary-teal);
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: var(--primary-coral);
  color: white;
}
</style>
