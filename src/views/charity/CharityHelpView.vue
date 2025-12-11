<template>
  <div class="charity-help">
    <!-- Hero Section -->
    <div class="help-hero">
      <div class="help-hero-background">
        <div class="help-hero-shape shape-1"></div>
        <div class="help-hero-shape shape-2"></div>
      </div>
      <div class="help-hero-content">
        <div class="help-hero-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
          </svg>
          <span>Станьте частью изменений</span>
        </div>
        <h1 class="help-hero-title">Помочь проекту</h1>
        <p class="help-hero-subtitle">
          Проект существует благодаря поддержке неравнодушных людей. 
          Каждый может внести свой вклад — выберите удобный для вас способ помощи.
        </p>
      </div>
    </div>

    <UiSection>
      <!-- Navigation Tabs for Help Types -->
      <div class="help-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
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
  { id: 'volunteer', label: 'Стать волонтёром', icon: '🖨️' },
  { id: 'materials', label: 'Материалы и техника', icon: '📦' },
  { id: 'financial', label: 'Финансы', icon: '💰' }
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

const handleVolunteerSubmit = async () => {
  await store.addVolunteer({ 
    ...volunteerForm
  })
  alert('Спасибо за заявку! Мы свяжемся с вами.')
  volunteerForm.name = ''
  volunteerForm.city = ''
  volunteerForm.printer_model = ''
  volunteerForm.materials = []
  volunteerForm.about = ''
  volunteerForm.contact = ''
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

.charity-help {
  overflow: hidden;
}

.help-hero {
  position: relative;
  background: linear-gradient(135deg, #ff5a1f 0%, #ff9068 100%);
  color: $white;
  padding: $spacing-16 $spacing-4 $spacing-20;
  text-align: center;
  overflow: hidden;
}

.help-hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.15;
}

.help-hero-shape {
  position: absolute;
  border-radius: 50%;
  background: $white;
  animation: float 15s infinite ease-in-out;

  &.shape-1 {
    width: 400px;
    height: 400px;
    top: -150px;
    left: -100px;
  }

  &.shape-2 {
    width: 300px;
    height: 300px;
    bottom: -100px;
    right: -80px;
    animation-delay: 7s;
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, -20px) rotate(180deg); }
}

.help-hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.help-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba($white, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.5rem;
  border-radius: $border-radius-full;
  margin-bottom: $spacing-6;
  font-size: $text-sm;
  font-weight: 600;
  border: 1px solid rgba($white, 0.3);
}

.badge-icon {
  width: 20px;
  height: 20px;
}

.help-hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: $spacing-4;
  font-weight: 800;
}

.help-hero-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto;
}

.help-tabs {
  display: flex;
  justify-content: center;
  gap: $spacing-4;
  margin-bottom: $spacing-12;
  flex-wrap: wrap;
  margin-top: -40px;
  position: relative;
  z-index: 2;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: $spacing-4 $spacing-8;
  background: $white;
  border: 2px solid $gray-200;
  border-radius: $border-radius-xl;
  font-weight: 600;
  color: $gray-700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: $primary-orange;
    color: $primary-orange;
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(255, 90, 31, 0.3);
  }

  &.active {
    background: linear-gradient(135deg, $primary-orange, #ff9068);
    color: $white;
    border-color: $primary-orange;
    box-shadow: 0 8px 25px rgba(255, 90, 31, 0.4);
    transform: translateY(-5px);
  }
}

.tab-icon {
  font-size: 1.5rem;
}

.tab-label {
  font-size: $text-base;
}

.help-content {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: $white;
  padding: $spacing-10;
  border-radius: $border-radius-xl;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba($primary-orange, 0.1);

  h2 {
    margin-bottom: $spacing-3;
    color: $gray-900;
    font-size: $text-3xl;
    font-weight: 800;
    text-align: center;
    
    &::after {
      content: '';
      display: block;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, $primary-orange, $primary-teal);
      margin: $spacing-3 auto 0;
      border-radius: 2px;
    }
  }
}

.form-desc {
  color: $gray-600;
  margin-bottom: $spacing-8;
  text-align: center;
  font-size: $text-base;
  line-height: $leading-relaxed;
}

.help-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-6;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-6;
  
  @media (min-width: $breakpoint-sm) {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  
  label {
    font-weight: 700;
    font-size: $text-sm;
    color: $gray-800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.input-std {
  padding: 1rem;
  border: 2px solid $gray-200;
  border-radius: $border-radius-lg;
  transition: all 0.3s ease;
  font-size: $text-base;
  background: $gray-50;
  
  &:focus {
    outline: none;
    border-color: $primary-orange;
    box-shadow: 0 0 0 3px rgba($primary-orange, 0.1);
    background: $white;
  }

  &:hover {
    border-color: $gray-300;
  }
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-3;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: $text-sm;
  padding: 0.5rem 1rem;
  background: $gray-50;
  border-radius: $border-radius-md;
  transition: all 0.2s ease;
  border: 1px solid $gray-200;

  &:hover {
    background: rgba($primary-orange, 0.1);
    border-color: $primary-orange;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}

.financial-block {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  
  h2 {
    margin-bottom: $spacing-4;
    font-size: $text-3xl;
    font-weight: 800;
    color: $gray-900;
  }
  
  > p {
    color: $gray-600;
    margin-bottom: $spacing-10;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    font-size: $text-lg;
    line-height: $leading-relaxed;
  }
}

.donate-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: $spacing-8;
  margin-bottom: $spacing-12;
}

.donate-card {
  background: $white;
  padding: $spacing-10;
  border-radius: $border-radius-xl;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  border: 2px solid transparent;
  
  h3 {
    color: $primary-teal;
    margin-bottom: $spacing-4;
    font-size: $text-2xl;
    font-weight: 800;
  }

  p {
    color: $gray-600;
    margin-bottom: $spacing-6;
    line-height: $leading-relaxed;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }
  
  &.highlight {
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
    color: $white;
    border-color: $primary-teal;
    box-shadow: 0 15px 40px rgba($primary-teal, 0.3);
    position: relative;
    overflow: hidden;

    &::before {
      content: '⭐ Рекомендуем';
      position: absolute;
      top: $spacing-4;
      right: $spacing-4;
      background: rgba($white, 0.2);
      padding: 0.25rem 0.75rem;
      border-radius: $border-radius-full;
      font-size: $text-xs;
      font-weight: 700;
    }
    
    h3 {
      color: $white;
    }
    
    p {
      color: rgba($white, 0.95);
    }

    &:hover {
      transform: translateY(-8px) scale(1.03);
    }
  }
}

.donations-history {
  text-align: left;
  background: linear-gradient(135deg, rgba($primary-teal, 0.05), rgba($primary-mint, 0.1));
  padding: $spacing-10;
  border-radius: $border-radius-xl;
  border: 1px solid rgba($primary-teal, 0.2);
  
  h3 {
    margin-bottom: $spacing-6;
    border-bottom: 3px solid $primary-teal;
    padding-bottom: $spacing-3;
    font-size: $text-2xl;
    font-weight: 800;
    color: $gray-900;
  }
}

.fade-in {
  animation: fadeInSlide 0.5s ease-out;
}

@keyframes fadeInSlide {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}
</style>
