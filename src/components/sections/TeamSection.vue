<template>
  <section class="team-section">
    <div class="team-header">
      <h2 class="team-title">Наша прекрасная команда</h2>
      <p class="team-subtitle">
        Любая организация это в первую очередь люди, без которых наши проекты невозможно было бы реализовать
      </p>
      <ButtonPrimary
        :variant="showProfile ? 'secondary' : 'primary'"
        @click="showProfile = !showProfile"
      >
        {{ showProfile ? 'Скрыть профили' : 'Показать профили' }}
      </ButtonPrimary>
    </div>

    <div v-if="showProfile" class="profile-container">
      <EmployeeProfile />
    </div>

    <div v-else class="team-grid">
      <div
        class="team-member"
        v-for="member in team"
        :key="member.name"
        @click="handleMemberClick(member)"
      >
        <div class="member-photo-wrapper">
          <img class="member-photo" :src="member.photo" :alt="member.name" />
        </div>
        <div class="member-info">
          <h3 class="member-name">{{ member.name }}</h3>
          <p class="member-role">{{ member.role }}</p>
          <div class="member-social">
            <a href="#" class="social-link"><i class="fas fa-globe"></i></a>
            <a href="mailto:#" class="social-link"><i class="fas fa-envelope"></i></a>
            <a href="#" class="social-link"><i class="fab fa-telegram"></i></a>
          </div>
        </div>
      </div>
    </div>

    <MemberModal :visible="showModal" :member="selectedMember" @close="closeModal" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModal } from '@/composables/useModal'
import MemberModal from '../MemberModal.vue'
import EmployeeProfile from '../EmployeeProfile.vue'
import ButtonPrimary from '../ButtonPrimary.vue'

interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
}

const showProfile = ref(false)
const selectedMember = ref<TeamMember | null>(null)

const { isOpen: showModal, open: openModal, close: closeModal } = useModal({
  closeOnEscape: true,
  closeOnOverlay: true,
  preventScroll: true,
  focusTrap: true
})

const handleMemberClick = (member: TeamMember) => {
  selectedMember.value = member
  openModal(member)
}

const team: TeamMember[] = [
  {
    name: 'Дмитрий Комаров',
    role: 'НАЧАЛЬНИК УПРАВЛЕНИЯ ДОСТУПНОЙ ИНФОРМАЦИОННОЙ СРЕДЫ',
    photo: new URL('@/assets/png/face/komarov pic.png', import.meta.url).href,
    bio: 'Курирует цифровую трансформацию среды. Помогает развивать доступность информационных технологий для всех категорий пользователей. Отвечает за внедрение инновационных решений в области доступности.'
  },
  {
    name: 'Ольга Иванова',
    role: 'ДИРЕКТОР',
    photo: new URL('@/assets/png/face/ivanova pic.png', import.meta.url).href,
    bio: 'Отвечает за общее руководство и стратегическое развитие организации. Координирует все направления деятельности и обеспечивает достижение ключевых показателей эффективности.'
  },
  {
    name: 'София Миронова',
    role: 'НАЧАЛЬНИК УПРАВЛЕНИЯ ИНКЛЮЗИВНЫХ ПРОГРАММ',
    photo: new URL('@/assets/png/face/mironova pic.png', import.meta.url).href,
    bio: 'Разрабатывает и реализует инклюзивные программы для молодёжи и школ. Создает образовательные инициативы, направленные на развитие инклюзивной среды в образовательных учреждениях.'
  }
]
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

@media (max-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .team-section {
    padding: 60px 16px;
  }

  .team-title {
    font-size: 36px;
  }

  .team-subtitle {
    font-size: 18px;
  }

  .team-grid {
    grid-template-columns: 1fr;
  }

  .member-photo-wrapper {
    width: 150px;
    height: 150px;
  }
}
</style>
