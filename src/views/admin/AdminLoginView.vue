<template>
  <div class="login-wrap">
    <UiCard class="card">
      <h1 class="title">Вход в админ-панель</h1>
      <p class="hint">Страница не отображается в меню. Доступ — только по логину и паролю.</p>

      <form class="form" @submit.prevent="onSubmit">
        <div class="field">
          <label class="label">Логин</label>
          <UiInput v-model="username" autocomplete="username" />
        </div>

        <div class="field">
          <label class="label">Пароль</label>
          <UiInput v-model="password" type="password" autocomplete="current-password" />
        </div>

        <div v-if="auth.error" class="error">{{ auth.error }}</div>

        <UiButton type="submit" :loading="auth.loading" :disabled="!username || !password">
          Войти
        </UiButton>
      </form>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UiButton, UiCard, UiInput } from '@/ui'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')

async function onSubmit() {
  const ok = await auth.login(username.value, password.value)
  if (!ok) return

  const next = typeof route.query.next === 'string' ? route.query.next : '/admin'
  router.replace(next)
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.login-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: $spacing-8;
  background: $gray-50;
}

.card { width: 100%; max-width: 460px; padding: $spacing-8; }

.title {
  margin: 0 0 $spacing-2;
  font-size: $text-2xl;
  color: $gray-900;
}

.hint {
  margin: 0 0 $spacing-6;
  color: $gray-600;
  font-size: $text-sm;
}

.form {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-weight: 600;
  color: $gray-700;
  font-size: $text-sm;
}

.error {
  color: $primary-coral;
  font-size: $text-sm;
}
</style>

