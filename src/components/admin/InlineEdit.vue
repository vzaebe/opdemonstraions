<template>
  <div 
    class="inline-edit" 
    :class="{ 'is-editing': isEditing, 'is-double-click': !isEditing }"
    @dblclick="startEdit"
  >
    <template v-if="!isEditing">
      <slot name="display" :value="modelValue">
        <span class="display-value">{{ displayValue }}</span>
      </slot>
      <button v-if="!hideEditIcon" class="edit-icon" @click.stop="startEdit" type="button">
        ✏️
      </button>
    </template>

    <template v-else>
      <input 
        v-if="type === 'text' || type === 'number'"
        ref="inputRef"
        v-model="localValue"
        :type="type"
        class="inline-input"
        @blur="handleBlur"
        @keyup.enter="save"
        @keyup.escape="cancel"
      />
      <select 
        v-else-if="type === 'select'"
        ref="inputRef"
        v-model="localValue"
        class="inline-select"
        @blur="handleBlur"
        @change="save"
      >
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <textarea
        v-else-if="type === 'textarea'"
        ref="inputRef"
        v-model="localValue"
        class="inline-textarea"
        @blur="handleBlur"
        @keyup.ctrl.enter="save"
        @keyup.escape="cancel"
        rows="3"
      />

      <div class="inline-actions">
        <button type="button" class="btn-save" @click="save">✓</button>
        <button type="button" class="btn-cancel" @click="cancel">✕</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

type EditType = 'text' | 'number' | 'select' | 'textarea'

interface SelectOption {
  value: string | number
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    type?: EditType
    options?: SelectOption[]
    formatter?: (val: string | number) => string
    hideEditIcon?: boolean
  }>(),
  {
    type: 'text',
    options: () => [],
    formatter: undefined,
    hideEditIcon: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  save: [value: string | number]
}>()

const isEditing = ref(false)
const localValue = ref(props.modelValue)
const inputRef = ref<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>()

const displayValue = computed(() => {
  if (props.formatter) {
    return props.formatter(props.modelValue)
  }
  if (props.type === 'select' && props.options.length > 0) {
    const opt = props.options.find(o => o.value === props.modelValue)
    return opt?.label || String(props.modelValue)
  }
  return String(props.modelValue)
})

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

async function startEdit() {
  isEditing.value = true
  localValue.value = props.modelValue
  await nextTick()
  inputRef.value?.focus()
  if (inputRef.value instanceof HTMLInputElement || inputRef.value instanceof HTMLTextAreaElement) {
    inputRef.value.select()
  }
}

function save() {
  emit('update:modelValue', localValue.value)
  emit('save', localValue.value)
  isEditing.value = false
}

function cancel() {
  localValue.value = props.modelValue
  isEditing.value = false
}

function handleBlur() {
  // Delay to allow clicking save button
  setTimeout(() => {
    if (isEditing.value) {
      cancel()
    }
  }, 200)
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.inline-edit {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 60px;

  &.is-double-click {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: $border-radius-sm;
    transition: background $transition-fast;

    &:hover {
      background: rgba($primary-teal, 0.05);
      
      .edit-icon {
        opacity: 1;
      }
    }
  }

  &.is-editing {
    min-width: 200px;
  }
}

.display-value {
  user-select: none;
}

.edit-icon {
  opacity: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 0.85rem;
  transition: opacity $transition-fast;

  &:hover {
    opacity: 1 !important;
  }
}

.inline-input,
.inline-select,
.inline-textarea {
  padding: 6px 10px;
  border: 2px solid $primary-teal;
  border-radius: $border-radius-sm;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
  flex: 1;
  min-width: 0;

  &:focus {
    border-color: $primary-teal;
    box-shadow: 0 0 0 3px rgba($primary-teal, 0.1);
  }
}

.inline-textarea {
  resize: vertical;
  min-height: 60px;
}

.inline-actions {
  display: flex;
  gap: 4px;
}

.btn-save,
.btn-cancel {
  border: none;
  background: $primary-teal;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: $border-radius-sm;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-fast;

  &:hover {
    transform: scale(1.1);
  }
}

.btn-cancel {
  background: $gray-400;

  &:hover {
    background: $gray-500;
  }
}
</style>
