<template>
  <UiModal :open="Boolean(visible && member)" :aria-label="member ? `Сотрудник: ${member.name}` : 'Сотрудник'" @close="emit('close')">
    <div v-if="member" class="member-modal">
      <div class="modal-header">
        <img :src="member.photo" :alt="`Фото ${member.name}`" class="modal-photo" />
        <div class="modal-info">
          <h2 class="modal-name">{{ member.name }}</h2>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email
            </a>
            <a href="https://t.me/opland" class="contact-link" aria-label="Написать в Telegram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
              Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { UiModal } from '../ui'

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
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

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
  border-radius: $border-radius-full;
  margin-bottom: 1rem;
  border: 4px solid $primary-teal;
  box-shadow: 0 4px 12px rgba($primary-teal, 0.3);
  transition: transform $transition-normal, box-shadow $transition-normal, border-color $transition-normal;

  &:hover {
    border-color: $primary-mint;
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba($primary-mint, 0.4);
  }
}

.modal-name {
  font-size: $text-2xl;
  font-weight: 700;
  color: $primary-teal;
  margin: 0 0 0.5rem 0;
}

.modal-role {
  font-size: $text-base;
  font-weight: 500;
  color: $gray-600;
  margin: 0;
  line-height: 1.4;
}

.modal-body {
  text-align: left;
}

.bio-title {
  font-size: $text-lg;
  font-weight: 600;
  color: $primary-teal;
  margin: 0 0 1rem 0;
}

.bio-text {
  font-size: $text-base;
  line-height: 1.6;
  color: $gray-800;
  margin: 0;
}

.member-contact {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid $gray-100;
}

.contact-title {
  font-size: $text-base;
  font-weight: 600;
  color: $primary-teal;
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
  background: $gray-50;
  border-radius: $border-radius-lg;
  color: $gray-700;
  text-decoration: none;
  font-size: $text-sm;
  font-weight: 500;
  transition: transform $transition-normal, background $transition-normal, color $transition-normal;

  &:hover {
    background: $primary-teal;
    color: $white;
    transform: translateY(-2px);
  }

  svg {
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .modal-photo {
    width: 100px;
    height: 100px;
  }

  .modal-name {
    font-size: $text-xl;
  }

  .modal-role {
    font-size: $text-sm;
  }
}
</style>
