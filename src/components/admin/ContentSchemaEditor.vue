<template>
  <div class="schema-editor">
    <div v-if="!schema" class="hint">
      <strong>Схема не описана.</strong>
      <div class="text">Для этого раздела пока нет формы — используйте Raw JSON ниже.</div>
    </div>

    <template v-else>
      <div class="schema-header">
        <div class="title">{{ schema.title }}</div>
        <div class="meta">Поля: {{ flatFieldCount }}</div>
      </div>

      <div v-if="disabled" class="hint">
        <strong>JSON сейчас невалидный.</strong>
        <div class="text">Исправьте JSON в Raw режиме — форма включится автоматически.</div>
      </div>

      <template v-else>
        <!-- Object editor -->
        <div v-if="schema.kind === 'object'" class="card">
          <div class="form-grid">
            <template v-for="f in schema.fields" :key="f.key">
              <!-- objectArray -->
              <div v-if="f.type === 'objectArray'" class="form-group full">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>

                <div class="nested-toolbar">
                  <UiSelect
                    :model-value="String(objectArraySelected[f.key] ?? -1)"
                    @update:modelValue="(v) => (objectArraySelected[f.key] = Number(v))"
                  >
                    <option v-for="(it, i) in asArray(localObject[f.key])" :key="i" :value="String(i)">
                      #{{ i + 1 }} {{ nestedItemTitle(it) }}
                    </option>
                    <option value="-1">+ Новый элемент</option>
                  </UiSelect>

                  <div class="toolbar-actions">
                    <UiButton variant="secondary" type="button" @click="addObjectArrayItem(localObject, f)">Добавить</UiButton>
                    <UiButton
                      variant="danger"
                      type="button"
                      :disabled="Number(objectArraySelected[f.key] ?? -1) < 0"
                      @click="removeObjectArrayItem(localObject, f)"
                    >
                      Удалить
                    </UiButton>
                  </div>
                </div>

                <div class="nested-grid">
                  <template v-for="sf in (f.itemFields || [])" :key="sf.key">
                    <div class="form-group">
                      <label>{{ sf.label }}<span v-if="sf.required"> *</span></label>

                      <UiTextarea
                        v-if="sf.type === 'textarea'"
                        :rows="3"
                        :placeholder="sf.placeholder || ''"
                        :model-value="String(nestedActiveItem(localObject, f)?.[sf.key] ?? '')"
                        @update:modelValue="(v) => onNestedTextValue(localObject, f, sf.key, v)"
                      />

                      <UiSelect
                        v-else-if="sf.type === 'select'"
                        :model-value="String(nestedActiveItem(localObject, f)?.[sf.key] ?? (sf.options?.[0]?.value ?? ''))"
                        @update:modelValue="(v) => onNestedSelectValue(localObject, f, sf.key, v)"
                      >
                        <option v-for="opt in (sf.options || [])" :key="String(opt.value)" :value="String(opt.value)">
                          {{ opt.label }}
                        </option>
                      </UiSelect>

                      <UiInput
                        v-else-if="sf.type === 'number'"
                        type="number"
                        :model-value="Number(nestedActiveItem(localObject, f)?.[sf.key] ?? 0)"
                        @update:modelValue="(v) => onNestedNumberValue(localObject, f, sf.key, String(v))"
                      />

                      <UiInput
                        v-else
                        :placeholder="sf.placeholder || ''"
                        :model-value="String(nestedActiveItem(localObject, f)?.[sf.key] ?? '')"
                        @update:modelValue="(v) => onNestedTextValue(localObject, f, sf.key, v)"
                      />
                    </div>
                  </template>
                </div>
              </div>

              <!-- stringArray -->
              <div v-else-if="f.type === 'stringArray'" class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiTextarea
                  :rows="4"
                  :placeholder="f.placeholder || ''"
                  :model-value="arrayToText(localObject[f.key])"
                  @update:modelValue="(v) => onFieldStringArrayValue(localObject, f.key, v)"
                />
              </div>

              <!-- textarea -->
              <div v-else-if="f.type === 'textarea'" class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiTextarea
                  :rows="4"
                  :placeholder="f.placeholder || ''"
                  :model-value="String(localObject[f.key] ?? '')"
                  @update:modelValue="(v) => onFieldTextValue(localObject, f.key, v)"
                />
              </div>

              <!-- select -->
              <div v-else-if="f.type === 'select'" class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiSelect
                  :model-value="String(localObject[f.key] ?? (f.options?.[0]?.value ?? ''))"
                  @update:modelValue="(v) => onFieldSelectValue(localObject, f.key, v)"
                >
                  <option v-for="opt in (f.options || [])" :key="String(opt.value)" :value="String(opt.value)">
                    {{ opt.label }}
                  </option>
                </UiSelect>
              </div>

              <!-- number -->
              <div v-else-if="f.type === 'number'" class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiInput
                  type="number"
                  :placeholder="f.placeholder || ''"
                  :model-value="Number(localObject[f.key] ?? 0)"
                  @update:modelValue="(v) => onFieldNumberValue(localObject, f.key, String(v))"
                />
              </div>

              <!-- date -->
              <div v-else-if="f.type === 'date'" class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiInput
                  type="date"
                  :model-value="String(localObject[f.key] ?? '')"
                  @update:modelValue="(v) => onFieldTextValue(localObject, f.key, v)"
                />
              </div>

              <!-- string default -->
              <div v-else class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiInput
                  :placeholder="f.placeholder || ''"
                  :model-value="String(localObject[f.key] ?? '')"
                  @update:modelValue="(v) => onFieldTextValue(localObject, f.key, v)"
                />
              </div>
            </template>
          </div>
        </div>

        <!-- Array editor -->
        <div v-else class="card">
          <div class="array-toolbar">
            <div class="row">
              <div class="form-group">
                <label>Элементы</label>
                <UiSelect
                  :model-value="String(selectedIndex)"
                  @update:modelValue="(v) => (selectedIndex = Number(v))"
                >
                  <option v-for="(it, idx) in localArray" :key="idx" :value="String(idx)">
                    #{{ idx + 1 }} {{ itemTitle(it) }}
                  </option>
                  <option value="-1">+ Новый элемент</option>
                </UiSelect>
              </div>

              <div class="toolbar-actions">
                <UiButton variant="secondary" type="button" @click="addNew">Добавить</UiButton>
                <UiButton variant="danger" type="button" :disabled="selectedIndex < 0" @click="removeSelected">Удалить</UiButton>
              </div>
            </div>
          </div>

          <div class="form-grid">
            <template v-for="f in schema.fields" :key="f.key">
              <!-- stringArray -->
              <div v-if="f.type === 'stringArray'" class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiTextarea
                  :rows="4"
                  :placeholder="f.placeholder || ''"
                  :model-value="arrayToText(activeItem[f.key])"
                  @update:modelValue="(v) => onFieldStringArrayValue(activeItem, f.key, v)"
                />
              </div>

              <!-- textarea -->
              <div v-else-if="f.type === 'textarea'" class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiTextarea
                  :rows="4"
                  :placeholder="f.placeholder || ''"
                  :model-value="String(activeItem[f.key] ?? '')"
                  @update:modelValue="(v) => onFieldTextValue(activeItem, f.key, v)"
                />
              </div>

              <!-- select -->
              <div v-else-if="f.type === 'select'" class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiSelect
                  :model-value="String(activeItem[f.key] ?? (f.options?.[0]?.value ?? ''))"
                  @update:modelValue="(v) => onFieldSelectValue(activeItem, f.key, v)"
                >
                  <option v-for="opt in (f.options || [])" :key="String(opt.value)" :value="String(opt.value)">
                    {{ opt.label }}
                  </option>
                </UiSelect>
              </div>

              <!-- number -->
              <div v-else-if="f.type === 'number'" class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiInput
                  type="number"
                  :placeholder="f.placeholder || ''"
                  :model-value="Number(activeItem[f.key] ?? 0)"
                  @update:modelValue="(v) => onFieldNumberValue(activeItem, f.key, String(v))"
                />
              </div>

              <!-- date -->
              <div v-else-if="f.type === 'date'" class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiInput
                  type="date"
                  :model-value="String(activeItem[f.key] ?? '')"
                  @update:modelValue="(v) => onFieldTextValue(activeItem, f.key, v)"
                />
              </div>

              <!-- string default -->
              <div v-else class="form-group">
                <label>{{ f.label }}<span v-if="f.required"> *</span></label>
                <UiInput
                  :placeholder="f.placeholder || ''"
                  :model-value="String(activeItem[f.key] ?? '')"
                  @update:modelValue="(v) => onFieldTextValue(activeItem, f.key, v)"
                />
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { ContentSchema, FieldSchema } from './contentSchemas'
import { UiButton, UiInput, UiSelect, UiTextarea } from '../../ui'

type Props = {
  schema: ContentSchema | null
  value: unknown
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:value': [unknown] }>()

function deepClone<T>(v: T): T {
  return v == null ? (v as T) : JSON.parse(JSON.stringify(v))
}

function asArray(v: unknown): any[] {
  return Array.isArray(v) ? v : []
}

function arrayToText(v: unknown): string {
  return Array.isArray(v) ? v.join('\n') : ''
}

function textToArray(text: string): string[] {
  return text
    .split(/\r?\n/g)
    .map((s) => s.trim())
    .filter(Boolean)
}

function toNumber(v: string): number {
  if (v === '' || v == null) return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function setField(obj: Record<string, any>, key: string, value: any) {
  obj[key] = value
}

function getEventValue(e: Event): string {
  const t = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
  return t?.value ?? ''
}

function onFieldText(obj: Record<string, any>, key: string, e: Event) {
  setField(obj, key, getEventValue(e))
}

function onFieldSelect(obj: Record<string, any>, key: string, e: Event) {
  setField(obj, key, getEventValue(e))
}

function onFieldNumber(obj: Record<string, any>, key: string, e: Event) {
  setField(obj, key, toNumber(getEventValue(e)))
}

function onFieldStringArray(obj: Record<string, any>, key: string, e: Event) {
  setField(obj, key, textToArray(getEventValue(e)))
}

function onFieldTextValue(obj: Record<string, any>, key: string, v: string) {
  setField(obj, key, v)
}

function onFieldSelectValue(obj: Record<string, any>, key: string, v: string) {
  setField(obj, key, v)
}

function onFieldNumberValue(obj: Record<string, any>, key: string, v: string) {
  setField(obj, key, toNumber(v))
}

function onFieldStringArrayValue(obj: Record<string, any>, key: string, v: string) {
  setField(obj, key, textToArray(v))
}

function onNestedText(obj: Record<string, any>, f: FieldSchema, key: string, e: Event) {
  setNestedField(obj, f, key, getEventValue(e))
}

function onNestedSelect(obj: Record<string, any>, f: FieldSchema, key: string, e: Event) {
  setNestedField(obj, f, key, getEventValue(e))
}

function onNestedNumber(obj: Record<string, any>, f: FieldSchema, key: string, e: Event) {
  setNestedField(obj, f, key, toNumber(getEventValue(e)))
}

function onNestedTextValue(obj: Record<string, any>, f: FieldSchema, key: string, v: string) {
  setNestedField(obj, f, key, v)
}

function onNestedSelectValue(obj: Record<string, any>, f: FieldSchema, key: string, v: string) {
  setNestedField(obj, f, key, v)
}

function onNestedNumberValue(obj: Record<string, any>, f: FieldSchema, key: string, v: string) {
  setNestedField(obj, f, key, toNumber(v))
}

// Local copies
const localObject = reactive<Record<string, any>>({})
const localArray = ref<any[]>([])
const selectedIndex = ref<number>(0)
const newDraftItem = ref<Record<string, any>>({})

const objectArraySelected = reactive<Record<string, number>>({})

const activeItem = computed<Record<string, any>>(() => {
  if (!props.schema || props.schema.kind !== 'array') return {}
  if (selectedIndex.value < 0) return newDraftItem.value
  return (localArray.value[selectedIndex.value] || {}) as any
})

const flatFieldCount = computed(() => {
  if (!props.schema) return 0
  let count = 0
  for (const f of props.schema.fields) {
    if (f.type === 'objectArray' && f.itemFields) count += f.itemFields.length
    else count += 1
  }
  return count
})

function makeEmptyItem(fields: FieldSchema[]): Record<string, any> {
  const o: Record<string, any> = {}
  for (const f of fields) {
    if (f.type === 'number') o[f.key] = 0
    else if (f.type === 'stringArray') o[f.key] = []
    else if (f.type === 'objectArray') o[f.key] = []
    else if (f.type === 'select') o[f.key] = f.options?.[0]?.value ?? ''
    else o[f.key] = ''
  }
  return o
}

function normalizeForSchema(schema: ContentSchema | null, value: unknown) {
  if (!schema) return { kind: 'unknown' as const }

  if (schema.kind === 'object') {
    const obj = value && typeof value === 'object' && !Array.isArray(value) ? (value as any) : {}
    return { kind: 'object' as const, obj }
  }

  const arr = Array.isArray(value) ? (value as any[]) : []
  return { kind: 'array' as const, arr }
}

function syncFromProps() {
  const normalized = normalizeForSchema(props.schema, props.value)

  if (normalized.kind === 'object') {
    for (const k of Object.keys(localObject)) delete localObject[k]
    Object.assign(localObject, deepClone(normalized.obj))

    // init nested selections
    for (const f of props.schema?.fields || []) {
      if (f.type !== 'objectArray') continue
      const arr = asArray(localObject[f.key])
      if (!(f.key in objectArraySelected)) {
        objectArraySelected[f.key] = arr.length ? 0 : -1
      } else {
        if (arr.length === 0) objectArraySelected[f.key] = -1
        else objectArraySelected[f.key] = Math.min(Math.max(objectArraySelected[f.key] ?? 0, 0), arr.length - 1)
      }
    }
  }

  if (normalized.kind === 'array') {
    localArray.value = deepClone(normalized.arr)
    if (localArray.value.length === 0) selectedIndex.value = -1
    else if (selectedIndex.value < 0) selectedIndex.value = 0
    else if (selectedIndex.value > localArray.value.length - 1) selectedIndex.value = localArray.value.length - 1
  }

  if (props.schema?.kind === 'array') {
    newDraftItem.value = makeEmptyItem(props.schema.fields)
  }
}

function emitUpstream() {
  if (!props.schema) return
  if (props.schema.kind === 'object') {
    emit('update:value', deepClone(localObject))
    return
  }
  emit('update:value', deepClone(localArray.value))
}

watch(
  () => [props.schema, props.value] as const,
  () => syncFromProps(),
  { immediate: true, deep: false }
)

watch(
  () => localObject,
  () => {
    if (props.disabled) return
    if (props.schema?.kind !== 'object') return
    emitUpstream()
  },
  { deep: true }
)

watch(
  () => localArray.value,
  () => {
    if (props.disabled) return
    if (props.schema?.kind !== 'array') return
    emitUpstream()
  },
  { deep: true }
)

watch(
  () => selectedIndex.value,
  () => {
    if (props.schema?.kind === 'array' && selectedIndex.value < 0) {
      newDraftItem.value = makeEmptyItem(props.schema.fields)
    }
  }
)

function addNew() {
  if (!props.schema || props.schema.kind !== 'array') return
  const item = selectedIndex.value < 0 ? deepClone(newDraftItem.value) : makeEmptyItem(props.schema.fields)
  localArray.value.push(item)
  selectedIndex.value = localArray.value.length - 1
}

function removeSelected() {
  if (!props.schema || props.schema.kind !== 'array') return
  if (selectedIndex.value < 0) return
  localArray.value.splice(selectedIndex.value, 1)
  if (localArray.value.length === 0) selectedIndex.value = -1
  else selectedIndex.value = Math.min(selectedIndex.value, localArray.value.length - 1)
}

function itemTitle(it: any): string {
  if (!it || typeof it !== 'object') return ''
  return it.title || it.name || it.slug || it.id || ''
}

function nestedItemTitle(it: any): string {
  if (!it || typeof it !== 'object') return ''
  return it.title || it.author || it.key || it.role || it.id || ''
}

function nestedActiveItem(obj: Record<string, any>, f: FieldSchema): Record<string, any> {
  const arr = asArray(obj[f.key])
  const idx = objectArraySelected[f.key] ?? (arr.length ? 0 : -1)
  if (idx < 0) return {}
  return (arr[idx] || {}) as any
}

function setNestedField(obj: Record<string, any>, f: FieldSchema, key: string, value: any) {
  const arr = asArray(obj[f.key])
  const idx = objectArraySelected[f.key] ?? -1
  if (idx < 0) return
  const next = [...arr]
  next[idx] = { ...(next[idx] || {}), [key]: value }
  obj[f.key] = next
}

function addObjectArrayItem(obj: Record<string, any>, f: FieldSchema) {
  const cur = asArray(obj[f.key])
  const blank: Record<string, any> = makeEmptyItem(f.itemFields || [])
  obj[f.key] = [...cur, blank]
  objectArraySelected[f.key] = cur.length
}

function removeObjectArrayItem(obj: Record<string, any>, f: FieldSchema) {
  const cur = asArray(obj[f.key])
  const idx = objectArraySelected[f.key] ?? -1
  if (idx < 0) return
  const next = [...cur]
  next.splice(idx, 1)
  obj[f.key] = next
  objectArraySelected[f.key] = next.length ? Math.min(idx, next.length - 1) : -1
}
</script>

<style scoped lang="scss">
.schema-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schema-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.title {
  font-weight: 800;
  color: #0f172a;
}

.meta {
  font-size: 0.85rem;
  color: #64748b;
}

.hint {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  color: #0f172a;
}

.hint .text {
  margin-top: 6px;
  color: #64748b;
  font-size: 0.9rem;
}

.card {
  background: #fff;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #eef2f7;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full {
  grid-column: 1 / -1;
}

label {
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;
}


.array-toolbar .row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}


.nested-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.nested-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}
</style>




