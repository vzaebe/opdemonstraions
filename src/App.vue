<script>
// Импортируем все компоненты секций
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import PartnersSection from '@/components/sections/PartnersSection.vue'
import OrientationSection from '@/components/sections/OrientationSection.vue'
import GallerySection from '@/components/sections/GallerySection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import AdvantagesSection from '@/components/sections/AdvantagesSection.vue'
import BestSection from '@/components/sections/BestSection.vue'
import RegistrationSection from '@/components/sections/RegistrationSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import ServicesCardsSection from '@/components/sections/ServicesCardsSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import SocialMediaSection from '@/components/sections/SocialMediaSection.vue'
import TeamSection from '@/components/sections/TeamSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import SupportSection from '@/components/sections/SupportSection.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    HeroSection,
    PartnersSection,
    OrientationSection,
    GallerySection,
    AboutSection,
    ServicesSection,
    AdvantagesSection,
    BestSection,
    RegistrationSection,
    TestimonialsSection,
    ServicesCardsSection,
    ProjectsSection,
    SocialMediaSection,
    TeamSection,
    ContactSection,
    SupportSection
  }
}
</script>

<template>
  <!-- Главный контейнер приложения -->
  <div id="app">
    <!-- Компонент навигации -->
    <AppHeader />
    
    <!-- Основной контент -->
    <main>
      <!-- Секция героя с фоновым изображением -->
      <HeroSection />
      
      <!-- Секция с партнерами -->
      <PartnersSection />
      
      <!-- Секция "Содействуем профориентации" -->
      <OrientationSection />
      
      <!-- Секция с изображениями -->
      <GallerySection />
      
      <!-- Секция "Больше, чем АНО" -->
      <AboutSection />
      
      <!-- Секция "Что мы делаем?" -->
      <ServicesSection />
      
      <!-- Секция "Наши преимущества" -->
      <AdvantagesSection />
      
      <!-- Секция "Лучшее, что может человек" -->
      <BestSection />
      
      <!-- Секция регистрации -->
      <RegistrationSection />
      
      <!-- Секция отзывов -->
      <TestimonialsSection />
      
      <!-- Секция карточек услуг -->
      <ServicesCardsSection />
      
      <!-- Секция основных проектов -->
      <ProjectsSection />
      
      <!-- Секция социальных сетей -->
      <SocialMediaSection />
      
      <!-- Секция команды -->
      <TeamSection />
      
      <!-- Секция контактов -->
      <ContactSection />
      
      <!-- Секция поддержки -->
      <SupportSection />
    </main>
    
    <!-- Футер -->
    <AppFooter />
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/global.scss' as *;
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $gray-900;
  line-height: $leading-relaxed;
}

// Основной контейнер приложения
.app {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden; // Предотвращаем горизонтальную прокрутку
}

// Контейнер для основного контента
.main-content {
  width: 100%;
}

// Smooth scrolling for anchor links
html {
  scroll-behavior: smooth;
}

// Reset default margins and paddings
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
