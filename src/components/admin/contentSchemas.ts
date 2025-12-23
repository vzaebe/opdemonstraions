export type FieldType =
  | 'string'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'stringArray'
  | 'objectArray'

export type FieldSchema = {
  key: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string | number }>
  itemFields?: FieldSchema[] // for objectArray
}

export type ContentSchema = {
  title: string
  kind: 'array' | 'object'
  fields: FieldSchema[]
}

export const CONTENT_SCHEMAS: Record<string, ContentSchema> = {
  organizationProjects: {
    title: 'Проекты организации (/projects)',
    kind: 'array',
    fields: [
      { key: 'id', label: 'ID', type: 'number', required: true, placeholder: '1' },
      { key: 'slug', label: 'Slug', type: 'string', required: true, placeholder: 'my-project' },
      { key: 'title', label: 'Название', type: 'string', required: true },
      { key: 'description', label: 'Описание (коротко)', type: 'textarea', required: true },
      { key: 'fullDescription', label: 'Описание (полное)', type: 'textarea' },
      { key: 'icon', label: 'Иконка (строка/emoji)', type: 'string', required: true },
      { key: 'image', label: 'Картинка (URL)', type: 'string' },
      {
        key: 'category',
        label: 'Категория',
        type: 'select',
        required: true,
        options: [
          { label: 'education', value: 'education' },
          { label: 'social', value: 'social' },
          { label: 'events', value: 'events' },
          { label: 'innovation', value: 'innovation' }
        ]
      },
      {
        key: 'status',
        label: 'Статус',
        type: 'select',
        required: true,
        options: [
          { label: 'active', value: 'active' },
          { label: 'completed', value: 'completed' },
          { label: 'planned', value: 'planned' }
        ]
      },
      { key: 'participants', label: 'Участники (число)', type: 'number' },
      { key: 'duration', label: 'Длительность', type: 'string', placeholder: '3 месяца' },
      { key: 'location', label: 'Локация', type: 'string', placeholder: 'Москва' },
      { key: 'tags', label: 'Теги (по одному в строке)', type: 'stringArray' }
    ]
  },

  generalPartners: {
    title: 'Партнёры (/partners)',
    kind: 'array',
    fields: [
      { key: 'id', label: 'ID', type: 'string', required: true, placeholder: 'partner-1' },
      { key: 'name', label: 'Название', type: 'string', required: true },
      { key: 'type', label: 'Тип', type: 'string', placeholder: 'компания / НКО / ...' },
      { key: 'logo', label: 'Логотип (URL/путь)', type: 'string' },
      { key: 'industry', label: 'Отрасль', type: 'string' },
      { key: 'assistanceType', label: 'Формат помощи', type: 'string' },
      { key: 'description', label: 'Описание (коротко)', type: 'textarea' },
      { key: 'fullDescription', label: 'Описание (полное)', type: 'textarea' },
      { key: 'website', label: 'Сайт', type: 'string', placeholder: 'https://...' },
      { key: 'email', label: 'Email', type: 'string' },
      { key: 'phone', label: 'Телефон', type: 'string' },
      { key: 'city', label: 'Город', type: 'string' },
      { key: 'foundedYear', label: 'Год основания', type: 'number' },
      { key: 'completedProjects', label: 'Выполнено проектов', type: 'number' }
    ]
  },

  employees: {
    title: 'Сотрудники',
    kind: 'array',
    fields: [
      { key: 'id', label: 'ID', type: 'string', required: true, placeholder: 'olga' },
      { key: 'name', label: 'Имя', type: 'string', required: true },
      { key: 'role', label: 'Роль/должность', type: 'string', required: true },
      { key: 'photoUrl', label: 'Фото (URL)', type: 'string', required: true },
      { key: 'backgroundUrl', label: 'Фон (URL)', type: 'string', required: true },
      { key: 'bio', label: 'Описание (bio)', type: 'textarea', required: true },
      { key: 'details', label: 'Детали (по одному пункту в строке)', type: 'stringArray' }
    ]
  },

  supportGoals: {
    title: 'Цели поддержки (/support)',
    kind: 'array',
    fields: [
      { key: 'id', label: 'ID', type: 'number', required: true },
      { key: 'title', label: 'Название', type: 'string', required: true },
      { key: 'description', label: 'Описание', type: 'textarea', required: true },
      { key: 'target_amount', label: 'Цель (₽)', type: 'number', required: true },
      { key: 'current_amount', label: 'Собрано (₽)', type: 'number', required: true },
      { key: 'category', label: 'Категория', type: 'string' },
      {
        key: 'priority',
        label: 'Приоритет',
        type: 'select',
        required: true,
        options: [
          { label: 'high', value: 'high' },
          { label: 'medium', value: 'medium' },
          { label: 'low', value: 'low' }
        ]
      },
      { key: 'icon', label: 'Иконка (emoji)', type: 'string' },
      { key: 'examples', label: 'Примеры (по одному в строке)', type: 'stringArray' }
    ]
  },

  resources: {
    title: 'Charity: ресурсы',
    kind: 'array',
    fields: [
      { key: 'id', label: 'ID', type: 'number', required: true },
      { key: 'category', label: 'Категория', type: 'string', required: true },
      { key: 'title', label: 'Название', type: 'string', required: true },
      { key: 'url', label: 'URL', type: 'string', required: true },
      { key: 'description', label: 'Описание', type: 'textarea' }
    ]
  },

  'siteContent.supportSection': {
    title: 'Секция “Поддержите наш проект” (лендинг)',
    kind: 'object',
    fields: [
      { key: 'title', label: 'Заголовок', type: 'string', required: true },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea', required: true },
      {
        key: 'options',
        label: 'Карточки (options)',
        type: 'objectArray',
        itemFields: [
          { key: 'key', label: 'Ключ', type: 'string', required: true },
          { key: 'iconName', label: 'Иконка (name)', type: 'string' },
          { key: 'title', label: 'Заголовок', type: 'string', required: true },
          { key: 'text', label: 'Текст', type: 'textarea', required: true },
          { key: 'routeName', label: 'routeName', type: 'string', required: true },
          { key: 'routeHash', label: 'routeHash', type: 'string', placeholder: '#contact-form' },
          { key: 'linkText', label: 'Текст ссылки', type: 'string' }
        ]
      },
      {
        key: 'testimonials',
        label: 'Отзывы (testimonials)',
        type: 'objectArray',
        itemFields: [
          { key: 'avatarUrl', label: 'Аватар (URL)', type: 'string', required: true },
          { key: 'role', label: 'Роль', type: 'string', required: true },
          { key: 'text', label: 'Текст', type: 'textarea', required: true },
          { key: 'author', label: 'Автор', type: 'string', required: true },
          { key: 'iconName', label: 'Иконка (name)', type: 'string' }
        ]
      }
    ]
  }
}


