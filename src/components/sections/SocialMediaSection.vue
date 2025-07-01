<template>
  <section class="social-media-section">
    <div class="social-media-container">
      <h2 class="social-media-title">Наши социальные сети</h2>
      <div class="social-links">
        <a href="#" class="social-link telegram">Телеграмм</a>
        <a href="#" class="social-link vkontakte">ВКонтакте</a>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'SocialMediaSection'
}
</script>

<style lang="scss" scoped>
.social-media-section {
  width: 100%;
  background-color: #2EBFB5;
  padding: 1.5rem 4rem;
}

.social-media-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.social-media-title {
  color: #FFFFFF;
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0;
}

.social-links {
  display: flex;
  gap: 1.5rem;
}

.social-link {
  padding: 0.75rem 2rem;
  border-radius: 100px;
  text-decoration: none;
  font-weight: 400;
  font-size: 1.1rem;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &.telegram {
    background-color: #C97E1F;
    color: #FFFFFF;
  }
  
  &.vkontakte {
    background-color: #FFE145;
    color: #FFFFFF;
  }
}

@media (max-width: 768px) {
  .social-media-section {
    padding: 1.5rem 2rem;
  }

  .social-media-container {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style> 