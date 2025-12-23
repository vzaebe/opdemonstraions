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
              href="https://t.me/openperspectives"
              class="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              title="Telegram"
            >
              <svg class="footer__social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a
              href="https://vk.com/openperspectives"
              class="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ВКонтакте"
              title="ВКонтакте"
            >
              <svg class="footer__social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com/@openperspectives"
              class="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              title="YouTube"
            >
              <svg class="footer__social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Projects -->
        <div class="footer__section">
          <h3 class="footer__subtitle">Проекты</h3>
          <ul class="footer__list">
            <li v-for="(link, index) in projectLinks" :key="index">
              <router-link v-if="link.to" :to="link.to" class="footer__link">{{ link.text }}</router-link>
              <a v-else :href="link.url" class="footer__link">{{ link.text }}</a>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div class="footer__section">
          <h3 class="footer__subtitle">Поддержка</h3>
          <ul class="footer__list">
            <li v-for="(link, index) in supportLinks" :key="index">
              <router-link v-if="link.to" :to="link.to" class="footer__link">{{ link.text }}</router-link>
              <a v-else :href="link.url" class="footer__link">{{ link.text }}</a>
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
/**
 * Компонент «AppFooter» — нижняя часть сайта.
 * Содержит:
 *  - Блок информации о компании и ссылки на социальные сети;
 *  - Быстрые ссылки на проекты, поддержку, юридические документы;
 *  - Контактную информацию и динамически обновляемый текущий год.
 *
 * Данные для вывода ссылок и контактов определены локально внутри setup(),
 * но при необходимости их можно вынести во внешние JSON/конфиги или получать
 * с сервера.
 */
import { defineComponent, computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { POLICY_LINKS } from '../../config'

export interface Link {
  text: string
  to?: RouteLocationRaw
  url?: string
}

export interface ContactInfo {
  label: string
  value: string
  url?: string
  isLink: boolean
}

export default defineComponent({
  name: 'AppFooter',

  setup() {
    const currentYear = computed(() => new Date().getFullYear())

    const projectLinks: Link[] = [
      { text: 'Перевод науки на РЖЯ', to: { name: 'organization-project-detail', params: { slug: 'science-in-rsl' } } },
      { text: 'Инклюзивные лекции', to: { name: 'organization-project-detail', params: { slug: 'inclusive-lectures' } } },
      { text: 'Летние интенсивы', to: { name: 'organization-project-detail', params: { slug: 'bauman-summer-intensives' } } },
      { text: 'База знаний', to: { name: 'knowledge' } }
    ]

    const supportLinks: Link[] = [
      { text: 'Поддержать проект', to: { name: 'support' } },
      { text: 'Партнёрство', to: { name: 'partners' } },
      { text: 'Контакты', to: { name: 'contacts' } },
      { text: 'О нас', to: { name: 'about' } }
    ]

    const contactInfo: ContactInfo[] = [
      { label: 'Email', value: 'info@openperspectives.ru', url: 'mailto:info@openperspectives.ru', isLink: true },
      { label: 'Телефон', value: '+7 915 003 39 35', url: 'tel:+79150033935', isLink: true },
      { label: 'Адрес', value: '117105, г. Москва, вн.тер.г. муниципальный округ Донской, ш Варшавское, д. 33', isLink: false }
    ]

    const legalLinks: Link[] = [
      { text: 'Политика конфиденциальности', url: POLICY_LINKS.PRIVACY_POLICY },
      { text: 'Соглашение на обработку ПД', url: POLICY_LINKS.PERSONAL_DATA_AGREEMENT },
      { text: 'Условия использования', url: POLICY_LINKS.TERMS_OF_USE }
    ]

    return {
      currentYear,
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
  margin-top: auto;

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

    .footer__social-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--color-white);
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

    @media (max-width: $breakpoint-md) {
      flex-direction: column;
      text-align: center;
      gap: var(--spacing-6);
    }
  }

  &__legal {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);

    @media (max-width: $breakpoint-md) {
      gap: var(--spacing-4);
      align-items: center;
    }
  }
}

// Дополнительная мобильная адаптация
@media (max-width: $breakpoint-md) {
  .footer {
    &__grid {
      grid-template-columns: 1fr;
      gap: 2rem;
      text-align: center;
    }

    &__section {
      &--main {
        order: -1;
      }
    }

    &__social {
      justify-content: center;
      gap: 1rem;
    }

    &__social-link {
      width: 3rem;
      height: 3rem;
      min-width: 44px; // touch-friendly
      min-height: 44px;

      .footer__social-icon {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    &__title {
      font-size: 1.75rem;
    }

    &__subtitle {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    &__description {
      max-width: none;
      text-align: center;
    }

    &__list {
      align-items: center;
      gap: 1rem;
    }

    &__link {
      font-size: 1rem;
      padding: 0.5rem 1rem;
      min-height: 44px; // touch-friendly
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__contact {
      align-items: center;
      text-align: center;
      gap: 1rem;

      p {
        font-size: 1rem;
      }
    }

    &__copyright {
      font-size: 0.8rem;
      line-height: 1.5;
      text-align: center;
    }

    &__development {
      font-size: 0.75rem;
      text-align: center;
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .footer {
    &__container {
      padding: 2rem 1rem;
    }

    &__grid {
      gap: 1.5rem;
    }

    &__title {
      font-size: 1.5rem;
    }

    &__subtitle {
      font-size: 1.1rem;
    }

    &__description {
      font-size: 0.9rem;
    }

    &__social {
      gap: 0.75rem;
    }

    &__social-link {
      width: 2.75rem;
      height: 2.75rem;
    }

    &__list {
      gap: 0.75rem;
    }

    &__link {
      font-size: 0.9rem;
      padding: 0.4rem 0.8rem;
    }

    &__contact p {
      font-size: 0.9rem;
    }

    &__copyright {
      font-size: 0.7rem;
    }

    &__development {
      font-size: 0.7rem;
    }

    &__bottom {
      padding-top: 1.5rem;
      gap: 1rem;
    }
  }
}
</style>
