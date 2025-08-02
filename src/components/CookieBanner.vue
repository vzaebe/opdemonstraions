<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';
import { POLICY_LINKS } from '@/config/links';

// Visibility state of the banner
const isVisible = ref(false);

onMounted(() => {
  // Show banner only if user hasn\'t accepted cookies yet
  isVisible.value = Cookies.get('cookie_consent') !== 'accepted';
});

function acceptCookies() {
  // Store consent for one year
  Cookies.set('cookie_consent', 'accepted', { expires: 365 });
  isVisible.value = false;
}
</script>

<template>
  <transition name="slide-up">
    <div
      v-if="isVisible"
      class="cookie-banner"
      role="dialog"
      aria-label="Cookie consent"
    >
      <p class="cookie-text">
        Мы используем cookie-файлы, чтобы улучшить работу сайта. Продолжая пользоваться сайтом, вы соглашаетесь на
        <a :href="POLICY_LINKS.PRIVACY_POLICY" class="policy-link" target="_blank" rel="noopener">использование cookie</a> и
        <a :href="POLICY_LINKS.PERSONAL_DATA_AGREEMENT" class="policy-link" target="_blank" rel="noopener">обработку персональных данных</a>.
      </p>
      <button class="accept-btn" @click="acceptCookies">Принять</button>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.cookie-banner {
  position: fixed;
  left: 50%;
  bottom: $spacing-6; // 1.5rem
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-4;
  width: calc(100% - 2 * $spacing-6);
  max-width: $max-w-xl; // 36rem
  padding: $spacing-6;
  background-color: $primary-teal;
  color: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  z-index: $z-modal;
  text-align: center;

  @media (min-width: $breakpoint-md) {
    flex-direction: row;
    text-align: left;
  }
}

.cookie-text {
  flex: 1 1 auto;
  font-size: $text-sm;
  line-height: $leading-relaxed;
}

.policy-link {
  color: $white;
  text-decoration: underline;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}

.accept-btn {
  flex-shrink: 0;
  background-color: $primary-orange;
  color: $white;
  border: none;
  padding: $spacing-3 $spacing-6;
  border-radius: $border-radius-md;
  font-size: $text-sm;
  cursor: pointer;
  transition: background-color $transition-fast;

  &:hover {
    background-color: #b87a12;
  }
  &:focus {
    outline: 2px solid rgba($white, 0.8);
    outline-offset: 2px;
  }
}

// Slide up animation
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 130%);
}
</style>
