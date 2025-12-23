<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import HeroSection from '../components/sections/HeroSection.vue'
import PartnersSection from '../components/sections/PartnersSection.vue'
import OrientationSection from '../components/sections/OrientationSection.vue'
import GallerySection from '../components/sections/GallerySection.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import ServicesSection from '../components/sections/ServicesSection.vue'
const AdvantagesSection = defineAsyncComponent(() => import('../components/sections/AdvantagesSection.vue'))
import BestSection from '../components/sections/BestSection.vue'
import ServicesCardsSection from '../components/sections/ServicesCardsSection.vue'
import ProjectsSection from '../components/sections/ProjectsSection.vue'
import SocialMediaSection from '../components/sections/SocialMediaSection.vue'
const TelegramSection = defineAsyncComponent(() => import('../components/sections/TelegramSection.vue'))
const TeamSection = defineAsyncComponent(() => import('../components/sections/TeamSection.vue'))
const ContactSection = defineAsyncComponent(() => import('../components/sections/ContactSection.vue'))
import SupportSection from '../components/sections/SupportSection.vue'
</script>

<template>
  <div>
    <HeroSection />
    <PartnersSection />
    <OrientationSection />
    <GallerySection />
    <AboutSection />
    <ServicesSection />
    <AdvantagesSection />
    <BestSection />
    <ServicesCardsSection />
    <ProjectsSection />
    <SocialMediaSection />
    <TelegramSection />
    <TeamSection />
    <ContactSection />
    <SupportSection />
  </div>
</template>
