// Конфигурация ссылок на политики и соглашения
export const POLICY_LINKS = {
  // Замените на реальные ссылки
  PRIVACY_POLICY: '#', // Политика конфиденциальности
  PERSONAL_DATA_AGREEMENT: 'https://disk.yandex.ru/i/BeTfwmpOV_T1Sg', // Соглашение на обработку персональных данных
  TERMS_OF_USE: '#' // Условия использования
} as const

// Типы для ссылок
export type PolicyLinkType = keyof typeof POLICY_LINKS 