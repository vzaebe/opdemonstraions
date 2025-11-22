<template>
  <div class="charity-main">
    <!-- Hero Block -->
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Благотворительная 3D-печать</h1>
        <p class="hero-subtitle">
          Мы объединяем мейкеров и 3D-печатников для помощи детям. 
          Печатаем игрушки, развивающие пособия и средства реабилитации 
          для детских домов и нуждающихся семей.
        </p>
        <div class="hero-actions">
          <router-link :to="{ name: 'charity-request' }" class="no-decoration">
            <ButtonPrimary size="lg">Подать заявку</ButtonPrimary>
          </router-link>
          <router-link :to="{ name: 'charity-help' }" class="no-decoration">
            <ButtonPrimary variant="secondary" size="lg">Хочу помочь</ButtonPrimary>
          </router-link>
        </div>
      </div>
    </div>

    <UiSection>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ store.totalCompletedWorks }}</span>
          <span class="stat-label">Выполненных работ</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ store.totalPartners }}</span>
          <span class="stat-label">Активных мейкеров</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">0₽</span>
          <span class="stat-label">Стоимость для детей</span>
        </div>
      </div>
    </UiSection>

    <UiSection background="bg-gray-50">
      <h2 class="section-title">Как это работает?</h2>
      <div class="steps-grid">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Заявка</h3>
          <p>Детский дом или родители оставляют заявку на сайте, прикладывая модель или описание.</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Печать</h3>
          <p>Наши волонтеры берут заказ в работу, используют свои принтеры и пластик.</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Доставка</h3>
          <p>Готовое изделие отправляется получателю почтой или передается лично.</p>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <h3>Радость</h3>
          <p>Ребенок получает нужную вещь, а мейкер — плюсик в карму и фотоотчет.</p>
        </div>
      </div>
    </UiSection>

    <UiSection>
      <h2 class="section-title">Галерея выполненных работ</h2>
      <div class="gallery-preview">
        <div v-for="work in store.doneWorks.slice(0, 3)" :key="work.id" class="gallery-item">
          <img :src="work.image" :alt="work.title" class="gallery-img" />
          <div class="gallery-overlay">
            <h3>{{ work.title }}</h3>
          </div>
        </div>
      </div>
      <div class="gallery-actions">
        <router-link :to="{ name: 'charity-done' }">
          <ButtonPrimary variant="outline">Смотреть все работы</ButtonPrimary>
        </router-link>
      </div>
    </UiSection>

    <UiSection background="bg-teal-light">
      <div class="help-cta">
        <div class="help-content">
          <h2>Кому мы помогаем?</h2>
          <ul>
            <li>Детским домам и интернатам</li>
            <li>Детям с особенностями развития</li>
            <li>Благотворительным фондам</li>
            <li>Малообеспеченным семьям</li>
          </ul>
          <router-link :to="{ name: 'charity-request' }">
            <ButtonPrimary variant="primary">Нужна помощь?</ButtonPrimary>
          </router-link>
        </div>
        <div class="help-image">
          <!-- Placeholder for illustrative image -->
          <div class="img-placeholder">Helping Hands</div>
        </div>
      </div>
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import { useCharityStore } from '@/stores/charity'
import UiSection from '@/components/ui/Section.vue'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const store = useCharityStore()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.hero {
  background: linear-gradient(rgba($primary-teal, 0.9), rgba($primary-mint, 0.8)), url('@/assets/images/hero-bg.jpg'); // Fallback or need actual image
  background-color: $primary-teal; // Fallback color
  background-size: cover;
  background-position: center;
  color: $white;
  padding: $spacing-20 $spacing-4;
  text-align: center;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
}

.hero-title {
  font-size: $text-6xl;
  margin-bottom: $spacing-6;
  font-weight: 700;

  @media (max-width: $breakpoint-md) {
    font-size: $text-4xl;
  }
}

.hero-subtitle {
  font-size: $text-xl;
  margin-bottom: $spacing-12;
  line-height: $leading-relaxed;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: $spacing-6;
  flex-wrap: wrap;
}

.no-decoration {
  text-decoration: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-8;
  text-align: center;
}

.stat-card {
  padding: $spacing-6;
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  transition: transform $transition-normal;

  &:hover {
    transform: translateY(-5px);
  }
}

.stat-value {
  display: block;
  font-size: $text-5xl;
  font-weight: 800;
  color: $primary-teal;
  margin-bottom: $spacing-2;
}

.stat-label {
  font-size: $text-lg;
  color: $gray-600;
  font-weight: 500;
}

.section-title {
  text-align: center;
  font-size: $text-4xl;
  color: $gray-900;
  margin-bottom: $spacing-12;
  font-weight: 700;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-8;
}

.step {
  text-align: center;
  padding: $spacing-6;
  position: relative;
  
  h3 {
    font-size: $text-xl;
    margin-bottom: $spacing-3;
    color: $gray-800;
    font-weight: 600;
  }
  
  p {
    color: $gray-600;
    line-height: $leading-relaxed;
  }
}

.step-number {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, $primary-orange, lighten($primary-orange, 10%));
  color: $white;
  font-size: $text-3xl;
  font-weight: 700;
  border-radius: $border-radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto $spacing-6;
  box-shadow: $shadow-md;
}

.gallery-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-6;
  margin-bottom: $spacing-8;
}

.gallery-item {
  position: relative;
  height: 300px;
  border-radius: $border-radius-lg;
  overflow: hidden;
  cursor: pointer;
  
  &:hover .gallery-overlay {
    opacity: 1;
  }
  
  &:hover .gallery-img {
    transform: scale(1.05);
  }
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform $transition-slow;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($black, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity $transition-normal;
  
  h3 {
    color: $white;
    font-size: $text-xl;
    text-align: center;
    padding: $spacing-4;
  }
}

.gallery-actions {
  text-align: center;
}

.bg-teal-light {
  background-color: rgba($primary-teal, 0.05);
}

.help-cta {
  display: flex;
  flex-direction: column;
  gap: $spacing-10;
  align-items: center;
  
  @media (min-width: $breakpoint-lg) {
    flex-direction: row;
    justify-content: space-between;
  }
}

.help-content {
  flex: 1;
  
  h2 {
    font-size: $text-3xl;
    margin-bottom: $spacing-6;
    color: $gray-900;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin-bottom: $spacing-8;
    
    li {
      margin-bottom: $spacing-3;
      padding-left: $spacing-6;
      position: relative;
      font-size: $text-lg;
      color: $gray-700;
      
      &::before {
        content: "✓";
        color: $primary-mint;
        position: absolute;
        left: 0;
        font-weight: bold;
      }
    }
  }
}

.help-image {
  flex: 1;
  width: 100%;
  height: 300px;
  background: $gray-200;
  border-radius: $border-radius-xl;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .img-placeholder {
    font-size: $text-2xl;
    color: $gray-400;
    font-weight: 700;
  }
}
</style>
