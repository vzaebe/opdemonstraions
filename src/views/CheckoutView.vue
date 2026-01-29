<template>
  <div class="checkout-view">
    <div class="container">
      <h1>Оформление заказа</h1>

      <div class="checkout-layout">
        <!-- Order Summary -->
        <div class="order-summary">
          <h2>Ваш заказ</h2>
          
          <div class="summary-items">
            <div v-for="(quote, index) in calculatorStore.quotes" :key="index" class="summary-item">
              <div class="item-info">
                <h3>Модель {{ quote.model_id }}</h3>
                <p>Количество: {{ quote.quantity }} шт.</p>
                <p class="item-details">
                  {{ getMaterialName(quote.material_id) }}, {{ getProfileName(quote.profile_id) }}
                </p>
              </div>
              <div class="item-price">{{ quote.estimate.total.toFixed(2) }} ₽</div>
            </div>
          </div>

          <div class="summary-total">
            <div class="total-row">
              <span>Подытог:</span>
              <strong>{{ calculatorStore.totalCost.toFixed(2) }} ₽</strong>
            </div>
            <div class="total-row">
              <span>Доставка:</span>
              <strong>{{ shippingCost.toFixed(2) }} ₽</strong>
            </div>
            <div class="total-row grand-total">
              <span>Итого:</span>
              <strong>{{ grandTotal.toFixed(2) }} ₽</strong>
            </div>
          </div>
        </div>

        <!-- Checkout Form -->
        <div class="checkout-form">
          <section class="form-section">
            <h3>Контактная информация</h3>
            <div class="form-group">
              <label>Email *</label>
              <input v-model="form.email" type="email" required placeholder="your@email.com" />
            </div>
            <div class="form-group">
              <label>Телефон *</label>
              <input v-model="form.phone" type="tel" required placeholder="+7 (xxx) xxx-xx-xx" />
            </div>
            <div class="form-group">
              <label>Имя</label>
              <input v-model="form.name" type="text" placeholder="Ваше имя" />
            </div>
          </section>

          <section class="form-section">
            <h3>Доставка</h3>
            <div class="form-group">
              <label>Способ доставки *</label>
              <select v-model="form.shipping_method_id" @change="calculateShipping">
                <option value="1">Самовывоз (бесплатно)</option>
                <option value="2">Курьерская доставка (Москва)</option>
                <option value="3">Почта России</option>
              </select>
            </div>
            <div v-if="form.shipping_method_id !== '1'" class="form-group">
              <label>Адрес доставки *</label>
              <textarea v-model="form.address" rows="3" placeholder="Город, улица, дом, квартира"></textarea>
            </div>
          </section>

          <section class="form-section">
            <h3>Оплата</h3>
            <div class="payment-options">
              <label class="payment-option">
                <input type="radio" v-model="form.payment_method" value="upon_receipt" />
                <span>Оплата при получении</span>
              </label>
              <label class="payment-option">
                <input type="radio" v-model="form.payment_method" value="online" />
                <span>Онлайн оплата (ЮKassa)</span>
              </label>
            </div>
          </section>

          <div class="form-actions">
            <button class="btn btn-secondary" @click="goBack">Назад</button>
            <button class="btn btn-primary btn-lg" @click="submitOrder" :disabled="ordersStore.loading">
              {{ ordersStore.loading ? 'Оформление...' : 'Оформить заказ' }}
            </button>
          </div>

          <div v-if="ordersStore.error" class="form-error">{{ ordersStore.error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCalculatorStore } from '@/stores/calculator'
import { useOrdersStore } from '@/stores/orders'
import { logError } from '@/services/logger'

const router = useRouter()
const calculatorStore = useCalculatorStore()
const ordersStore = useOrdersStore()

const form = ref({
  email: '',
  phone: '',
  name: '',
  shipping_method_id: '1',
  address: '',
  payment_method: 'upon_receipt',
})

const shippingCost = ref(0)

const grandTotal = computed(() => {
  return calculatorStore.totalCost + shippingCost.value
})

function getMaterialName(id: number) {
  return calculatorStore.materials.find((m) => m.id === id)?.name || 'Material'
}

function getProfileName(id: number) {
  return calculatorStore.profiles.find((p) => p.id === id)?.name || 'Profile'
}

function calculateShipping() {
  if (form.value.shipping_method_id === '1') {
    shippingCost.value = 0
  } else if (form.value.shipping_method_id === '2') {
    shippingCost.value = 500
  } else {
    shippingCost.value = 300
  }
}

async function submitOrder() {
  if (!form.value.email || !form.value.phone) {
    alert('Заполните обязательные поля')
    return
  }

  if (form.value.shipping_method_id !== '1' && !form.value.address) {
    alert('Укажите адрес доставки')
    return
  }

  try {
    const orderData = {
      items: calculatorStore.quotes.map((q) => ({
        model_id: q.model_id,
        quantity: q.quantity,
        material_id: q.material_id,
        profile_id: q.profile_id,
        infill: q.infill,
        supports: q.supports,
        price: q.estimate.total,
      })),
      contact: {
        email: form.value.email,
        phone: form.value.phone,
        name: form.value.name,
      },
      shipping: {
        method_id: parseInt(form.value.shipping_method_id),
        address: form.value.address,
        cost: shippingCost.value,
      },
      payment: {
        method: form.value.payment_method,
      },
    }

    const result = await ordersStore.createOrder(orderData)
    
    // Clear calculator
    calculatorStore.clearAll()
    
    // Redirect to order detail
    router.push({ name: 'print-order-detail', params: { id: result.order_id } })
  } catch (error) {
    logError('checkout', 'Order creation failed', { error })
  }
}

function goBack() {
  router.push({ name: 'print-calculator' })
}
</script>

<style scoped lang="scss">
.checkout-view {
  padding: var(--spacing-8) 0;
  min-height: 100vh;

  h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-6);
  }
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-6);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
}

.order-summary {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  height: fit-content;
  position: sticky;
  top: var(--spacing-6);

  h2 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-4);
  }
}

.summary-items {
  margin-bottom: var(--spacing-4);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--gray-200);

  .item-info h3 {
    font-size: 1rem;
    margin-bottom: var(--spacing-1);
  }

  .item-details {
    font-size: 0.875rem;
    color: var(--gray-600);
  }

  .item-price {
    font-weight: 600;
    color: var(--primary-teal);
  }
}

.summary-total {
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

    strong {
      color: var(--primary-teal);
    }
  }
}

.checkout-form {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
}

.form-section {
  margin-bottom: var(--spacing-6);

  h3 {
    font-size: 1.25rem;
    margin-bottom: var(--spacing-4);
    color: var(--primary-teal);
  }
}

.form-group {
  margin-bottom: var(--spacing-4);

  label {
    display: block;
    font-weight: 500;
    margin-bottom: var(--spacing-2);
    color: var(--gray-700);
  }

  input,
  select,
  textarea {
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

.payment-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.payment-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  border: 2px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: var(--transition-fast);

  &:has(input:checked) {
    border-color: var(--primary-teal);
    background: #f0f9ff;
  }

  input[type='radio'] {
    width: 20px;
    height: 20px;
  }

  span {
    font-weight: 500;
  }
}

.form-actions {
  display: flex;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

.btn {
  flex: 1;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: var(--transition-fast);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: var(--primary-teal);
  color: white;

  &:hover:not(:disabled) {
    background: #138496;
    transform: translateY(-2px);
  }
}

.btn-secondary {
  background: var(--gray-300);
  color: var(--gray-700);

  &:hover {
    background: var(--gray-400);
  }
}

.btn-lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: 1.125rem;
}

.form-error {
  margin-top: var(--spacing-4);
  padding: var(--spacing-3);
  background: #fee;
  color: #c33;
  border-radius: var(--border-radius-md);
}
</style>
