<template>
  <section class="team-section">
    <div class="team-header">
      <h2 class="team-title">Наша прекрасная команда</h2>
      <p class="team-subtitle">
        Любая организация это в первую очередь люди, без которых наши проекты невозможно было бы реализовать
      </p>
      <ButtonPrimary
        :variant="showProfile ? 'secondary' : 'primary'"
        @click="toggleProfileView"
      >
        {{ showProfile ? 'Скрыть профили' : 'Показать профили' }}
      </ButtonPrimary>
    </div>

    <div v-if="showProfile" class="profile-container">
      <EmployeeProfile />
    </div>

    <div v-else class="team-grid">
      <div
        v-for="member in teamMembers"
        :key="member.id"
        class="team-member"
        @click="selectMember(member)"
      >
        <div class="member-photo-wrapper">
          <img 
            class="member-photo" 
            :src="member.photo" 
            :alt="`Фото ${member.name}`"
            loading="lazy"
          />
        </div>
        <div class="member-info">
          <h3 class="member-name">{{ member.name }}</h3>
          <p class="member-role">{{ member.role }}</p>
          <div class="member-social">
            <a
              v-if="member.socials.linkedin"
              :href="member.socials.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              title="LinkedIn"
              aria-label="LinkedIn профиль"
            >
              <i class="fas fa-linkedin"></i>
            </a>
            <a
              v-if="member.socials.telegram"
              :href="member.socials.telegram"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              title="Telegram"
              aria-label="Telegram"
            >
              <i class="fab fa-telegram"></i>
            </a>
            <a
              v-if="member.socials.email"
              :href="`mailto:${member.socials.email}`"
              class="social-link"
              title="Email"
              aria-label="Отправить письмо"
            >
              <i class="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно профиля -->
    <MemberModal 
      :visible="showModal" 
      :member="selectedMember" 
      @close="closeModal" 
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import MemberModal from '../MemberModal.vue'
import EmployeeProfile from '../EmployeeProfile.vue'
import ButtonPrimary from '../ButtonPrimary.vue'
import type { TeamMember } from '@/types/models'
// Import team member photos
import komarovPhoto from '@/assets/png/face/komarov pic.png'
import ivanovaPhoto from '@/assets/png/face/ivanova pic.png'
import mironovaPhoto from '@/assets/png/face/mironova pic.png'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Композабли
const { trackButtonClick, trackProfileView } = useAnalytics()

// Состояние
const showProfile = ref(false)
const selectedMember = ref<TeamMember | null>(null)
const showModal = ref(false)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Данные команды (с правильными типами)
const teamMembers: TeamMember[] = [
  {
    id: 'dmitriy-komarov',
    name: 'Дмитрий Комаров',
    role: 'НАЧАЛЬНИК УПРАВЛЕНИЯ ДОСТУПНОЙ ИНФОРМАЦИОННОЙ СРЕДЫ',
    position: 'Head of Accessibility',
    photo: komarovPhoto,
    bio: 'Курирует цифровую трансформацию среды. Помогает развивать доступность информационных технологий для всех категорий пользователей. Отвечает за внедрение инновационных решений в области доступности.',
    socials: {
      telegram: 'https://t.me/dmitriy_komarov',
      linkedin: 'https://linkedin.com/in/dmitriy-komarov',
      email: 'dmitriy@openperspectives.ru'
    },
    department: 'Accessibility',
    yearsInTeam: 5
  },
  {
    id: 'olga-ivanova',
    name: 'Ольга Иванова',
    role: 'ДИРЕКТОР',
    position: 'Director',
    photo: ivanovaPhoto,
    bio: 'Отвечает за общее руководство и стратегическое развитие организации. Координирует все направления деятельности и обеспечивает достижение ключевых показателей эффективности.',
    socials: {
      telegram: 'https://t.me/olga_ivanova',
      linkedin: 'https://linkedin.com/in/olga-ivanova',
      email: 'olga@openperspectives.ru'
    },
    department: 'Management',
    yearsInTeam: 8
  },
  {
    id: 'sofia-mironova',
    name: 'София Миронова',
    role: 'НАЧАЛЬНИК УПРАВЛЕНИЯ ИНКЛЮЗИВНЫХ ПРОГРАММ',
    position: 'Head of Inclusive Programs',
    photo: mironovaPhoto,
    bio: 'Разрабатывает и реализует инклюзивные программы для молодёжи и школ. Создает образовательные инициативы, направленные на развитие инклюзивной среды в образовательных учреждениях.',
    socials: {
      telegram: 'https://t.me/sofia_mironova',
      linkedin: 'https://linkedin.com/in/sofia-mironova',
      email: 'sofia@openperspectives.ru'
    },
    department: 'Programs',
    yearsInTeam: 6
  }
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Переключить вид профилей
 */
function toggleProfileView(): void {
  showProfile.value = !showProfile.value
  trackButtonClick(showProfile.value ? 'show_profiles' : 'hide_profiles')
}

/**
 * Выбрать члена команды
 */
function selectMember(member: TeamMember): void {
  selectedMember.value = member
  showModal.value = true
  
  // Трекируем просмотр профиля
  trackProfileView(member.name, 'modal')
}

/**
 * Закрыть модальное окно
 */
function closeModal(): void {
  showModal.value = false
  // Оставляем selectedMember для плавного перехода
  setTimeout(() => {
    selectedMember.value = null
  }, 300)
}
</script>

<script lang="ts">
export default {
  name: 'TeamSection'
}
</script>

<style lang="scss" scoped>
.team-section {
  width: 100%;
  background-color: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  gap: 60px;
}

.team-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 800px;
  text-align: center;
  margin-bottom: 60px;
}

.team-title {
  font-size: 48px;
  font-weight: 700;
  color: $primary-teal;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.team-subtitle {
  font-size: 20px;
  color: $gray-700;
  margin: 0 0 40px 0;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.profile-container {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  width: 100%;
}

.team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(46, 172, 180, 0.1), rgba(29, 233, 182, 0.1));
    transition: left 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(46, 172, 180, 0.15);

    &::before {
      left: 0;
    }

    .member-photo-wrapper {
      transform: scale(1.05);
    }
  }

  &:active {
    transform: translateY(-4px);
  }
}

.member-photo-wrapper {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(46, 172, 180, 0.2), rgba(29, 233, 182, 0.2));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: scale(1.05);

    &::after {
      opacity: 1;
    }
  }
}

.member-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.member-name {
  font-size: 22px;
  font-weight: 700;
  color: $primary-teal;
  margin: 0;
}

.member-role {
  font-size: 14px;
  font-weight: 500;
  color: $gray-700;
  opacity: 0.7;
  margin: 0;
  line-height: 1.4;
}

.member-social {
  display: flex;
  gap: 20px;
  margin-top: 12px;
}

.social-link {
  color: $gray-700;
  opacity: 0.7;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 50%;

  &:hover {
    opacity: 1;
    color: $white;
    background: linear-gradient(135deg, $primary-orange, $primary-yellow);
    transform: translateY(-2px);
  }

  &:nth-child(1):hover {
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
  }

  &:nth-child(2):hover {
    background: linear-gradient(135deg, $primary-coral, $primary-orange);
  }

  &:nth-child(3):hover {
    background: linear-gradient(135deg, $primary-cyan, $primary-mint);
  }
}

// Планшеты
@media (max-width: $breakpoint-lg) {
  .team-section {
    padding: 60px 16px;
    gap: 48px;
  }

  .team-title {
    font-size: 40px;
  }

  .team-subtitle {
    font-size: 20px;
  }

  .team-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 36px;
  }
}

// Мобильные устройства
@media (max-width: $breakpoint-md) {
  .team-section {
    padding: 48px 16px;
    gap: 36px;
  }

  .team-header {
    gap: 20px;
  }

  .team-title {
    font-size: 32px;
    line-height: 1.2;
  }

  .team-subtitle {
    font-size: 18px;
    line-height: 1.5;
  }

  .team-button {
    font-size: 16px;
    padding: 14px 28px;
    min-height: 48px; // touch-friendly
  }

  .team-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    max-width: 400px;
  }

  .member-photo-wrapper {
    width: 140px;
    height: 140px;
  }

  .member-name {
    font-size: 20px;
  }

  .member-role {
    font-size: 14px;
    line-height: 1.4;
  }

  .social-link {
    padding: 12px;
    min-width: 44px; // touch-friendly
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 16px;
    }
  }
}

// Маленькие мобильные экраны
@media (max-width: $breakpoint-sm) {
  .team-section {
    padding: 36px 12px;
    gap: 28px;
  }

  .team-header {
    gap: 16px;
  }

  .team-title {
    font-size: 28px;
  }

  .team-subtitle {
    font-size: 16px;
  }

  .team-button {
    font-size: 15px;
    padding: 12px 24px;
    min-height: 44px;
  }

  .team-grid {
    gap: 24px;
  }

  .member-photo-wrapper {
    width: 120px;
    height: 120px;
  }

  .member-info {
    gap: 12px;
  }

  .member-name {
    font-size: 18px;
  }

  .member-role {
    font-size: 13px;
  }

  .member-social {
    gap: 12px;
  }

  .social-link {
    padding: 10px;
    min-width: 40px;
    min-height: 40px;

    i {
      font-size: 14px;
    }
  }
}
</style>
