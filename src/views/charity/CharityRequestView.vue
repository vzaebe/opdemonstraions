<template>
  <div class="charity-view">
    <UiSection background="bg-gray-50">
      <div class="header-content">
        <h1 class="title">Подать заявку на 3D-печать</h1>
        <p class="subtitle">
          Если вы представитель детского дома или родитель ребенка, которому нужна помощь 
          с изготовлением изделия на 3D-принтере (игрушка, протез, учебное пособие), 
          заполните форму ниже. Это бесплатно.
        </p>
      </div>
      <CharityRequestForm />
    </UiSection>
  </div>
</template>

<script setup lang="ts">
import UiSection from '@/components/ui/Section.vue'
import CharityRequestForm from '@/components/charity/RequestForm.vue'
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.charity-view {
  min-height: 80vh;
}

.header-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto $spacing-10;
}

.title {
  font-size: $text-4xl;
  color: $primary-teal;
  margin-bottom: $spacing-4;
  
  @media (max-width: $breakpoint-md) {
    font-size: $text-2xl;
  }
}

.subtitle {
  font-size: $text-lg;
  color: $gray-600;
  line-height: $leading-relaxed;
}
</style>




