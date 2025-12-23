<template>
  <form @submit.prevent="handleSubmit" class="request-form">
    <div class="form-group">
      <label for="name" class="form-label">ФИО получателя</label>
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
      <label for="orphanage" class="form-label">Организация / учреждение (или семья)</label>
      <input
        id="orphanage"
        v-model="form.orphanage"
        type="text"
        class="form-input"
        placeholder="Например: школа, центр поддержки, семья"
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
        placeholder="Например: держатель для карандаша, обучающая модель, адаптивное приспособление"
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

    <div class="form-group">
      <label class="form-label">Контактное лицо</label>
      <input
        v-model="form.contact_name"
        type="text"
        class="form-input"
        placeholder="Имя того, с кем связаться"
        required
      />
    </div>

    <div class="form-group">
      <label class="form-label">Телефон для связи</label>
      <input
        v-model="form.contact_phone"
        type="tel"
        class="form-input"
        placeholder="+7..."
        required
      />
    </div>

    <div class="form-group">
      <label class="form-label">Email (опционально)</label>
      <input
        v-model="form.contact_email"
        type="email"
        class="form-input"
        placeholder="name@example.com"
      />
    </div>

    <div v-if="success" class="form-message success">
      Заявка успешно отправлена! Мы свяжемся с вами.
    </div>
    <div v-if="error" class="form-message error">
      {{ error }}
    </div>

    <div class="form-actions">
      <ButtonPrimary type="submit" :loading="loading">
        Отправить заявку
      </ButtonPrimary>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useCharityStore } from '@/stores/charity'
import ButtonPrimary from '@/components/ButtonPrimary.vue'

interface Props {
  initialModelLink?: string
  initialWish?: string
  initialComment?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialModelLink: '',
  initialWish: '',
  initialComment: ''
})

const emit = defineEmits<{
  success: []
}>()

const store = useCharityStore()

const loading = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

const form = reactive({
  name: '',
  orphanage: '',
  wish: props.initialWish || '',
  file_name: '',
  model_link: props.initialModelLink || '',
  comment: props.initialComment || '',
  contact_name: '',
  contact_phone: '',
  contact_email: ''
})

// Update form when props change
watch(() => props.initialModelLink, (newValue) => {
  if (newValue) form.model_link = newValue
})

watch(() => props.initialWish, (newValue) => {
  if (newValue) form.wish = newValue
})

watch(() => props.initialComment, (newValue) => {
  if (newValue) form.comment = newValue
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.item(0)
  if (file) form.file_name = file.name
}

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  error.value = null

  try {
    await store.addRequest({ ...form })
    success.value = true

    // Reset form
    form.name = ''
    form.orphanage = ''
    form.wish = ''
    form.comment = ''
    form.file_name = ''
    form.model_link = ''
    form.contact_name = ''
    form.contact_phone = ''
    form.contact_email = ''
    
    const fileInput = document.getElementById('file') as HTMLInputElement
    if (fileInput) fileInput.value = ''
    
    // Emit success event for modal close
    emit('success')
    
    setTimeout(() => {
      success.value = false
    }, 5000)
  } catch {
    error.value = 'Не удалось отправить заявку. Попробуйте позже.'
  } finally {
    loading.value = false
  }
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
  &.error {
    background-color: rgba($primary-coral, 0.08);
    color: $primary-coral;
    border: 1px solid rgba($primary-coral, 0.3);
  }
}
</style>
