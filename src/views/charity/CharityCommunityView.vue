<template>
  <div class="charity-community">
    <UiSection>
      <div class="header">
        <h1 class="page-title">Сообщество мейкеров</h1>
        <p class="page-subtitle">
          Наши герои — люди и компании, которые безвозмездно печатают изделия на своих 3D-принтерах.
        </p>
        <ButtonPrimary @click="showJoinForm = !showJoinForm">
          {{ showJoinForm ? 'Скрыть форму' : 'Стать участником' }}
        </ButtonPrimary>
      </div>

      <!-- Simple Join Form -->
      <div v-if="showJoinForm" class="join-form-container">
        <form @submit.prevent="handleJoin" class="join-form">
          <h3>Анкета волонтера</h3>
          <div class="form-row">
            <input v-model="form.name" placeholder="Ваше имя / Название компании" required class="input" />
            <select v-model="form.type" class="input">
              <option value="individual">Частное лицо</option>
              <option value="company">Компания</option>
            </select>
          </div>
          <div class="form-row">
            <input v-model="form.city" placeholder="Город" required class="input" />
            <input v-model="form.printer_model" placeholder="Модель принтера" required class="input" />
          </div>
          <ButtonPrimary type="submit" size="sm">Отправить</ButtonPrimary>
        </form>
      </div>

      <div class="partners-grid">
        <PartnerCard
          v-for="partner in store.partners"
          :key="partner.id"
          :name="partner.name"
          :type="partner.type"
          :printer-model="partner.printer_model"
          :capabilities="partner.capabilities"
          :completed-works="partner.completed_works"
          :city="partner.city"
        />
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import PartnerCard from '@/components/charity/PartnerCard.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const store = useCharityStore()
const showJoinForm = ref(false)

const form = reactive({
  name: '',
  type: 'individual',
  city: '',
  printer_model: '',
  capabilities: ['PLA']
})

const handleJoin = () => {
  store.addPartner({ ...form })
  showJoinForm.value = false
  alert('Спасибо! Вы добавлены в список партнёров.')
  form.name = ''
  form.city = ''
  form.printer_model = ''
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.header {
  text-align: center;
  margin-bottom: $spacing-10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-4;
}

.page-title {
  font-size: $text-3xl;
  color: $gray-900;
  margin: 0;
}

.page-subtitle {
  color: $gray-600;
  max-width: 600px;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-6;
}

.join-form-container {
  background: $gray-50;
  padding: $spacing-6;
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-8;
  animation: slide-down 0.3s ease;
}

.join-form {
  max-width: 600px;
  margin: 0 auto;
  
  h3 {
    margin-bottom: $spacing-4;
    text-align: center;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-4;
  margin-bottom: $spacing-4;
  
  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid $gray-300;
  border-radius: $border-radius-md;
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>




