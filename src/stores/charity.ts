import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import requestsData from '@/data/requests.json'
import doneData from '@/data/done.json'
import partnersData from '@/data/partners.json'
import donationsData from '@/data/donations.json'
import resourcesData from '@/data/resources.json'

import materialDonationsData from '@/data/material_donations.json'
import fundraisingData from '@/data/fundraising.json'

interface Request {
  id: number
  name: string
  orphanage: string
  wish: string
  file_name?: string
  model_link?: string
  comment: string
  status: string
  date: string
}

interface Work {
  id: number
  title: string
  image: string
  description: string
  date: string
}

interface Partner {
  id: number
  name: string
  type: string
  printer_model: string
  materials: string[]
  capabilities?: string[] // deprecated, kept for compat
  about?: string
  contact?: string
  completed_works: number
  city: string
}

interface Resource {
  id: number
  category: string
  title: string
  url: string
  description: string
}

interface Donation {
  id: number
  name: string
  amount?: number
  item?: string
  date: string
}

interface Donations {
  financial: Donation[]
  material: Donation[]
}

interface MaterialDonation {
  id: number
  name: string
  item: string
  type: string
  comment: string
  date: string
}

interface FundraisingGoal {
  id: number
  title: string
  description: string
  target_amount: number
  current_amount: number
  image: string
}

export const useCharityStore = defineStore('charity', () => {
  // State
  const requests = ref<Request[]>(requestsData as Request[])
  const doneWorks = ref<Work[]>(doneData as Work[])
  const partners = ref<Partner[]>(partnersData as Partner[])
  const donations = ref<Donations>(donationsData as Donations)
  const resources = ref<Resource[]>(resourcesData as Resource[])
  const materialDonations = ref<MaterialDonation[]>(materialDonationsData as MaterialDonation[])
  const fundraisingGoals = ref<FundraisingGoal[]>(fundraisingData as FundraisingGoal[])

  // Getters
  const pendingRequests = computed(() => requests.value.filter(r => r.status === 'new'))
  const completedRequests = computed(() => requests.value.filter(r => r.status === 'completed'))
  const totalCompletedWorks = computed(() => doneWorks.value.length)
  const totalPartners = computed(() => partners.value.length)

  // Actions
  function addRequest(request: Omit<Request, 'id' | 'status' | 'date'>) {
    const newRequest: Request = {
      ...request,
      id: Date.now(),
      status: 'new',
      date: new Date().toISOString().split('T')[0]
    }
    requests.value.push(newRequest)
  }

  function updateRequestStatus(id: number, status: string) {
    const req = requests.value.find(r => r.id === id)
    if (req) {
      req.status = status
    }
  }

  function addPartner(partner: Omit<Partner, 'id' | 'completed_works'>) {
    const newPartner: Partner = {
      ...partner,
      id: Date.now(),
      completed_works: 0
    }
    partners.value.push(newPartner)
  }
  
  function updatePartner(id: number, updates: Partial<Partner>) {
    const partner = partners.value.find(p => p.id === id)
    if (partner) {
      Object.assign(partner, updates)
    }
  }
  
  function removePartner(id: number) {
    const index = partners.value.findIndex(p => p.id === id)
    if (index !== -1) partners.value.splice(index, 1)
  }

  function addWork(work: Omit<Work, 'id' | 'date'>) {
    const newWork: Work = {
      ...work,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    }
    doneWorks.value.push(newWork)
  }

  function addResource(resource: Omit<Resource, 'id'>) {
    resources.value.push({ ...resource, id: Date.now() })
  }

  function removeResource(id: number) {
    const index = resources.value.findIndex(r => r.id === id)
    if (index !== -1) resources.value.splice(index, 1)
  }
  
  function addMaterialDonation(donation: Omit<MaterialDonation, 'id' | 'date'>) {
    materialDonations.value.push({
      ...donation,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    })
  }
  
  function updateFundraising(id: number, updates: Partial<FundraisingGoal>) {
    const goal = fundraisingGoals.value.find(g => g.id === id)
    if (goal) {
      Object.assign(goal, updates)
    }
  }

  return {
    requests,
    doneWorks,
    partners,
    donations,
    resources,
    materialDonations,
    fundraisingGoals,
    pendingRequests,
    completedRequests,
    totalCompletedWorks,
    totalPartners,
    addRequest,
    updateRequestStatus,
    addPartner,
    updatePartner,
    removePartner,
    addWork,
    addResource,
    removeResource,
    addMaterialDonation,
    updateFundraising
  }
})

