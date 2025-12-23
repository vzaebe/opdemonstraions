export type OrganizationProjectStatus = 'active' | 'completed' | 'planned'
export type OrganizationProjectCategory = 'education' | 'social' | 'events' | 'innovation'

export interface OrganizationProject {
  id: number
  slug: string
  title: string
  description: string
  fullDescription?: string
  icon: string
  image?: string
  category: OrganizationProjectCategory
  status: OrganizationProjectStatus
  participants?: number
  duration?: string
  location?: string
  tags: string[]
}

/**
 * Данные проектов организации загружаются с backend (см. `/api/organization-projects`)
 * и управляются через админ-панель.
 */
