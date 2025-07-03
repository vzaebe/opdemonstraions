<template>
  <section class="telegram-section">
    <div class="telegram-container">
      <h2 class="telegram-title">Подпишитесь на наш Telegram-канал</h2>
      <p class="telegram-description">
        Наша команда ведет telegram-канал «Открытые Перспективы», где публикует план мероприятий,
        отчеты, видео-ролики, полезные новости и статьи, освещает актуальные темы по направлению
        деятельности. Подпишитесь, чтобы быть в курсе и ничего не пропустить.
      </p>
      <a
        href="https://t.me/openperspectives"
        target="_blank"
        rel="noopener noreferrer"
        class="telegram-button"
      >
        <TgIcon :width="24" :height="24" />
        <span>Подписаться</span>
      </a>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TgIcon from '../icons/TgIcon.vue'

export default defineComponent({
  name: 'TelegramSection',
  components: { TgIcon }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
.telegram-section {
  width: 100%;
  background-color: $primary-orange;
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
}

.telegram-container {
  max-width: 900px;
  width: 100%;
  text-align: center;
}

.telegram-title {
  font-size: $text-4xl;
  font-weight: 800;
  line-height: $leading-tight;
  color: $white;
  margin: 0 0 1.5rem 0;
}

.telegram-description {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  color: $white;
  margin-bottom: 2.5rem;
}

.telegram-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 2.5rem;
  background-color: $white;
  color: $primary-orange;
  border: none;
  border-radius: $border-radius-full;
  font-size: $text-lg;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;

  svg {
    fill: $primary-orange;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($black, 0.15);
  }
}

@media (max-width: 768px) {
  .telegram-title {
    font-size: $text-2xl;
  }

  .telegram-description {
    font-size: $text-base;
  }
}
</style>
