<template>
  <div class="calculator-view">
    <div class="container">
      <h1>Калькулятор 3D-печати</h1>
      
      <!-- Step 1: Upload -->
      <section class="calc-section">
        <h2>1. Загрузите модели</h2>
        <UiFileUpload @upload="handleUpload" />
      </section>

      <!-- Step 2: Models List -->
      <section v-if="calculatorStore.models.length > 0" class="calc-section">
        <h2>2. Ваши модели ({{ calculatorStore.models.length }})</h2>
        
        <div class="models-grid">
          <div
            v-for="model in calculatorStore.models"
            :key="model.id"
            class="model-card"
            :class="{ active: selectedModelId === model.id }"
            @click="selectModel(model.id)"
          >
            <div class="model-preview">
              <!-- Placeholder for 3D thumbnail -->
              <div class="preview-placeholder">📦</div>
            </div>
            
            <div class="model-info">
              <h3>{{ model.filename || `Model ${model.id}` }}</h3>
              <div class="model-dimensions">
                {{ model.bbox_x.toFixed(1) }} × {{ model.bbox_y.toFixed(1) }} × {{ model.bbox_z.toFixed(1) }} мм
              </div>
              <div class="model-volume">
                Объем: {{ (model.volume / 1000).toFixed(2) }} см³
              </div>
              
              <div class="model-quantity">
                <label>Количество:</label>
                <input
                  type="number"
                  :value="model.quantity || 1"
                  min="1"
                  max="100"
                  @input="updateQuantity(model.id, $event)"
                />
              </div>
            </div>
            
            <button class="btn-remove" @click.stop="calculatorStore.removeModel(model.id)">
              ×
            </button>
          </div>
        </div>
      </section>

      <!-- Step 3: Parameters -->
      <section v-if="selectedModelId" class="calc-section">
        <h2>3. Параметры печати</h2>
        
        <div class="params-layout">
          <div class="params-form">
            <div class="form-group">
              <label>Материал</label>
              <select v-model="params.material_id" @change="recalculate">
                <option v-for="material in calculatorStore.materials" :key="material.id" :value="material.id">
                  {{ material.name }} ({{ material.price_per_gram }}₽/г)
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Цвет</label>
              <select v-model="params.color" @change="recalculate">
                <option v-for="color in selectedMaterialColors" :key="color" :value="color">
                  {{ color }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Качество печати</label>
              <select v-model="params.profile_id" @change="recalculate">
                <option v-for="profile in calculatorStore.profiles" :key="profile.id" :value="profile.id">
                  {{ profile.name }} ({{ profile.layer_height }}мм)
                </option>
              </select>
            </div>

            <div class="form-group">
              <UiSlider
                v-model="params.infill"
                :min="10"
                :max="100"
                :step="5"
                label="Заполнение"
                suffix="%"
                @update:model-value="recalculate"
              />
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="params.supports" @change="recalculate" />
                <span>Поддержки</span>
              </label>
            </div>
          </div>

          <div class="viewer-panel">
            <ModelViewer3D :model-url="`/api/v1/files/${selectedModel?.file_id}`" />
          </div>
        </div>
      </section>

      <!-- Step 4: Quote -->
      <section v-if="currentQuote" class="calc-section quote-section">
        <h2>4. Расчет стоимости</h2>
        
        <div class="quote-card">
          <div class="quote-main">
            <div class="quote-total">
              <div class="label">Итого:</div>
              <div class="value">{{ currentQuote.estimate.total.toFixed(2) }} ₽</div>
            </div>
            <div class="quote-days">
              <div class="label">Срок:</div>
              <div class="value">{{ currentQuote.estimate.estimated_days }} дн.</div>
            </div>
          </div>

          <div class="quote-breakdown">
            <h3>Детализация:</h3>
            <div class="breakdown-item">
              <span>Материал:</span>
              <span>{{ currentQuote.estimate.material_cost.toFixed(2) }} ₽</span>
            </div>
            <div class="breakdown-item">
              <span>Машинное время:</span>
              <span>{{ currentQuote.estimate.machine_time_cost.toFixed(2) }} ₽</span>
            </div>
            <div class="breakdown-item">
              <span>Труд:</span>
              <span>{{ currentQuote.estimate.labor_cost.toFixed(2) }} ₽</span>
            </div>
            <div v-if="currentQuote.estimate.postprocess_cost > 0" class="breakdown-item">
              <span>Постобработка:</span>
              <span>{{ currentQuote.estimate.postprocess_cost.toFixed(2) }} ₽</span>
            </div>
            <div class="breakdown-item">
              <span>Маржа (20%):</span>
              <span>{{ currentQuote.estimate.margin.toFixed(2) }} ₽</span>
            </div>
          </div>

          <button class="btn btn-primary btn-lg" @click="goToCheckout">
            Оформить заказ
          </button>
        </div>
      </section>

      <!-- Total Summary -->
      <section v-if="calculatorStore.quotes.length > 1" class="calc-section">
        <div class="total-summary">
          <h3>Всего моделей: {{ calculatorStore.models.length }}</h3>
          <div class="summary-row">
            <span>Общая стоимость:</span>
            <strong>{{ calculatorStore.totalCost.toFixed(2) }} ₽</strong>
          </div>
          <div class="summary-row">
            <span>Максимальный срок:</span>
            <strong>{{ calculatorStore.totalDays }} дн.</strong>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCalculatorStore } from '@/stores/calculator'
import UiFileUpload from '@/components/ui/UiFileUpload.vue'
import UiSlider from '@/components/ui/UiSlider.vue'
import ModelViewer3D from '@/components/ModelViewer3D.vue'

const router = useRouter()
const calculatorStore = useCalculatorStore()

const selectedModelId = ref<number | null>(null)
const params = ref({
  material_id: 1,
  color: 'Белый',
  profile_id: 2,
  infill: 20,
  supports: false,
})

const selectedModel = computed(() => {
  return calculatorStore.models.find((m) => m.id === selectedModelId.value)
})

const selectedMaterialColors = computed(() => {
  const material = calculatorStore.materials.find((m) => m.id === params.value.material_id)
  return material?.colors || ['Белый']
})

const currentQuote = computed(() => {
  return calculatorStore.quotes.find((q) => q.model_id === selectedModelId.value)
})

onMounted(async () => {
  await Promise.all([calculatorStore.loadMaterials(), calculatorStore.loadProfiles()])
})

async function handleUpload(files: File[]) {
  const models = await calculatorStore.uploadFiles(files)
  if (models.length > 0 && !selectedModelId.value) {
    selectModel(models[0].id)
  }
}

function selectModel(modelId: number) {
  selectedModelId.value = modelId
  recalculate()
}

function updateQuantity(modelId: number, event: Event) {
  const target = event.target as HTMLInputElement
  const quantity = parseInt(target.value)
  calculatorStore.updateModelQuantity(modelId, quantity)
  if (modelId === selectedModelId.value) {
    recalculate()
  }
}

async function recalculate() {
  if (!selectedModelId.value) return
  
  const model = selectedModel.value
  if (!model) return

  await calculatorStore.calculateQuote({
    model_id: selectedModelId.value,
    quantity: model.quantity || 1,
    ...params.value,
  })
}

function goToCheckout() {
  router.push({ name: 'print-checkout' })
}
</script>

<style scoped lang="scss">
.calculator-view {
  padding: var(--spacing-8) 0;
  min-height: 100vh;

  h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-6);
    color: var(--gray-900);
  }
}

.calc-section {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
  box-shadow: var(--shadow-sm);

  h2 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-4);
    color: var(--primary-teal);
  }
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-4);
}

.model-card {
  position: relative;
  border: 2px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-4);
  cursor: pointer;
  transition: var(--transition-fast);

  &:hover {
    border-color: var(--primary-teal);
    box-shadow: var(--shadow-md);
  }

  &.active {
    border-color: var(--primary-teal);
    background: #f0f9ff;
  }

  .btn-remove {
    position: absolute;
    top: var(--spacing-2);
    right: var(--spacing-2);
    background: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: var(--primary-coral);
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    box-shadow: var(--shadow-sm);

    &:hover {
      background: #fee;
    }
  }
}

.model-preview {
  margin-bottom: var(--spacing-3);
}

.preview-placeholder {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border-radius: var(--border-radius-md);
  font-size: 3rem;
}

.model-info {
  h3 {
    font-size: 1rem;
    margin-bottom: var(--spacing-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .model-dimensions,
  .model-volume {
    font-size: 0.875rem;
    color: var(--gray-600);
    margin-bottom: var(--spacing-1);
  }
}

.model-quantity {
  margin-top: var(--spacing-3);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);

  label {
    font-size: 0.875rem;
    font-weight: 500;
  }

  input {
    width: 60px;
    padding: var(--spacing-1) var(--spacing-2);
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius-sm);
  }
}

.params-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-6);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
}

.params-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-group {
  label {
    display: block;
    font-weight: 500;
    margin-bottom: var(--spacing-2);
    color: var(--gray-700);
  }

  select,
  input[type='number'] {
    width: 100%;
    padding: var(--spacing-3);
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius-md);
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--primary-teal);
    }
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;

  input[type='checkbox'] {
    width: 20px;
    height: 20px;
  }
}

.viewer-panel {
  height: 500px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.quote-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  h2 {
    color: white;
  }
}

.quote-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  color: var(--gray-900);
}

.quote-main {
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-6);
  border-bottom: 2px solid var(--gray-300);
}

.quote-total,
.quote-days {
  text-align: center;

  .label {
    font-size: 0.875rem;
    color: var(--gray-600);
    margin-bottom: var(--spacing-2);
  }

  .value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-teal);
  }
}

.quote-breakdown {
  margin-bottom: var(--spacing-6);

  h3 {
    font-size: 1.125rem;
    margin-bottom: var(--spacing-3);
  }
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-2) 0;
  border-bottom: 1px solid var(--gray-200);

  &:last-child {
    border-bottom: none;
  }
}

.total-summary {
  background: white;
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);

  h3 {
    margin-bottom: var(--spacing-4);
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-3) 0;
    font-size: 1.125rem;
  }
}

.btn {
  display: inline-block;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: var(--transition-fast);
  width: 100%;
}

.btn-primary {
  background: var(--primary-teal);
  color: white;

  &:hover {
    background: #138496;
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

.btn-lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: 1.125rem;
}
</style>
