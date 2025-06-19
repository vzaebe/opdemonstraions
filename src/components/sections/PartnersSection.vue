<template>
  <!-- Секция с генеральными партнерами -->
  <section class="partners-section">
    <!-- Контейнер секции -->
    <div class="partners-container">
      <!-- Заголовок секции -->
      <div class="partners-header">
        <h2 class="partners-title">Наши генеральные партнеры</h2>
        <p class="partners-subtitle">
          Компании, которые сотрудничают с нами в области интеграции незащищённых слоёв населения в свои производства
        </p>
      </div>
      
      <!-- Сетка логотипов партнеров -->
      <div class="partners-grid">
        <!-- Партнер 1 - правый нижний -->
        <div class="partner-card partner-card-1">
          <div class="partner-logo-container">
            <img 
              class="partner-logo" 
              src="@/assets/images/placeholder.svg"
              alt="Партнер 1"
            />
          </div>
        </div>
        
        <!-- Партнер 2 - центр нижний -->
        <div class="partner-card partner-card-2">
          <div class="partner-logo-container">
            <img 
              class="partner-logo" 
              src="@/assets/images/placeholder.svg"
              alt="Партнер 2"
            />
          </div>
        </div>
        
        <!-- Партнер 3 - левый нижний -->
        <div class="partner-card partner-card-3">
          <div class="partner-logo-container">
            <img 
              class="partner-logo" 
              src="@/assets/images/placeholder.svg"
              alt="Партнер 3"
            />
          </div>
        </div>
        
        <!-- Партнер 4 - левый нижний -->
        <div class="partner-card partner-card-4">
          <div class="partner-logo-container">
            <img 
              class="partner-logo" 
              src="@/assets/images/placeholder.svg"
              alt="Партнер 4"
            />
          </div>
        </div>
        
        <!-- Партнер 5 - правый верхний -->
        <div class="partner-card partner-card-5">
          <div class="partner-logo-container">
            <img 
              class="partner-logo" 
              src="@/assets/images/placeholder.svg"
              alt="Партнер 5"
            />
          </div>
        </div>
        
        <!-- Партнер 6 - центр верхний -->
        <div class="partner-card partner-card-6">
          <div class="partner-logo-container">
            <img 
              class="partner-logo" 
              src="@/assets/images/placeholder.svg"
              alt="Партнер 6"
            />
          </div>
        </div>
        
        <!-- Партнер 7 - левый верхний -->
        <div class="partner-card partner-card-7">
          <div class="partner-logo-container">
            <img 
              class="partner-logo" 
              src="@/assets/images/placeholder.svg"
              alt="Партнер 7"
            />
          </div>
        </div>
        
        <!-- Партнер 8 - левый верхний -->
        <div class="partner-card partner-card-8">
          <div class="partner-logo-container">
            <img 
              class="partner-logo" 
              src="@/assets/images/placeholder.svg"
              alt="Партнер 8"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PartnersSection'
}
</script>

<style lang="scss" scoped>
.partners-section {
  width: 100%;
  height: 750px;
  background-color: $primary-green;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 7rem 7rem 6rem 7rem;
  gap: 3.5rem;
}

.partners-container {
  width: 100%;
  max-width: $container-width;
}

.partners-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 1.75rem;
  width: 702px;
  height: 137.20px;
  margin: 0 auto;
}

.partners-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  text-align: center;
  color: $white;
  margin: 0;
}

.partners-subtitle {
  opacity: $opacity-70;
  font-size: $text-lg;
  font-weight: 500;
  line-height: $leading-7;
  text-align: center;
  color: $white;
  width: 702px;
  margin: 0;
}

.partners-grid {
  position: relative;
  width: 1171px;
  height: 350px;
  margin: 0 auto;
}

.partner-card {
  position: absolute;
  width: 16rem;
  height: 10rem;
}

.partner-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  border: 2px solid $white;
  border-radius: $border-radius;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease, background-color 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.partner-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.partner-card-1 {
  right: 0;
  bottom: 0;
  
  .partner-logo-container {
    align-items: flex-start;
    justify-content: center;
    padding: 2.75rem 3.5rem 4rem 3rem;
  }
}

.partner-card-2 {
  left: 600px;
  top: 190px;
  
  .partner-logo-container {
    align-items: center;
    justify-content: flex-start;
    padding: 3.5rem 5rem;
  }
}

.partner-card-3 {
  left: 300px;
  top: 190px;
  
  .partner-logo-container {
    align-items: center;
    justify-content: flex-end;
    padding: 4rem 3.5rem 4rem 4rem;
  }
}

.partner-card-4 {
  left: 0;
  bottom: 0;
  
  .partner-logo-container {
    align-items: center;
    justify-content: flex-start;
    padding: 2.5rem 6rem 2.25rem 6rem;
  }
}

.partner-card-5 {
  right: 0;
  top: 0;
  
  .partner-logo-container {
    align-items: center;
    justify-content: center;
    padding: 2.75rem 5rem 3rem 5rem;
  }
}

.partner-card-6 {
  left: 600px;
  top: 0;
  
  .partner-logo-container {
    align-items: center;
    justify-content: center;
    padding: 3rem 2.5rem 3.5rem 3rem;
  }
}

.partner-card-7 {
  left: 300px;
  top: 0;
  
  .partner-logo-container {
    align-items: center;
    justify-content: center;
    padding: 4rem 4rem 3.5rem 4rem;
  }
}

.partner-card-8 {
  left: 0;
  top: 0;
  
  .partner-logo-container {
    align-items: center;
    justify-content: center;
    padding: 3.5rem 5rem;
  }
}

@media (max-width: $breakpoint-lg) {
  .partners-section {
    height: auto;
    padding: 4rem 1rem 3rem 1rem;
  }
  
  .partners-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    position: static;
    width: 100%;
    height: auto;
  }
  
  .partner-card {
    position: static;
    width: 100%;
    height: 120px;
  }
}

@media (max-width: $breakpoint-md) {
  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: $breakpoint-sm) {
  .partners-grid {
    grid-template-columns: 1fr;
  }
}
</style> 