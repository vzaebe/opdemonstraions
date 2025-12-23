/**
 * Типы для модуля социальной 3D-печати
 * Централизованное определение всех интерфейсов и типов
 */

export interface Request {
  id: string
  name: string
  orphanage: string
  wish: string
  file_name?: string
  model_link?: string
  comment: string
  contact_name?: string
  contact_phone?: string
  contact_email?: string
  status: string
  date: string
}

export interface Work {
  id: string
  title: string
  image: string
  description: string
  date: string
}

export interface Partner {
  id: string
  name: string
  type: string
  printer_model: string
  materials: string[]
  capabilities?: string[] // deprecated, kept for compat
  about?: string
  contact?: string
  completed_works: number
  city: string
  logo?: string
  industry?: string
  assistanceType?: string
  fullDescription?: string
  website?: string
  email?: string
  phone?: string
  foundedYear?: number
}

export interface Resource {
  id: number
  category: string
  title: string
  url: string
  description: string
}

export interface Donation {
  id: number
  name: string
  amount?: number
  item?: string
  date: string
}

export interface Donations {
  financial: Donation[]
  material: Donation[]
}

export interface MaterialDonation {
  id: number
  name: string
  item: string
  type: string
  comment: string
  date: string
}

export interface FundraisingGoal {
  id: number
  title: string
  description: string
  target_amount: number
  current_amount: number
  image: string
}

export interface CampaignNeed {
  id: string
  title: string
  kind: string
  qty: number
  unit: string
  status: string
}

export interface Campaign {
  id: string
  title: string
  description: string
  type: string
  status: string
  shortText: string
  heroImage: string
  needs: CampaignNeed[]
  progress: number
}

export interface Article {
  id: string
  title: string
  content: string
  author: string
  date: string
  image?: string
  category?: string
}

export interface Video {
  id: string
  title: string
  url: string
  description: string
  thumbnail?: string
  date: string
  duration?: string
}

export interface Material {
  id: string
  title: string
  type: string
  fileUrl: string
  description: string
  date: string
  size?: string
}

export interface PrintModel {
  id: string
  name: string
  description: string
  category: string
  fileUrl?: string
  imageUrl?: string
  printTime?: string
  materialType?: string
  date: string
}

export interface ProjectMedia {
  id: string
  type: 'photo' | 'video' | 'document'
  url: string
  title: string
  description?: string
  thumbnail?: string
}

export interface Project {
  id: string
  title: string
  description: string
  shortDescription: string
  status: 'active' | 'completed' | 'planned'
  category: string
  heroImage: string
  startDate: string
  endDate?: string
  photos: ProjectMedia[]
  videos: ProjectMedia[]
  reports: ProjectMedia[]
  videoReports: ProjectMedia[]
  mediaLinks: Array<{ title: string; url: string; type: string }>
  beneficiaries?: string
  impact?: string
  partners?: string[]
  budget?: number
  raised?: number
}

