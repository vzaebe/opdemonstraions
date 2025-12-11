<template>
  <div class="charity-community">
    <!-- Hero Section -->
    <div class="community-hero">
      <div class="community-hero-background">
        <div class="community-hero-shape shape-1"></div>
        <div class="community-hero-shape shape-2"></div>
        <div class="community-hero-shape shape-3"></div>
      </div>
      <div class="community-hero-content">
        <div class="community-hero-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Наши герои</span>
        </div>
        <h1 class="community-hero-title">Сообщество мейкеров</h1>
        <p class="community-hero-subtitle">
          Наши герои — люди и компании, которые безвозмездно печатают изделия на своих 3D-принтерах.
          Каждый из них вносит свой вклад в создание лучшего будущего для детей.
        </p>
        <div class="community-hero-stats">
          <div class="hero-stat-item">
            <span class="stat-value">{{ store.partners.length }}</span>
            <span class="stat-label">Волонтёров</span>
          </div>
          <div class="hero-stat-item">
            <span class="stat-value">{{ totalWorks }}</span>
            <span class="stat-label">Работ выполнено</span>
          </div>
        </div>
        <ButtonPrimary size="lg" @click="showJoinForm = !showJoinForm" class="hero-cta-button">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ showJoinForm ? 'Скрыть форму' : 'Присоединиться' }}
        </ButtonPrimary>
      </div>
    </div>

    <UiSection>

      <!-- Join Form -->
      <div v-if="showJoinForm" class="join-form-container">
        <form @submit.prevent="handleJoin" class="join-form">
          <div class="form-header">
            <h3 class="form-title">Анкета волонтера</h3>
            <p class="form-description">Заполните форму, чтобы присоединиться к нашему сообществу</p>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label class="field-label">Имя / Организация</label>
              <input v-model="form.name" placeholder="Ваше имя или название компании" required class="input" />
            </div>
            <div class="form-field">
              <label class="field-label">Тип участника</label>
              <select v-model="form.type" class="input">
                <option value="individual">👤 Частное лицо</option>
                <option value="company">🏢 Компания</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label class="field-label">Город</label>
              <input v-model="form.city" placeholder="Москва" required class="input" />
            </div>
            <div class="form-field">
              <label class="field-label">Модель принтера</label>
              <input v-model="form.printer_model" placeholder="Например: Ender 3, Prusa MK3" required class="input" />
            </div>
          </div>
          <ButtonPrimary type="submit" size="lg" class="submit-button">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Отправить заявку
          </ButtonPrimary>
        </form>
      </div>

      <div class="partners-section">
        <div class="partners-header">
          <h2 class="section-title">Наши волонтёры</h2>
          <p class="section-subtitle">Познакомьтесь с людьми, которые делают мир лучше</p>
        </div>
        <div class="partners-grid">
          <PartnerCard
            v-for="(partner, index) in store.partners"
            :key="partner.id"
            :name="partner.name"
            :type="partner.type"
            :printer-model="partner.printer_model"
            :capabilities="partner.capabilities"
            :completed-works="partner.completed_works"
            :city="partner.city"
            :style="{ animationDelay: `${index * 0.1}s` }"
            class="partner-card-animated"
          />
        </div>
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import PartnerCard from '@/components/charity/PartnerCard.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const store = useCharityStore()
const showJoinForm = ref(false)

const totalWorks = computed(() => {
  return store.partners.reduce((sum, partner) => sum + partner.completed_works, 0)
})

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
  alert('🎉 Спасибо! Вы добавлены в список партнёров. Мы скоро с вами свяжемся!')
  form.name = ''
  form.city = ''
  form.printer_model = ''
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.charity-community {
  overflow: hidden;
}

.community-hero {
  position: relative;
  background: linear-gradient(135deg, #9061f9 0%, #c084fc 100%);
  color: $white;
  padding: $spacing-16 $spacing-4 $spacing-20;
  text-align: center;
  overflow: hidden;
}

.community-hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.15;
}

.community-hero-shape {
  position: absolute;
  border-radius: 50%;
  background: $white;
  animation: float 18s infinite ease-in-out;

  &.shape-1 {
    width: 400px;
    height: 400px;
    top: -150px;
    right: -100px;
  }

  &.shape-2 {
    width: 300px;
    height: 300px;
    bottom: -80px;
    left: -80px;
    animation-delay: 6s;
  }

  &.shape-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 10%;
    animation-delay: 12s;
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.community-hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
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

.community-hero-badge {
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

.community-hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: $spacing-4;
  font-weight: 800;
}

.community-hero-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto $spacing-10;
}

.community-hero-stats {
  display: flex;
  justify-content: center;
  gap: $spacing-10;
  margin-bottom: $spacing-10;
  flex-wrap: wrap;
}

.hero-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: $spacing-4 $spacing-6;
  background: rgba($white, 0.15);
  backdrop-filter: blur(10px);
  border-radius: $border-radius-xl;
  border: 1px solid rgba($white, 0.25);
}

.stat-value {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

.stat-label {
  font-size: $text-sm;
  opacity: 0.9;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-cta-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  50% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
}

.btn-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

.join-form-container {
  background: $white;
  padding: $spacing-10;
  border-radius: $border-radius-xl;
  margin-bottom: $spacing-12;
  margin-top: -60px;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.5s ease-out;
  border: 2px solid rgba(#9061f9, 0.2);
}

@keyframes slideDown {
  from { 
    opacity: 0; 
    transform: translateY(-30px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

.join-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: $spacing-8;
}

.form-title {
  font-size: $text-3xl;
  font-weight: 800;
  color: $gray-900;
  margin-bottom: $spacing-3;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #9061f9, #c084fc);
    margin: $spacing-3 auto 0;
    border-radius: 2px;
  }
}

.form-description {
  font-size: $text-base;
  color: $gray-600;
  line-height: $leading-relaxed;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-6;
  margin-bottom: $spacing-6;
  
  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 700;
  font-size: $text-sm;
  color: $gray-800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input {
  width: 100%;
  padding: 1rem;
  border: 2px solid $gray-200;
  border-radius: $border-radius-lg;
  font-size: $text-base;
  background: $gray-50;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #9061f9;
    box-shadow: 0 0 0 3px rgba(#9061f9, 0.1);
    background: $white;
  }

  &:hover {
    border-color: $gray-300;
  }
}

.submit-button {
  width: 100%;
  margin-top: $spacing-4;
}

.partners-section {
  margin-top: $spacing-12;
}

.partners-header {
  text-align: center;
  margin-bottom: $spacing-12;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: $gray-900;
  margin-bottom: $spacing-3;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #9061f9, #c084fc);
    border-radius: 2px;
  }
}

.section-subtitle {
  font-size: $text-lg;
  color: $gray-600;
  margin-top: $spacing-6;
  line-height: $leading-relaxed;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: $spacing-8;
}

.partner-card-animated {
  animation: fadeInScale 0.6s ease-out both;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>




