<template>
  <div class="charity-help">
    <UiSection>
      <h1 class="page-title">Помочь проекту</h1>
      <p class="page-subtitle">
        Проект существует благодаря поддержке неравнодушных людей. 
        Вы можете выбрать удобный для вас способ помощи.
      </p>

      <!-- Navigation Tabs for Help Types -->
      <div class="help-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Volunteer Form -->
      <div v-if="activeTab === 'volunteer'" class="help-content fade-in">
        <div class="form-container">
          <h2>Стать волонтёром</h2>
          <p class="form-desc">Присоединяйтесь к нашему сообществу мейкеров. Если у вас есть 3D-принтер, вы можете печатать заказы для детей.</p>
          
          <form @submit.prevent="handleVolunteerSubmit" class="help-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Ваше имя / Название организации</label>
                <input v-model="volunteerForm.name" required class="input-std" />
              </div>
              <div class="form-group">
                <label>Тип участника</label>
                <select v-model="volunteerForm.type" class="input-std">
                  <option value="individual">Частное лицо</option>
                  <option value="company">Компания</option>
                </select>
              </div>
              <div class="form-group">
                <label>Город</label>
                <input v-model="volunteerForm.city" required class="input-std" />
              </div>
              <div class="form-group">
                <label>Модель(и) принтера</label>
                <input v-model="volunteerForm.printer_model" placeholder="Например: Ender 3, Prusa mk3" required class="input-std" />
              </div>
            </div>

            <div class="form-group">
              <label>Материалы, с которыми работаете</label>
              <div class="checkbox-group">
                <label v-for="mat in availableMaterials" :key="mat" class="checkbox-label">
                  <input type="checkbox" :value="mat" v-model="volunteerForm.materials" />
                  {{ mat }}
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>О себе (опыт, возможности)</label>
              <textarea v-model="volunteerForm.about" rows="3" class="input-std"></textarea>
            </div>
            
            <div class="form-group">
              <label>Контакт для связи (Telegram / Email)</label>
              <input v-model="volunteerForm.contact" required class="input-std" />
            </div>

            <ButtonPrimary type="submit">Отправить анкету</ButtonPrimary>
          </form>
        </div>
      </div>

      <!-- Materials Form -->
      <div v-if="activeTab === 'materials'" class="help-content fade-in">
        <div class="form-container">
          <h2>Передать материалы или оборудование</h2>
          <p class="form-desc">Мы принимаем пластик, смолы, инструменты, а также 3D-принтеры (в том числе неисправные) и запчасти.</p>
          
          <form @submit.prevent="handleMaterialSubmit" class="help-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Ваше имя</label>
                <input v-model="materialForm.name" required class="input-std" />
              </div>
              <div class="form-group">
                <label>Тип помощи</label>
                <select v-model="materialForm.type" class="input-std">
                  <option value="plastic">Пластик / Расходники</option>
                  <option value="equipment">Оборудование (принтеры)</option>
                  <option value="parts">Запчасти / Ремонт</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>Что хотите передать? (описание)</label>
              <input v-model="materialForm.item" placeholder="Например: 5 катушек PLA, старый Ender 3" required class="input-std" />
            </div>

            <div class="form-group">
              <label>Комментарии (состояние, количество)</label>
              <textarea v-model="materialForm.comment" rows="3" class="input-std"></textarea>
            </div>

            <ButtonPrimary type="submit">Предложить помощь</ButtonPrimary>
          </form>
        </div>
      </div>

      <!-- Financial Help -->
      <div v-if="activeTab === 'financial'" class="help-content fade-in">
        <div class="financial-block">
          <h2>Финансовая поддержка</h2>
          <p>Все средства идут на закупку пластика для волонтеров и логистику (отправку посылок детям).</p>
          
          <div class="donate-options">
            <div class="donate-card">
              <h3>Разовый перевод</h3>
              <p>Любая комфортная сумма через карту или СБП.</p>
              <ButtonPrimary size="lg">Пожертвовать</ButtonPrimary>
            </div>
            <div class="donate-card highlight">
              <h3>Целевой сбор</h3>
              <p>Помогите нам закрыть конкретные потребности проекта.</p>
              <router-link :to="{ name: 'charity-fundraising' }">
                <ButtonPrimary variant="secondary" size="lg">Перейти к целям</ButtonPrimary>
              </router-link>
            </div>
          </div>

          <div class="donations-history">
            <h3>История поступлений</h3>
            <DonationList 
              :financial="store.donations.financial"
              :material="store.donations.material"
            />
          </div>
        </div>
      </div>

    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import DonationList from '@/components/charity/DonationList.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const store = useCharityStore()

const tabs = [
  { id: 'volunteer', label: 'Стать волонтёром' },
  { id: 'materials', label: 'Материалы и техника' },
  { id: 'financial', label: 'Финансы' }
]

const activeTab = ref('volunteer')

// Volunteer Logic
const availableMaterials = ['PLA', 'PETG', 'ABS', 'TPU', 'SBS', 'Фотополимер']

const volunteerForm = reactive({
  name: '',
  type: 'individual',
  city: '',
  printer_model: '',
  materials: [] as string[],
  about: '',
  contact: ''
})

const handleVolunteerSubmit = () => {
  store.addPartner({ 
    ...volunteerForm, 
    // map to store structure
  })
  alert('Спасибо за заявку! Мы свяжемся с вами.')
  // reset form logic here
}

// Material Logic
const materialForm = reactive({
  name: '',
  type: 'plastic',
  item: '',
  comment: ''
})

const handleMaterialSubmit = () => {
  store.addMaterialDonation({ ...materialForm })
  alert('Спасибо за предложение! Мы свяжемся с вами для уточнения деталей.')
  materialForm.name = ''
  materialForm.item = ''
  materialForm.comment = ''
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.page-title {
  font-size: $text-3xl;
  color: $gray-900;
  text-align: center;
  margin-bottom: $spacing-4;
}

.page-subtitle {
  text-align: center;
  color: $gray-600;
  max-width: 600px;
  margin: 0 auto $spacing-10;
}

.help-tabs {
  display: flex;
  justify-content: center;
  gap: $spacing-4;
  margin-bottom: $spacing-10;
  flex-wrap: wrap;
}

.tab-btn {
  padding: $spacing-3 $spacing-6;
  background: $white;
  border: 1px solid $gray-300;
  border-radius: $border-radius-full;
  font-weight: 600;
  color: $gray-600;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $primary-teal;
    color: $primary-teal;
  }

  &.active {
    background: $primary-teal;
    color: $white;
    border-color: $primary-teal;
    box-shadow: $shadow-md;
  }
}

.form-container {
  max-width: 700px;
  margin: 0 auto;
  background: $white;
  padding: $spacing-8;
  border-radius: $border-radius-lg;
  box-shadow: $shadow;

  h2 {
    margin-bottom: $spacing-2;
    color: $gray-900;
  }
}

.form-desc {
  color: $gray-600;
  margin-bottom: $spacing-6;
}

.help-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-5;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-5;
  
  @media (min-width: $breakpoint-sm) {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  
  label {
    font-weight: 600;
    font-size: $text-sm;
    color: $gray-700;
  }
}

.input-std {
  padding: 0.75rem;
  border: 1px solid $gray-300;
  border-radius: $border-radius-md;
  transition: border-color $transition-fast;
  
  &:focus {
    outline: none;
    border-color: $primary-teal;
    box-shadow: 0 0 0 2px rgba($primary-teal, 0.1);
  }
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-4;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: $text-sm;
}

.financial-block {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  
  h2 {
    margin-bottom: $spacing-4;
  }
  
  p {
    color: $gray-600;
    margin-bottom: $spacing-8;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

.donate-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-6;
  margin-bottom: $spacing-12;
}

.donate-card {
  background: $white;
  padding: $spacing-8;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  
  h3 {
    color: $primary-teal;
    margin-bottom: $spacing-3;
    font-size: $text-xl;
  }
  
  &.highlight {
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
    color: $white;
    
    h3 {
      color: $white;
    }
    
    p {
      color: rgba($white, 0.9);
    }
  }
}

.donations-history {
  text-align: left;
  background: $gray-50;
  padding: $spacing-8;
  border-radius: $border-radius-lg;
  
  h3 {
    margin-bottom: $spacing-6;
    border-bottom: 2px solid $gray-200;
    padding-bottom: $spacing-2;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
