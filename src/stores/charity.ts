/**
 * Store для модуля социальной 3D-печати
 * 
 * Управляет состоянием всех данных связанных с модулем социальной 3D-печати:
 * - Заявки на печать
 * - Выполненные работы
 * - Партнёры и волонтёры
 * - Кампании и сборы
 * - Статьи, видео, материалы
 * - Модели для печати
 * - Проекты
 * 
 * Все типы вынесены в отдельный файл @/types/charity.ts для лучшей организации
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { http, trackApiError } from '@/services/api/http'
import type {
  Request,
  Work,
  Partner,
  Resource,
  Donations,
  MaterialDonation,
  FundraisingGoal,
  Campaign,
  CampaignNeed,
  Article,
  Video,
  Material,
  PrintModel,
  Project
} from '@/types/charity'

export const useCharityStore = defineStore('charity', () => {
  // State
  const requests = ref<Request[]>([])
  const doneWorks = ref<Work[]>([])
  const partners = ref<Partner[]>([])
  const donations = ref<Donations>({ financial: [], material: [] } as Donations)
  const resources = ref<Resource[]>([])
  const materialDonations = ref<MaterialDonation[]>([])
  const fundraisingGoals = ref<FundraisingGoal[]>([]) // legacy display
  const campaigns = ref<Campaign[]>([])
  const articles = ref<Article[]>([])
  const videos = ref<Video[]>([])
  const materials = ref<Material[]>([])
  const printModels = ref<PrintModel[]>([])
  const projects = ref<Project[]>([])

  // Getters
  const pendingRequests = computed(() => requests.value.filter(r => r.status === 'new'))
  const completedRequests = computed(() => requests.value.filter(r => r.status === 'completed'))
  const totalCompletedWorks = computed(() => doneWorks.value.length)
  const totalPartners = computed(() => partners.value.length)

  async function fetchDoneWorks() {
    try {
      const data = await http.get<Work[]>('/done-works')
      doneWorks.value = data
    } catch (error) {
      trackApiError(error, 'fetchDoneWorks')
      doneWorks.value = []
    }
  }

  async function fetchResources() {
    try {
      const data = await http.get<Resource[]>('/resources')
      resources.value = data
    } catch (error) {
      trackApiError(error, 'fetchResources')
      resources.value = []
    }
  }

  async function createResource(payload: Omit<Resource, 'id'>) {
    try {
      const created = await http.post<Resource>('/admin/resources', payload)
      resources.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'createResource')
      throw error
    }
  }

  async function updateResource(id: number | string, updates: Partial<Resource>) {
    try {
      const updated = await http.patch<Resource>(`/admin/resources/${id}`, updates)
      const idx = resources.value.findIndex((r) => String(r.id) === String(id))
      if (idx !== -1) resources.value[idx] = updated
      return updated
    } catch (error) {
      trackApiError(error, 'updateResource')
      throw error
    }
  }

  async function deleteResource(id: number | string) {
    try {
      await http.delete(`/admin/resources/${id}`)
      const idx = resources.value.findIndex((r) => String(r.id) === String(id))
      if (idx !== -1) resources.value.splice(idx, 1)
    } catch (error) {
      trackApiError(error, 'deleteResource')
      throw error
    }
  }

  async function fetchDonations() {
    try {
      const data = await http.get<Donations>('/donations')
      donations.value = data
    } catch (error) {
      trackApiError(error, 'fetchDonations')
      donations.value = { financial: [], material: [] } as Donations
    }
  }

  async function fetchFundraisingGoals() {
    try {
      const data = await http.get<FundraisingGoal[]>('/fundraising-goals')
      fundraisingGoals.value = data
    } catch (error) {
      trackApiError(error, 'fetchFundraisingGoals')
      fundraisingGoals.value = []
    }
  }

  async function fetchMaterialDonations(admin = false) {
    try {
      const url = admin ? '/admin/material-donations' : '/material-donations'
      const data = await http.get<MaterialDonation[]>(url)
      materialDonations.value = data
    } catch (error) {
      trackApiError(error, 'fetchMaterialDonations')
      materialDonations.value = []
    }
  }

  async function createMaterialDonation(payload: Omit<MaterialDonation, 'id' | 'date'> & { date?: string }) {
    try {
      const created = await http.post<MaterialDonation>('/material-donations', payload)
      materialDonations.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'createMaterialDonation')
      throw error
    }
  }

  async function fetchCampaigns(admin = false) {
    try {
      const url = admin ? '/admin/campaigns' : '/campaigns'
      const data = await http.get<Campaign[]>(url)
      campaigns.value = data
    } catch (error) {
      trackApiError(error, 'fetchCampaigns')
    }
  }

  async function createCampaign(payload: Omit<Campaign, 'id'> & { needs?: CampaignNeed[] }) {
    try {
      const created = await http.post<Campaign>('/admin/campaigns', payload)
      campaigns.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'createCampaign')
      throw error
    }
  }

  async function updateCampaign(id: string, updates: Partial<Campaign>) {
    try {
      const updated = await http.patch<Campaign>(`/admin/campaigns/${id}`, updates)
      const idx = campaigns.value.findIndex(c => c.id === id)
      if (idx !== -1) campaigns.value[idx] = updated
      return updated
    } catch (error) {
      trackApiError(error, 'updateCampaign')
      throw error
    }
  }

  async function deleteCampaign(id: string) {
    try {
      await http.delete(`/admin/campaigns/${id}`)
      const idx = campaigns.value.findIndex(c => c.id === id)
      if (idx !== -1) campaigns.value.splice(idx, 1)
    } catch (error) {
      trackApiError(error, 'deleteCampaign')
      throw error
    }
  }

  // Actions
  async function fetchRequests() {
    try {
      const data = await http.get<Request[]>('/admin/print-requests')
      requests.value = data
    } catch (error) {
      trackApiError(error, 'fetchRequests')
    }
  }

  async function addRequest(request: Omit<Request, 'id' | 'status' | 'date'>) {
    try {
      const created = await http.post<Request>('/print-requests', request)
      requests.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'addRequest')
      throw error
    }
  }

  async function updateRequestStatus(id: number | string, status: string) {
    try {
      const updated = await http.patch<Request>(`/admin/print-requests/${id}/status`, { status })
      const req = requests.value.find(r => r.id === id)
      if (req) Object.assign(req, updated)
    } catch (error) {
      trackApiError(error, 'updateRequestStatus')
    }
  }

  async function updateRequest(id: string, updates: Partial<Request>) {
    try {
      const updated = await http.patch<Request>(`/admin/print-requests/${id}`, updates)
      const req = requests.value.find(r => r.id === id)
      if (req) Object.assign(req, updated)
      return updated
    } catch (error) {
      trackApiError(error, 'updateRequest')
      throw error
    }
  }

  async function fetchPartners() {
    try {
      const data = await http.get<Partner[]>('/admin/partners')
      partners.value = data
    } catch (error) {
      trackApiError(error, 'fetchPartners')
      partners.value = []
    }
  }

  async function addVolunteer(volunteer: {
    name: string
    type: string
    city: string
    printer_model: string
    materials: string[]
    about?: string
    contact: string
  }) {
    try {
      const created = await http.post<{ id: string } & typeof volunteer>('/volunteers', volunteer)
      partners.value.push({
        id: created.id,
        name: created.name,
        type: created.type,
        city: created.city,
        printer_model: created.printer_model,
        materials: created.materials,
        about: created.about,
        contact: created.contact,
        completed_works: 0
      })
      return created
    } catch (error) {
      trackApiError(error, 'addVolunteer')
      throw error
    }
  }
  
  async function addPartner(partner: Omit<Partner, 'id' | 'completed_works'>) {
    try {
      const created = await http.post<Partner>('/admin/partners', partner)
      partners.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'addPartner')
      // fallback local
      const newPartner: Partner = {
        ...partner,
        id: Date.now().toString(),
        completed_works: 0
      }
      partners.value.push(newPartner)
      return newPartner
    }
  }
  
  async function updatePartner(id: string, updates: Partial<Partner>) {
    try {
      const updated = await http.patch<Partner>(`/admin/partners/${id}`, updates)
      const idx = partners.value.findIndex(p => p.id === id)
      if (idx !== -1) partners.value[idx] = updated
      return updated
    } catch (error) {
      trackApiError(error, 'updatePartner')
      const partner = partners.value.find(p => p.id === id)
      if (partner) {
        Object.assign(partner, updates)
        return partner
      }
      throw error
    }
  }
  
  async function removePartner(id: string) {
    try {
      await http.delete(`/admin/partners/${id}`)
      const index = partners.value.findIndex(p => p.id === id)
      if (index !== -1) partners.value.splice(index, 1)
    } catch (error) {
      trackApiError(error, 'removePartner')
      const index = partners.value.findIndex(p => p.id === id)
      if (index !== -1) partners.value.splice(index, 1)
      else throw error
    }
  }

  async function createDoneWork(payload: Omit<Work, 'id'>) {
    try {
      const created = await http.post<Work>('/admin/done-works', payload)
      doneWorks.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'createDoneWork')
      throw error
    }
  }

  async function deleteDoneWork(id: string) {
    try {
      await http.delete(`/admin/done-works/${id}`)
      const idx = doneWorks.value.findIndex(w => w.id === id)
      if (idx !== -1) doneWorks.value.splice(idx, 1)
    } catch (error) {
      trackApiError(error, 'deleteDoneWork')
      throw error
    }
  }

  async function updateDoneWork(id: string, updates: Partial<Work>) {
    try {
      const updated = await http.patch<Work>(`/admin/done-works/${id}`, updates)
      const idx = doneWorks.value.findIndex(w => w.id === id)
      if (idx !== -1) doneWorks.value[idx] = updated
      return updated
    } catch (error) {
      trackApiError(error, 'updateDoneWork')
      throw error
    }
  }

  // Fallback local add (legacy/offline) for done works
  function addWork(work: Omit<Work, 'id'> & { date?: string }) {
    const { date, ...rest } = work
    const newWork: Work = {
      ...rest,
      id: Date.now().toString(),
      date: (date || new Date().toISOString().split('T')[0]) as string
    }
    doneWorks.value.push(newWork)
  }

  // NOTE: legacy local-only mutations removed: use API
  
  function updateFundraising(id: number, updates: Partial<FundraisingGoal>) {
    const goal = fundraisingGoals.value.find(g => g.id === id)
    if (goal) {
      Object.assign(goal, updates)
    }
  }

  // Articles
  async function fetchArticles() {
    try {
      const data = await http.get<Article[]>('/articles')
      articles.value = data
    } catch (error) {
      trackApiError(error, 'fetchArticles')
      articles.value = []
    }
  }

  async function createArticle(payload: Omit<Article, 'id' | 'date'>) {
    try {
      const created = await http.post<Article>('/admin/articles', {
        ...payload,
        date: new Date().toISOString()
      })
      articles.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'createArticle')
      throw error
    }
  }

  async function updateArticle(id: string, updates: Partial<Article>) {
    try {
      const updated = await http.patch<Article>(`/admin/articles/${id}`, updates)
      const idx = articles.value.findIndex(a => a.id === id)
      if (idx !== -1) articles.value[idx] = updated
      return updated
    } catch (error) {
      trackApiError(error, 'updateArticle')
      throw error
    }
  }

  async function deleteArticle(id: string) {
    try {
      await http.delete(`/admin/articles/${id}`)
      const idx = articles.value.findIndex(a => a.id === id)
      if (idx !== -1) articles.value.splice(idx, 1)
    } catch (error) {
      trackApiError(error, 'deleteArticle')
      throw error
    }
  }

  // Videos
  async function fetchVideos() {
    try {
      const data = await http.get<Video[]>('/videos')
      videos.value = data
    } catch (error) {
      trackApiError(error, 'fetchVideos')
      videos.value = []
    }
  }

  async function createVideo(payload: Omit<Video, 'id' | 'date'>) {
    try {
      const created = await http.post<Video>('/admin/videos', {
        ...payload,
        date: new Date().toISOString()
      })
      videos.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'createVideo')
      throw error
    }
  }

  async function updateVideo(id: string, updates: Partial<Video>) {
    try {
      const updated = await http.patch<Video>(`/admin/videos/${id}`, updates)
      const idx = videos.value.findIndex(v => v.id === id)
      if (idx !== -1) videos.value[idx] = updated
      return updated
    } catch (error) {
      trackApiError(error, 'updateVideo')
      throw error
    }
  }

  async function deleteVideo(id: string) {
    try {
      await http.delete(`/admin/videos/${id}`)
      const idx = videos.value.findIndex(v => v.id === id)
      if (idx !== -1) videos.value.splice(idx, 1)
    } catch (error) {
      trackApiError(error, 'deleteVideo')
      throw error
    }
  }

  // Materials
  async function fetchMaterials() {
    try {
      const data = await http.get<Material[]>('/materials')
      materials.value = data
    } catch (error) {
      trackApiError(error, 'fetchMaterials')
      materials.value = []
    }
  }

  async function createMaterial(payload: Omit<Material, 'id' | 'date'>) {
    try {
      const created = await http.post<Material>('/admin/materials', {
        ...payload,
        date: new Date().toISOString()
      })
      materials.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'createMaterial')
      throw error
    }
  }

  async function updateMaterial(id: string, updates: Partial<Material>) {
    try {
      const updated = await http.patch<Material>(`/admin/materials/${id}`, updates)
      const idx = materials.value.findIndex(m => m.id === id)
      if (idx !== -1) materials.value[idx] = updated
      return updated
    } catch (error) {
      trackApiError(error, 'updateMaterial')
      throw error
    }
  }

  async function deleteMaterial(id: string) {
    try {
      await http.delete(`/admin/materials/${id}`)
      const idx = materials.value.findIndex(m => m.id === id)
      if (idx !== -1) materials.value.splice(idx, 1)
    } catch (error) {
      trackApiError(error, 'deleteMaterial')
      throw error
    }
  }

  // Print Models
  async function fetchPrintModels() {
    try {
      const data = await http.get<PrintModel[]>('/print-models')
      printModels.value = data
    } catch (error) {
      trackApiError(error, 'fetchPrintModels')
      printModels.value = []
    }
  }

  async function createPrintModel(payload: Omit<PrintModel, 'id' | 'date'>) {
    try {
      const created = await http.post<PrintModel>('/admin/print-models', {
        ...payload,
        date: new Date().toISOString()
      })
      printModels.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'createPrintModel')
      throw error
    }
  }

  async function updatePrintModel(id: string, updates: Partial<PrintModel>) {
    try {
      const updated = await http.patch<PrintModel>(`/admin/print-models/${id}`, updates)
      const idx = printModels.value.findIndex(m => m.id === id)
      if (idx !== -1) printModels.value[idx] = updated
      return updated
    } catch (error) {
      trackApiError(error, 'updatePrintModel')
      throw error
    }
  }

  async function deletePrintModel(id: string) {
    try {
      await http.delete(`/admin/print-models/${id}`)
      const idx = printModels.value.findIndex(m => m.id === id)
      if (idx !== -1) printModels.value.splice(idx, 1)
    } catch (error) {
      trackApiError(error, 'deletePrintModel')
      throw error
    }
  }

  // Projects
  async function fetchProjects() {
    try {
      const data = await http.get<Project[]>('/projects')
      projects.value = data
    } catch (error) {
      trackApiError(error, 'fetchProjects')
      projects.value = []
    }
  }

  async function createProject(payload: Omit<Project, 'id'>) {
    try {
      const created = await http.post<Project>('/admin/projects', payload)
      projects.value.push(created)
      return created
    } catch (error) {
      trackApiError(error, 'createProject')
      throw error
    }
  }

  async function updateProject(id: string, updates: Partial<Project>) {
    try {
      const updated = await http.patch<Project>(`/admin/projects/${id}`, updates)
      const idx = projects.value.findIndex(p => p.id === id)
      if (idx !== -1) projects.value[idx] = updated
      return updated
    } catch (error) {
      trackApiError(error, 'updateProject')
      throw error
    }
  }

  async function deleteProject(id: string) {
    try {
      await http.delete(`/admin/projects/${id}`)
      const idx = projects.value.findIndex(p => p.id === id)
      if (idx !== -1) projects.value.splice(idx, 1)
    } catch (error) {
      trackApiError(error, 'deleteProject')
      throw error
    }
  }

  return {
    requests,
    doneWorks,
    partners,
    donations,
    resources,
    materialDonations,
    campaigns,
    fundraisingGoals,
    articles,
    videos,
    materials,
    printModels,
    projects,
    pendingRequests,
    completedRequests,
    totalCompletedWorks,
    totalPartners,
    fetchRequests,
    fetchPartners,
    fetchDoneWorks,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
    fetchDonations,
    fetchFundraisingGoals,
    fetchMaterialDonations,
    createMaterialDonation,
    addRequest,
    updateRequestStatus,
    updateRequest,
    addPartner,
    addVolunteer,
    updatePartner,
    removePartner,
    addWork,
    updateFundraising,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    createDoneWork,
    deleteDoneWork,
    updateDoneWork,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    fetchMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    fetchPrintModels,
    createPrintModel,
    updatePrintModel,
    deletePrintModel,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  }
})

