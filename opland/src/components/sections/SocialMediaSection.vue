<template>
  <section class="social-media-section">
    <div class="social-media-container">
      <div class="social-media-content">
        <h2 class="social-media-title">Мы в социальных сетях</h2>
        <p class="social-media-subtitle">
          Следите за нашими новостями и проектами в социальных сетях
        </p>
        <div class="social-links">
          <a href="#" class="social-link">
            <img src="@/assets/images/icon.svg" alt="Telegram" />
            <span>Telegram</span>
          </a>
          <a href="#" class="social-link">
            <img src="@/assets/images/icon.svg" alt="VK" />
            <span>VK</span>
          </a>
          <a href="#" class="social-link">
            <img src="@/assets/images/icon.svg" alt="YouTube" />
            <span>YouTube</span>
          </a>
        </div>
      </div>
      <div class="social-image">
        <img src="@/assets/images/placeholder.svg" alt="Социальные сети" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SocialMediaSection'
}
</script>

<style lang="scss" scoped>
.social-media-section {
  width: 100%;
  height: 400px;
  background-color: $gray-50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.social-media-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  gap: 4rem;
}

.social-media-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
}

.social-media-title {
  font-size: $text-4xl;
  font-weight: 700;
  line-height: $leading-10;
  color: $primary-indigo;
  margin: 0;
}

.social-media-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  color: $gray-700;
  margin: 0;
}

.social-links {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: $white;
  border: 2px solid $gray-200;
  border-radius: $border-radius-lg;
  text-decoration: none;
  color: $gray-900;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: $primary-indigo;
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }
  
  img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: $border-radius-md;
  }
}

.social-image {
  flex: 1;
  display: flex;
  justify-content: center;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: $border-radius-lg;
  }
}

@media (max-width: $breakpoint-lg) {
  .social-media-section {
    height: auto;
  }
  
  .social-media-container {
    flex-direction: column;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: $breakpoint-md) {
  .social-links {
    flex-direction: column;
    align-items: center;
  }
  
  .social-link {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style> 