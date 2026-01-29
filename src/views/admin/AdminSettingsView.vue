<template>
  <div class="admin-settings">
    <h1>Настройки</h1>

    <div class="settings-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Materials Tab -->
    <div v-if="activeTab === 'materials'" class="settings-content">
      <div class="content-header">
        <h2>Материалы</h2>
        <button @click="addMaterial" class="btn btn-primary">+ Добавить</button>
      </div>

      <div class="materials-table">
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Плотность (г/см³)</th>
              <th>Цена (₽/г)</th>
              <th>Цвета</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="material in adminStore.materials" :key="material.id">
              <td>{{ material.name }}</td>
              <td>{{ material.type }}</td>
              <td>{{ material.density }}</td>
              <td>{{ material.price_per_gram }}</td>
              <td>{{ getMaterialColors(material) }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="editMaterial(material)" class="btn-edit">✏️</button>
                  <button @click="deleteMaterial(material.id)" class="btn-delete">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Printers Tab -->
    <div v-if="activeTab === 'printers'" class="settings-content">
      <div class="content-header">
        <h2>Принтеры</h2>
        <button @click="addPrinter" class="btn btn-primary">+ Добавить</button>
      </div>

      <div class="printers-table">
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Область печати (мм)</th>
              <th>Тариф (₽/ч)</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="printer in adminStore.printers" :key="printer.id">
              <td>{{ printer.name }}</td>
              <td>{{ printer.bed_x }} × {{ printer.bed_y }} × {{ printer.bed_z }}</td>
              <td>{{ printer.price_per_hour }}</td>
              <td>
                <UiBadge :variant="printer.status === 'active' ? 'success' : 'default'">
                  {{ printer.status }}
                </UiBadge>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="editPrinter(printer)" class="btn-edit">✏️</button>
                  <button @click="deletePrinter(printer.id)" class="btn-delete">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Feature Flags Tab -->
    <div v-if="activeTab === 'features'" class="settings-content">
      <h2>Модули и функции</h2>
      
      <div class="features-list">
        <div v-for="(flag, key) in printStore.featureFlags" :key="key" class="feature-item">
          <div class="feature-info">
            <h3>{{ getFlagLabel(key) }}</h3>
            <p>{{ getFlagDescription(key) }}</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" :checked="flag" @change="toggleFeature(key)" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { usePrintStore } from '@/stores/print'
import { useRoute } from 'vue-router'
import UiBadge from '@/components/ui/UiBadge.vue'

const adminStore = useAdminStore()
const printStore = usePrintStore()
const route = useRoute()

const activeTab = ref('materials')
const tabs = [
  { id: 'materials', label: 'Материалы' },
  { id: 'printers', label: 'Принтеры' },
  { id: 'features', label: 'Модули' },
]
const allowedTabs = new Set(tabs.map((tab) => tab.id))

function syncTabFromRoute() {
  const nextTab = typeof route.query.tab === 'string' ? route.query.tab : null
  if (nextTab && allowedTabs.has(nextTab)) {
    activeTab.value = nextTab
  }
}

onMounted(async () => {
  syncTabFromRoute()
  await Promise.all([
    adminStore.loadMaterials(),
    adminStore.loadPrinters(),
    printStore.loadFeatureFlags(),
  ])
})

watch(
  () => route.query.tab,
  () => syncTabFromRoute()
)

function getMaterialColors(material: any) {
  try {
    const colors = JSON.parse(material.colors_json || '[]')
    return colors.join(', ')
  } catch {
    return 'N/A'
  }
}

function addMaterial() {
  // TODO: Implement material creation modal
  alert('Добавление материала')
}

function editMaterial(material: any) {
  // TODO: Implement material edit modal
  alert(`Редактирование материала: ${material.name}`)
}

async function deleteMaterial(id: number) {
  if (confirm('Удалить материал?')) {
    await adminStore.deleteMaterial(id)
  }
}

function addPrinter() {
  // TODO: Implement printer creation modal
  alert('Добавление принтера')
}

function editPrinter(printer: any) {
  // TODO: Implement printer edit modal
  alert(`Редактирование принтера: ${printer.name}`)
}

async function deletePrinter(id: number) {
  if (confirm('Удалить принтер?')) {
    await adminStore.deletePrinter(id)
  }
}

function toggleFeature(key: string) {
  // TODO: Implement feature flag toggle
  alert(`Toggle feature: ${key}`)
}

function getFlagLabel(key: string) {
  const labels: Record<string, string> = {
    slicing: 'Слайсер (точный расчет)',
    shipping: 'Доставка',
    payment: 'Онлайн оплата',
    ai: 'AI помощник',
  }
  return labels[key] || key
}

function getFlagDescription(key: string) {
  const descriptions: Record<string, string> = {
    slicing: 'Интеграция с CuraEngine для точного расчета времени и расхода материала',
    shipping: 'Расчет доставки через API Почты России',
    payment: 'Онлайн оплата через ЮKassa',
    ai: 'AI чат-помощник и генерация 3D из 2D',
  }
  return descriptions[key] || ''
}
</script>

<style scoped lang="scss">
.admin-settings {
  padding: var(--spacing-8) 0;
  min-height: 100vh;

  h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-6);
  }
}

.settings-tabs {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-6);
  border-bottom: 2px solid var(--gray-200);

  button {
    padding: var(--spacing-3) var(--spacing-5);
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    color: var(--gray-600);
    border-bottom: 3px solid transparent;
    transition: var(--transition-fast);

    &:hover {
      color: var(--primary-teal);
    }

    &.active {
      color: var(--primary-teal);
      border-bottom-color: var(--primary-teal);
    }
  }
}

.settings-content {
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

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.materials-table,
.printers-table {
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background: var(--gray-100);

      th {
        padding: var(--spacing-3);
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
          padding: var(--spacing-3);
        }
      }
    }
  }
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

.btn {
  padding: var(--spacing-2) var(--spacing-4);
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

.features-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4);
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius-md);

  .feature-info {
    flex: 1;

    h3 {
      font-size: 1.125rem;
      margin-bottom: var(--spacing-1);
    }

    p {
      font-size: 0.875rem;
      color: var(--gray-600);
    }
  }
}

.toggle-switch {
  position: relative;
  width: 60px;
  height: 30px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background: var(--primary-teal);

      &:before {
        transform: translateX(30px);
      }
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gray-300);
    border-radius: 30px;
    transition: var(--transition-fast);

    &:before {
      content: '';
      position: absolute;
      height: 22px;
      width: 22px;
      left: 4px;
      bottom: 4px;
      background: white;
      border-radius: 50%;
      transition: var(--transition-fast);
    }
  }
}
</style>
