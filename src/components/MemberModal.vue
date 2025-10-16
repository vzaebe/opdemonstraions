<template>
  <Teleport to="body">
    <div
      v-if="visible && member"
      class="modal-bg"
      @click="handleOverlayClick"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'modal-title-' + member.name.replace(/\s+/g, '-').toLowerCase()"
    >
      <div class="modal-content">
        <button
          class="close-btn"
          @click="emit('close')"
          aria-label="Закрыть модальное окно"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-header">
          <img :src="member.photo" :alt="`Фото ${member.name}`" class="modal-photo">
          <div class="modal-info">
            <h2
              :id="'modal-title-' + member.name.replace(/\s+/g, '-').toLowerCase()"
              class="modal-name"
            >
              {{ member.name }}
            </h2>
            <h4 class="modal-role">{{ member.role }}</h4>
          </div>
        </div>

        <div class="modal-body">
          <h3 class="bio-title">О сотруднике</h3>
          <p class="bio-text">{{ member.bio }}</p>

          <div class="member-contact">
            <h4 class="contact-title">Контакты</h4>
            <div class="contact-links">
              <a href="mailto:info@opland.ru" class="contact-link" aria-label="Написать на email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email
              </a>
              <a href="https://t.me/opland" class="contact-link" aria-label="Написать в Telegram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/useModal'

interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
}

defineProps<{
  visible: boolean;
  member: TeamMember | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { handleOverlayClick } = useModal({
  closeOnEscape: true,
  closeOnOverlay: true,
  preventScroll: true,
  focusTrap: true
})
</script>

<style lang="scss" scoped>
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
  animation: fadeIn 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-photo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 4px solid #2eacb4;
  box-shadow: 0 4px 12px rgba(46, 172, 180, 0.3);
  transition: all 0.3s ease;

  &:hover {
    border-color: #1de9b6;
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(29, 233, 182, 0.4);
  }
}

.modal-name {
  font-size: 24px;
  font-weight: 700;
  color: #2eacb4;
  margin: 0 0 0.5rem 0;
}

.modal-role {
  font-size: 16px;
  font-weight: 500;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.modal-body {
  text-align: left;
}

.bio-title {
  font-size: 18px;
  font-weight: 600;
  color: #2eacb4;
  margin: 0 0 1rem 0;
}

.bio-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

.member-contact {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.contact-title {
  font-size: 16px;
  font-weight: 600;
  color: #2eacb4;
  margin: 0 0 1rem 0;
}

.contact-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #2eacb4;
    color: white;
    transform: translateY(-2px);
  }

  svg {
    flex-shrink: 0;
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  color: #666;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
}

@keyframes fadeIn {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .modal-photo {
    width: 100px;
    height: 100px;
  }

  .modal-name {
    font-size: 20px;
  }

  .modal-role {
    font-size: 14px;
  }
}
</style>
