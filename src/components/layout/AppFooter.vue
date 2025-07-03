<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__grid">
        <!-- Company Info -->
        <div class="footer__section footer__section--main">
          <h2 class="footer__title">Открытые Перспективы</h2>
          <p class="footer__description">
            Помогаем создавать будущее для всех через поддержку и технологии
          </p>
          <div class="footer__social">
            <a
              v-for="(link, index) in socialLinks"
              :key="index"
              :href="link.url"
              :aria-label="link.name"
              class="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img :src="link.icon" :alt="link.name" />
            </a>
          </div>
        </div>

        <!-- Projects -->
        <div class="footer__section">
          <h3 class="footer__subtitle">Проекты</h3>
          <ul class="footer__list">
            <li v-for="(link, index) in projectLinks" :key="index">
              <a :href="link.url" class="footer__link">{{ link.text }}</a>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div class="footer__section">
          <h3 class="footer__subtitle">Поддержка</h3>
          <ul class="footer__list">
            <li v-for="(link, index) in supportLinks" :key="index">
              <a :href="link.url" class="footer__link">{{ link.text }}</a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer__section">
          <h3 class="footer__subtitle">Контакты</h3>
          <address class="footer__contact">
            <p v-for="(contact, index) in contactInfo" :key="index">
              {{ contact.label }}: <a v-if="contact.isLink" :href="contact.url" class="footer__link">{{ contact.value }}</a>
              <span v-else>{{ contact.value }}</span>
            </p>
          </address>
        </div>

        <!-- Legal Links -->
        <div class="footer__section">
          <div class="footer__legal">
            <a
              v-for="(link, index) in legalLinks"
              :key="index"
              :href="link.url"
              class="footer__link"
            >
              {{ link.text }}
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          © {{ currentYear }} Автономная некоммерческая организация содействия профориентации и интеграции в реальный сектор экономики молодежи из незащищенных слоев населения «Открытые Перспективы» (АНО «Открытые Перспективы»)<br/>
          ОГРН 1257700115551<br/>
          ИНН 9726095312/КПП 772601001<br/>
          Юридический адрес: 117105, г. Москва, вн.тер.г. муниципальный округ Донской, ш Варшавское, д. 33<br/>
          Все права защищены. При использовании материалов ссылка на сайт обязательна.
        </p>
        <p class="footer__development">Сайт находится в стадии разработки.</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import TelegramIcon from '@/assets/images/tg.svg'
import VKIcon from '@/assets/images/icon.svg'
import YouTubeIcon from '@/assets/images/icon.svg'

interface Link {
  text: string
  url: string
}

interface SocialLink {
  name: string
  url: string
  icon: string
}

interface ContactInfo {
  label: string
  value: string
  url?: string
  isLink: boolean
}

export default defineComponent({
  name: 'AppFooter',

  setup() {
    const currentYear = computed(() => new Date().getFullYear())

    const socialLinks: SocialLink[] = [
      { name: 'Telegram', url: 'https://t.me/openperspectives', icon: TelegramIcon },
      { name: 'VK', url: 'https://vk.com/openperspectives', icon: VKIcon },
      { name: 'YouTube', url: 'https://youtube.com/@openperspectives', icon: YouTubeIcon }
    ]

    const projectLinks: Link[] = [
      { text: 'Перевод науки на РЖЯ', url: '#' },
      { text: 'Инклюзивные лекции', url: '#' },
      { text: 'Летние интенсивы', url: '#' },
      { text: 'База знаний', url: '#' }
    ]

    const supportLinks: Link[] = [
      { text: 'Волонтёрство', url: '#' },
      { text: 'Партнёрство', url: '#' },
      { text: 'Пожертвования', url: '#' },
      { text: 'Контакты', url: '#' }
    ]

    const contactInfo: ContactInfo[] = [
      { label: 'Email', value: 'info@openperspectives.ru', url: 'mailto:info@openperspectives.ru', isLink: true },
      { label: 'Телефон', value: '+7 915 003 39 35', url: 'tel:+79150033935', isLink: true },
      { label: 'Адрес', value: '117105, г. Москва, вн.тер.г. муниципальный округ Донской, ш Варшавское, д. 33', isLink: false }
    ]

    const legalLinks: Link[] = [
      { text: 'Политика конфиденциальности', url: '#' },
      { text: 'Условия использования', url: '#' }
    ]

    return {
      currentYear,
      socialLinks,
      projectLinks,
      supportLinks,
      contactInfo,
      legalLinks
    }
  }
})
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--spacing-16) var(--spacing-4);

  &__container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 var(--spacing-4);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-12);
    margin-bottom: var(--spacing-12);
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);

    &--main {
      grid-column: 1 / -1;

      @media (min-width: 1024px) {
        grid-column: auto;
      }
    }
  }

  &__title {
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--color-white);
    margin: 0;
  }

  &__subtitle {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--color-white);
    margin: 0;
  }

  &__description {
    font-size: var(--text-base);
    line-height: 1.6;
    color: var(--color-white);
    opacity: 0.9;
    margin: 0;
    max-width: 35ch;
  }

  &__social {
    display: flex;
    gap: var(--spacing-4);
    margin-top: var(--spacing-2);
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-md);
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--color-secondary);
      transform: translateY(-2px);
    }

    img {
      width: 1.25rem;
      height: 1.25rem;
      filter: brightness(0) invert(1);
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  &__link {
    color: var(--color-white);
    opacity: 0.9;
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: var(--text-sm);

    &:hover {
      opacity: 1;
      color: var(--color-secondary);
    }
  }

  &__contact {
    font-style: normal;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);

    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--color-white);
      opacity: 0.9;
    }
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--spacing-8);
    border-top: none;
    gap: var(--spacing-4);

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }
  }

  &__legal {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);

    @media (max-width: 768px) {
      gap: var(--spacing-3);
    }
  }

  &__copyright {
    font-size: var(--text-sm);
    color: var(--color-white);
    opacity: 0.7;
    margin: 0;
  }

  &__development {
    font-size: var(--text-xs);
    color: var(--color-white);
    opacity: 0.7;
    margin: 0;
  }
}
</style>
