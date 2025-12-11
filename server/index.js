import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { readFile, writeFile } from 'fs/promises'
import { randomUUID, createHmac } from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_PATH = path.join(__dirname, 'data.json')
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-me-secret'
const TOKEN_NAME = 'admin_token'

// Helpers --------------------------------------------------------------------
const signToken = () =>
  createHmac('sha256', ADMIN_SECRET).update(ADMIN_PASSWORD).digest('hex')

async function readData() {
  const raw = await readFile(DATA_PATH, 'utf-8')
  return JSON.parse(raw)
}

let writeQueue = Promise.resolve()
function writeData(data) {
  writeQueue = writeQueue.then(async () => {
    await writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
  })
  return writeQueue
}

// Сейчас доступ в админку открыт (требование: убрать пароль)
function requireAdmin(_req, _res, next) {
  next()
}

function createServer() {
  const app = express()
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  )
  app.use(cookieParser())
  app.use(express.json({ limit: '1mb' }))

  // Auth (заглушка, пароль отключен)
  app.post('/api/auth/login', (_req, res) => {
    res.json({ ok: true })
  })

  app.get('/api/auth/me', (_req, res) => {
    res.json({ ok: true })
  })

  // Public: create print request --------------------------------------------
  app.post('/api/print-requests', async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const newRequest = {
      id: randomUUID(),
      name: payload.name || '',
      orphanage: payload.orphanage || '',
      wish: payload.wish || '',
      file_name: payload.file_name || '',
      model_link: payload.model_link || '',
      comment: payload.comment || '',
      contact_name: payload.contact_name || '',
      contact_phone: payload.contact_phone || '',
      contact_email: payload.contact_email || '',
      status: 'new',
      date: new Date().toISOString().split('T')[0]
    }
    data.printRequests.push(newRequest)
    await writeData(data)
    res.json(newRequest)
  })

  // Public: list published campaigns ----------------------------------------
  app.get('/api/campaigns', async (_req, res) => {
    const data = await readData()
    const items = (data.campaigns || []).filter((c) => c.status === 'published')
    res.json(items)
  })

  // Public: create volunteer application ------------------------------------
  app.post('/api/volunteers', async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const volunteer = {
      id: randomUUID(),
      name: payload.name || '',
      type: payload.type || 'individual',
      city: payload.city || '',
      printer_model: payload.printer_model || '',
      materials: payload.materials || [],
      about: payload.about || '',
      contact: payload.contact || '',
      status: 'new',
      createdAt: new Date().toISOString()
    }
    data.volunteers.push(volunteer)
    await writeData(data)
    res.json(volunteer)
  })

  // Admin: print requests ----------------------------------------------------
  app.get('/api/admin/print-requests', requireAdmin, async (_req, res) => {
    const data = await readData()
    res.json(data.printRequests || [])
  })

  app.patch('/api/admin/print-requests/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const item = (data.printRequests || []).find((r) => r.id === req.params.id)
    if (!item) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    const fields = [
      'name',
      'orphanage',
      'wish',
      'file_name',
      'model_link',
      'comment',
      'contact_name',
      'contact_phone',
      'contact_email'
    ]
    for (const key of fields) {
      if (key in req.body) item[key] = req.body[key]
    }
    await writeData(data)
    res.json(item)
  })

  app.patch('/api/admin/print-requests/:id/status', requireAdmin, async (req, res) => {
    const data = await readData()
    const item = (data.printRequests || []).find((r) => r.id === req.params.id)
    if (!item) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    item.status = req.body?.status || item.status
    await writeData(data)
    res.json(item)
  })

  // Admin: volunteers --------------------------------------------------------
  app.get('/api/admin/volunteers', requireAdmin, async (_req, res) => {
    const data = await readData()
    res.json(data.volunteers || [])
  })

  app.patch('/api/admin/volunteers/:id/status', requireAdmin, async (req, res) => {
    const data = await readData()
    const item = (data.volunteers || []).find((v) => v.id === req.params.id)
    if (!item) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    item.status = req.body?.status || item.status
    await writeData(data)
    res.json(item)
  })

  // Admin: campaigns ---------------------------------------------------------
  app.get('/api/admin/campaigns', requireAdmin, async (_req, res) => {
    const data = await readData()
    res.json(data.campaigns || [])
  })

  app.post('/api/admin/campaigns', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const campaign = {
      id: randomUUID(),
      title: payload.title || '',
      description: payload.description || '',
      type: payload.type || 'materials',
      status: payload.status || 'draft',
      shortText: payload.shortText || '',
      heroImage: payload.heroImage || '',
      needs: payload.needs || [],
      progress: payload.progress || 0
    }
    data.campaigns.push(campaign)
    await writeData(data)
    res.json(campaign)
  })

  app.patch('/api/admin/campaigns/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const item = (data.campaigns || []).find((c) => c.id === req.params.id)
    if (!item) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(item, req.body || {})
    await writeData(data)
    res.json(item)
  })

  app.delete('/api/admin/campaigns/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const before = data.campaigns.length
    data.campaigns = (data.campaigns || []).filter((c) => c.id !== req.params.id)
    if (data.campaigns.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    await writeData(data)
    res.json({ ok: true })
  })

  app.patch('/api/admin/campaign-needs/:needId', requireAdmin, async (req, res) => {
    const data = await readData()
    let found = null
    for (const campaign of data.campaigns || []) {
      const need = (campaign.needs || []).find((n) => n.id === req.params.needId)
      if (need) {
        Object.assign(need, req.body || {})
        found = need
        break
      }
    }
    if (!found) {
      return res.status(404).json({ error: { message: 'Need not found' } })
    }
    await writeData(data)
    res.json(found)
  })

  // Admin: donations history stub ------------------------------------------
  app.post('/api/admin/donations-history', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const donation = {
      id: randomUUID(),
      date: payload.date || new Date().toISOString(),
      amount: payload.amount || 0,
      method: payload.method || 'transfer',
      comment: payload.comment || ''
    }
    data.donationsHistory.push(donation)
    await writeData(data)
    res.json(donation)
  })

  // Public/ Admin: done works (gallery) --------------------------------------
  app.get('/api/done-works', async (_req, res) => {
    const data = await readData()
    res.json(data.doneWorks || [])
  })

  app.get('/api/admin/done-works', requireAdmin, async (_req, res) => {
    const data = await readData()
    res.json(data.doneWorks || [])
  })

  app.post('/api/admin/done-works', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const work = {
      id: randomUUID(),
      title: payload.title || '',
      image: payload.image || '',
      description: payload.description || '',
      date: payload.date || new Date().toISOString().split('T')[0]
    }
    data.doneWorks.push(work)
    await writeData(data)
    res.json(work)
  })

  app.delete('/api/admin/done-works/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const before = data.doneWorks.length
    data.doneWorks = (data.doneWorks || []).filter((w) => w.id !== req.params.id)
    if (data.doneWorks.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    await writeData(data)
    res.json({ ok: true })
  })

  app.patch('/api/admin/done-works/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const work = (data.doneWorks || []).find((w) => w.id === req.params.id)
    if (!work) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    const fields = ['title', 'image', 'description', 'date']
    for (const key of fields) {
      if (key in req.body) work[key] = req.body[key]
    }
    await writeData(data)
    res.json(work)
  })

  // Admin: partners ----------------------------------------------------------
  app.get('/api/admin/partners', requireAdmin, async (_req, res) => {
    const data = await readData()
    res.json(data.partners || [])
  })

  app.post('/api/admin/partners', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const partner = {
      id: randomUUID(),
      name: payload.name || '',
      type: payload.type || '',
      city: payload.city || '',
      contact: payload.contact || '',
      printer_model: payload.printer_model || '',
      materials: payload.materials || [],
      about: payload.about || '',
      completed_works: payload.completed_works || 0
    }
    data.partners.push(partner)
    await writeData(data)
    res.json(partner)
  })

  app.patch('/api/admin/partners/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const partner = (data.partners || []).find((p) => p.id === req.params.id)
    if (!partner) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    const fields = ['name', 'type', 'city', 'contact', 'printer_model', 'materials', 'about', 'completed_works']
    for (const key of fields) {
      if (key in req.body) partner[key] = req.body[key]
    }
    await writeData(data)
    res.json(partner)
  })

  app.delete('/api/admin/partners/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const before = data.partners.length
    data.partners = (data.partners || []).filter((p) => p.id !== req.params.id)
    if (data.partners.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    await writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Articles -----------------------------------------------------
  app.get('/api/articles', async (_req, res) => {
    const data = await readData()
    res.json(data.articles || [])
  })

  app.get('/api/admin/articles', requireAdmin, async (_req, res) => {
    const data = await readData()
    res.json(data.articles || [])
  })

  app.post('/api/admin/articles', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const article = {
      id: randomUUID(),
      title: payload.title || '',
      content: payload.content || '',
      author: payload.author || '',
      date: payload.date || new Date().toISOString(),
      image: payload.image || '',
      category: payload.category || ''
    }
    data.articles = data.articles || []
    data.articles.push(article)
    await writeData(data)
    res.json(article)
  })

  app.patch('/api/admin/articles/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const article = (data.articles || []).find((a) => a.id === req.params.id)
    if (!article) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(article, req.body || {})
    await writeData(data)
    res.json(article)
  })

  app.delete('/api/admin/articles/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const before = (data.articles || []).length
    data.articles = (data.articles || []).filter((a) => a.id !== req.params.id)
    if (data.articles.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    await writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Videos ------------------------------------------------------
  app.get('/api/videos', async (_req, res) => {
    const data = await readData()
    res.json(data.videos || [])
  })

  app.get('/api/admin/videos', requireAdmin, async (_req, res) => {
    const data = await readData()
    res.json(data.videos || [])
  })

  app.post('/api/admin/videos', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const video = {
      id: randomUUID(),
      title: payload.title || '',
      url: payload.url || '',
      description: payload.description || '',
      thumbnail: payload.thumbnail || '',
      date: payload.date || new Date().toISOString(),
      duration: payload.duration || ''
    }
    data.videos = data.videos || []
    data.videos.push(video)
    await writeData(data)
    res.json(video)
  })

  app.patch('/api/admin/videos/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const video = (data.videos || []).find((v) => v.id === req.params.id)
    if (!video) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(video, req.body || {})
    await writeData(data)
    res.json(video)
  })

  app.delete('/api/admin/videos/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const before = (data.videos || []).length
    data.videos = (data.videos || []).filter((v) => v.id !== req.params.id)
    if (data.videos.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    await writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Materials ---------------------------------------------------
  app.get('/api/materials', async (_req, res) => {
    const data = await readData()
    res.json(data.materials || [])
  })

  app.get('/api/admin/materials', requireAdmin, async (_req, res) => {
    const data = await readData()
    res.json(data.materials || [])
  })

  app.post('/api/admin/materials', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const material = {
      id: randomUUID(),
      title: payload.title || '',
      type: payload.type || '',
      fileUrl: payload.fileUrl || '',
      description: payload.description || '',
      date: payload.date || new Date().toISOString(),
      size: payload.size || ''
    }
    data.materials = data.materials || []
    data.materials.push(material)
    await writeData(data)
    res.json(material)
  })

  app.patch('/api/admin/materials/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const material = (data.materials || []).find((m) => m.id === req.params.id)
    if (!material) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(material, req.body || {})
    await writeData(data)
    res.json(material)
  })

  app.delete('/api/admin/materials/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const before = (data.materials || []).length
    data.materials = (data.materials || []).filter((m) => m.id !== req.params.id)
    if (data.materials.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    await writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Print Models -------------------------------------------------
  app.get('/api/print-models', async (_req, res) => {
    const data = await readData()
    res.json(data.printModels || [])
  })

  app.get('/api/admin/print-models', requireAdmin, async (_req, res) => {
    const data = await readData()
    res.json(data.printModels || [])
  })

  app.post('/api/admin/print-models', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const model = {
      id: randomUUID(),
      name: payload.name || '',
      description: payload.description || '',
      category: payload.category || '',
      fileUrl: payload.fileUrl || '',
      imageUrl: payload.imageUrl || '',
      printTime: payload.printTime || '',
      materialType: payload.materialType || '',
      date: payload.date || new Date().toISOString()
    }
    data.printModels = data.printModels || []
    data.printModels.push(model)
    await writeData(data)
    res.json(model)
  })

  app.patch('/api/admin/print-models/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const model = (data.printModels || []).find((m) => m.id === req.params.id)
    if (!model) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(model, req.body || {})
    await writeData(data)
    res.json(model)
  })

  app.delete('/api/admin/print-models/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const before = (data.printModels || []).length
    data.printModels = (data.printModels || []).filter((m) => m.id !== req.params.id)
    if (data.printModels.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    await writeData(data)
    res.json({ ok: true })
  })

  // Public/Admin: Projects ----------------------------------------------------
  app.get('/api/projects', async (_req, res) => {
    const data = await readData()
    res.json(data.projects || [])
  })

  app.get('/api/admin/projects', requireAdmin, async (_req, res) => {
    const data = await readData()
    res.json(data.projects || [])
  })

  app.post('/api/admin/projects', requireAdmin, async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const project = {
      id: randomUUID(),
      title: payload.title || '',
      description: payload.description || '',
      shortDescription: payload.shortDescription || '',
      status: payload.status || 'planned',
      category: payload.category || '',
      heroImage: payload.heroImage || '',
      startDate: payload.startDate || new Date().toISOString(),
      endDate: payload.endDate || '',
      photos: payload.photos || [],
      videos: payload.videos || [],
      reports: payload.reports || [],
      videoReports: payload.videoReports || [],
      mediaLinks: payload.mediaLinks || [],
      beneficiaries: payload.beneficiaries || '',
      impact: payload.impact || '',
      partners: payload.partners || [],
      budget: payload.budget || 0,
      raised: payload.raised || 0
    }
    data.projects = data.projects || []
    data.projects.push(project)
    await writeData(data)
    res.json(project)
  })

  app.patch('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const project = (data.projects || []).find((p) => p.id === req.params.id)
    if (!project) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    Object.assign(project, req.body || {})
    await writeData(data)
    res.json(project)
  })

  app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    const data = await readData()
    const before = (data.projects || []).length
    data.projects = (data.projects || []).filter((p) => p.id !== req.params.id)
    if (data.projects.length === before) {
      return res.status(404).json({ error: { message: 'Not found' } })
    }
    await writeData(data)
    res.json({ ok: true })
  })

  // Public: Contact Form -----------------------------------------------------
  app.post('/api/contacts/send', async (req, res) => {
    const payload = req.body || {}
    const data = await readData()
    const contact = {
      id: randomUUID(),
      name: payload.name || '',
      email: payload.email || '',
      phone: payload.phone || '',
      message: payload.message || '',
      date: new Date().toISOString()
    }
    data.contacts = data.contacts || []
    data.contacts.push(contact)
    await writeData(data)
    res.json({ success: true, message: 'Сообщение отправлено', data: contact })
  })

  return app
}

const PORT = process.env.PORT || 3000
createServer().listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})

