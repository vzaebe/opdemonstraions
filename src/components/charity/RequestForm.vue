<template>
  <form @submit.prevent="handleSubmit" class="request-form">
    <div class="form-group">
      <label for="name" class="form-label">ФИО ребенка / Получателя</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        class="form-input"
        placeholder="Иванов Иван Иванович"
        required
      />
    </div>

    <div class="form-group">
      <label for="orphanage" class="form-label">Детский дом / Учреждение</label>
      <input
        id="orphanage"
        v-model="form.orphanage"
        type="text"
        class="form-input"
        placeholder="Детский дом №1"
        required
      />
    </div>

    <div class="form-group">
      <label for="wish" class="form-label">Что нужно напечатать?</label>
      <input
        id="wish"
        v-model="form.wish"
        type="text"
        class="form-input"
        placeholder="Например: Протез кисти, фигурка героя"
        required
      />
    </div>

    <div class="form-group">
      <label for="file" class="form-label">Файл модели (.stl, .obj, .3mf, .step, .zip)</label>
      <input
        id="file"
        type="file"
        class="form-input"
        accept=".stl,.obj,.3mf,.step,.zip"
        @change="handleFileChange"
      />
    </div>

    <div class="form-group">
      <label for="model_link" class="form-label">Ссылка на модель (опционально)</label>
      <input
        id="model_link"
        v-model="form.model_link"
        type="url"
        class="form-input"
        placeholder="https://..."
      />
    </div>

    <div class="form-group">
      <label for="comment" class="form-label">Комментарий / Пожелания</label>
      <textarea
        id="comment"
        v-model="form.comment"
        class="form-textarea"
        placeholder="Цвет, размер, особенности..."
        rows="4"
      ></textarea>
    </div>

    <div v-if="success" class="form-message success">
      Заявка успешно отправлена! Мы свяжемся с вами.
    </div>

    <div class="form-actions">
      <ButtonPrimary type="submit" :loading="loading">
        Отправить заявку
      </ButtonPrimary>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCharityStore } from '@/stores/charity'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

const store = useCharityStore()

const loading = ref(false)
const success = ref(false)

const form = reactive({
  name: '',
  orphanage: '',
  wish: '',
  file_name: '',
  model_link: '',
  comment: ''
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    form.file_name = target.files[0].name
  }
}

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  store.addRequest({ ...form })
  
  loading.value = false
  success.value = true
  
  // Reset form
  form.name = ''
  form.orphanage = ''
  form.wish = ''
  form.comment = ''
  form.file_name = ''
  form.model_link = ''
  
  const fileInput = document.getElementById('file') as HTMLInputElement
  if (fileInput) fileInput.value = ''
  
  setTimeout(() => {
    success.value = false
  }, 5000)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.request-form {
  background: $white;
  padding: $spacing-6;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.form-group {
  margin-bottom: $spacing-5;
}

.form-label {
  display: block;
  margin-bottom: $spacing-2;
  font-weight: 600;
  color: $gray-700;
  font-size: $text-sm;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid $gray-300;
  border-radius: $border-radius-md;
  font-size: $text-base;
  transition: border-color $transition-fast;

  &:focus {
    outline: none;
    border-color: $primary-teal;
    box-shadow: 0 0 0 2px rgba($primary-teal, 0.2);
  }
}

.form-textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: $spacing-6;
}

.form-message {
  padding: $spacing-4;
  border-radius: $border-radius-md;
  margin-bottom: $spacing-4;
  text-align: center;
  
  &.success {
    background-color: rgba($primary-mint, 0.1);
    color: darken($primary-teal, 10%);
    border: 1px solid $primary-mint;
  }
}
</style>
