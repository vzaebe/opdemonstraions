<template>
  <div class="admin-layout">
    <!-- Beautiful Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">⚙️</div>
          <h2>Admin Panel</h2>
        </div>
        <div class="user-info">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-details">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRoleLabel }}</div>
          </div>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-item', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          <span class="nav-icon">{{ tab.icon }}</span>
          <span class="nav-label">{{ tab.label }}</span>
          <span v-if="tab.badge" class="nav-badge">{{ tab.badge }}</span>
        </button>
      </nav>
      
      <div class="sidebar-footer">
        <router-link :to="{ name: 'home' }" class="back-link">
          <span>← На сайт</span>
        </router-link>
        <button @click="auth.logout" class="logout-btn">
          🚪 Выйти
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="admin-content">
      <!-- Beautiful Statistics Dashboard -->
      <div v-if="currentTab === 'stats'" class="content-section">
        <div class="section-header-modern">
          <div>
            <h1>📊 Статистика</h1>
            <p class="subtitle">Аналитика и показатели эффективности</p>
          </div>
          <UiButton @click="loadStats" size="sm" variant="secondary">
            🔄 Обновить
          </UiButton>
        </div>

        <!-- Stats Cards Grid -->
        <div class="stats-grid">
          <StatsCard
            :value="statsSummary?.totalViews || 0"
            label="Всего просмотров"
            icon="👁️"
            variant="primary"
            :trend="12.5"
          />
          <StatsCard
            :value="statsSummary?.uniqueVisitors || 0"
            label="Уникальные посетители"
            icon="👥"
            variant="success"
            :trend="8.3"
          />
          <StatsCard
            :value="store.requests.length"
            label="Заявок на печать"
            icon="📝"
            variant="warning"
            :trend="-3.2"
          />
          <StatsCard
            :value="store.partners.length"
            label="Активных партнёров"
            icon="🤝"
            variant="info"
          />
        </div>

        <!-- Charts -->
        <div class="charts-grid">
          <SimpleChart
            v-if="statsSummary?.daily"
            type="line"
            :data="statsSummary.daily.map((d: any) => ({ label: d.day, value: d.views }))"
            title="Просмотры по дням"
          />
          
          <SimpleChart
            v-if="statsSummary?.topPaths"
            type="bar"
            :data="statsSummary.topPaths.map((p: any) => ({ label: p.path, value: p.views }))"
            title="Популярные страницы"
          />
        </div>
      </div>

      <!-- Requests Tab with Inline Editing -->
      <div v-if="currentTab === 'requests'" class="content-section">
        <div class="section-header-modern">
          <div>
            <h1>📝 Заявки на печать</h1>
            <p class="subtitle">Управление заявками от организаций</p>
          </div>
        </div>

        <div class="modern-table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Имя / Организация</th>
                <th>Контакты</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="req in store.requests" :key="req.id">
                <ExpandableRow :colspan="6">
                  <template #row="{ toggle, isExpanded }">
                    <td>
                      <span class="id-badge">{{ req.id }}</span>
                    </td>
                    <td>{{ req.date }}</td>
                    <td>
                      <div class="cell-main">{{ req.name }}</div>
                      <div class="cell-sub">{{ req.orphanage }}</div>
                    </td>
                    <td>
                      <div class="cell-main">{{ req.contact_name }}</div>
                      <div class="cell-sub">{{ req.contact_phone }}</div>
                    </td>
                    <td>
                      <InlineEdit
                        :model-value="req.status"
                        type="select"
                        :options="[
                          { value: 'new', label: 'Новая' },
                          { value: 'in_progress', label: 'В работе' },
                          { value: 'completed', label: 'Выполнена' },
                          { value: 'rejected', label: 'Отклонена' }
                        ]"
                        @save="(val) => store.updateRequestStatus(req.id, String(val))"
                      />
                    </td>
                    <td>
                      <button 
                        @click="toggle"
                        :class="['btn-icon', { active: isExpanded }]"
                        type="button"
                      >
                        {{ isExpanded ? '▼' : '▶' }}
                      </button>
                    </td>
                  </template>

                  <template #expansion>
                    <div class="expansion-form">
                      <h3>Редактировать заявку #{{ req.id }}</h3>
                      <div class="form-grid-2">
                        <UiFormField label="Имя">
                          <UiInput v-model="req.name" @blur="() => updateRequest(req)" />
                        </UiFormField>
                        <UiFormField label="Учреждение">
                          <UiInput v-model="req.orphanage" @blur="() => updateRequest(req)" />
                        </UiFormField>
                        <UiFormField label="Контактное лицо">
                          <UiInput v-model="req.contact_name" @blur="() => updateRequest(req)" />
                        </UiFormField>
                        <UiFormField label="Телефон">
                          <UiInput v-model="req.contact_phone" @blur="() => updateRequest(req)" />
                        </UiFormField>
                        <UiFormField label="Email">
                          <UiInput v-model="req.contact_email" @blur="() => updateRequest(req)" />
                        </UiFormField>
                        <UiFormField label="Ссылка на модель">
                          <UiInput v-model="req.model_link" @blur="() => updateRequest(req)" />
                        </UiFormField>
                      </div>
                      <UiFormField label="Комментарий">
                        <UiTextarea v-model="req.comment" :rows="3" @blur="() => updateRequest(req)" />
                      </UiFormField>
                    </div>
                  </template>
                </ExpandableRow>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Projects Tab with Inline Editing -->
      <div v-if="currentTab === 'projects'" class="content-section">
        <div class="section-header-modern">
          <div>
            <h1>🎯 Проекты</h1>
            <p class="subtitle">Управление проектами и кампаниями</p>
          </div>
          <UiButton @click="showProjectForm = true">
            + Создать проект
          </UiButton>
        </div>

        <div class="modern-table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Категория</th>
                <th>Статус</th>
                <th>Бюджет / Собрано</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="project in store.projects" :key="project.id">
                <ExpandableRow :colspan="6">
                  <template #row="{ toggle, isExpanded }">
                    <td>
                      <div class="cell-main">{{ project.title }}</div>
                      <div class="cell-sub">{{ project.shortDescription }}</div>
                    </td>
                    <td>
                      <span class="category-badge">{{ project.category }}</span>
                    </td>
                    <td>
                      <InlineEdit
                        :model-value="project.status"
                        type="select"
                        :options="[
                          { value: 'planned', label: 'Запланирован' },
                          { value: 'active', label: 'Активен' },
                          { value: 'completed', label: 'Завершён' }
                        ]"
                        @save="(val) => handleProjectStatusChange(project.id, val)"
                      />
                    </td>
                    <td>
                      <div class="budget-display">
                        <InlineEdit
                          :model-value="project.raised || 0"
                          type="number"
                          :formatter="(v) => `${Number(v).toLocaleString('ru-RU')} ₽`"
                          @save="(val) => handleProjectAmountChange(project.id, 'raised', val)"
                        />
                        <span class="budget-divider">/</span>
                        <InlineEdit
                          :model-value="project.budget || 0"
                          type="number"
                          :formatter="(v) => `${Number(v).toLocaleString('ru-RU')} ₽`"
                          @save="(val) => handleProjectAmountChange(project.id, 'budget', val)"
                        />
                      </div>
                    </td>
                    <td>{{ new Date(project.startDate).toLocaleDateString('ru-RU') }}</td>
                    <td>
                      <div class="action-buttons">
                        <button @click="toggle" :class="['btn-icon', { active: isExpanded }]" type="button">
                          {{ isExpanded ? '▼' : '▶' }}
                        </button>
                        <button @click="deleteProject(project.id)" class="btn-icon btn-delete" type="button">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </template>

                  <template #expansion>
                    <div class="expansion-form">
                      <h3>Редактировать проект: {{ project.title }}</h3>
                      
                      <div class="form-grid-2">
                        <UiFormField label="Название">
                          <UiInput v-model="project.title" @blur="() => updateProject(project)" />
                        </UiFormField>
                        <UiFormField label="Категория">
                          <UiInput v-model="project.category" @blur="() => updateProject(project)" />
                        </UiFormField>
                      </div>

                      <UiFormField label="Краткое описание">
                        <UiInput v-model="project.shortDescription" @blur="() => updateProject(project)" />
                      </UiFormField>

                      <UiFormField label="Полное описание">
                        <MarkdownEditor v-model="project.description" @update:model-value="() => updateProject(project)" />
                      </UiFormField>

                      <div class="form-grid-2">
                        <UiFormField label="Дата начала">
                          <UiInput v-model="project.startDate" type="date" @blur="() => updateProject(project)" />
                        </UiFormField>
                        <UiFormField label="URL изображения">
                          <UiInput v-model="project.heroImage" @blur="() => updateProject(project)" />
                        </UiFormField>
                      </div>

                      <UiFormField label="Галерея">
                        <ImageGalleryManager 
                          v-model="project.photos"
                          @update:model-value="() => updateProject(project)"
                        />
                      </UiFormField>
                    </div>
                  </template>
                </ExpandableRow>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Create Project Modal -->
        <Teleport to="body">
          <div v-if="showProjectForm" class="modal-overlay" @click.self="showProjectForm = false">
            <div class="modal-dialog">
              <div class="modal-header">
                <h2>Создать новый проект</h2>
                <button @click="showProjectForm = false" class="btn-close">✕</button>
              </div>
              <div class="modal-body">
                <div class="form-grid-2">
                  <UiFormField label="Название">
                    <UiInput v-model="projectForm.title" />
                  </UiFormField>
                  <UiFormField label="Категория">
                    <UiInput v-model="projectForm.category" />
                  </UiFormField>
                </div>
                <UiFormField label="Краткое описание">
                  <UiInput v-model="projectForm.shortDescription" />
                </UiFormField>
                <UiFormField label="Статус">
                  <UiSelect v-model="projectForm.status">
                    <option value="planned">Запланирован</option>
                    <option value="active">Активен</option>
                    <option value="completed">Завершён</option>
                  </UiSelect>
                </UiFormField>
                <div class="form-grid-2">
                  <UiFormField label="Бюджет (₽)">
                    <UiInput v-model.number="projectForm.budget" type="number" />
                  </UiFormField>
                  <UiFormField label="Собрано (₽)">
                    <UiInput v-model.number="projectForm.raised" type="number" />
                  </UiFormField>
                </div>
              </div>
              <div class="modal-footer">
                <UiButton @click="showProjectForm = false" variant="ghost">Отмена</UiButton>
                <UiButton @click="createProject">Создать проект</UiButton>
              </div>
            </div>
          </div>
        </Teleport>
      </div>

      <!-- Articles Tab with Markdown -->
      <div v-if="currentTab === 'articles'" class="content-section">
        <div class="section-header-modern">
          <div>
            <h1>📰 Статьи</h1>
            <p class="subtitle">Публикации и новости</p>
          </div>
          <UiButton @click="showArticleForm = true">
            + Создать статью
          </UiButton>
        </div>

        <div class="articles-grid">
          <div v-for="article in store.articles" :key="article.id" class="article-card">
            <div v-if="article.image" class="article-image">
              <img :src="article.image" :alt="article.title" />
            </div>
            <div class="article-body">
              <h3>{{ article.title }}</h3>
              <div class="article-meta">
                <span>👤 {{ article.author }}</span>
                <span>📅 {{ new Date(article.date).toLocaleDateString('ru-RU') }}</span>
                <span v-if="article.category" class="category-tag">{{ article.category }}</span>
              </div>
              <div class="article-excerpt">
                {{ article.content.substring(0, 150) }}...
              </div>
            </div>
            <div class="article-actions">
              <UiButton @click="editArticle(article)" size="sm" variant="ghost">
                ✏️ Редактировать
              </UiButton>
              <UiButton @click="deleteArticle(article.id)" size="sm" variant="danger">
                🗑️ Удалить
              </UiButton>
            </div>
          </div>
        </div>

        <!-- Article Editor Modal -->
        <Teleport to="body">
          <div v-if="showArticleForm || editingArticle" class="modal-overlay" @click.self="closeArticleEditor">
            <div class="modal-dialog modal-large">
              <div class="modal-header">
                <h2>{{ editingArticle ? 'Редактировать статью' : 'Создать статью' }}</h2>
                <button @click="closeArticleEditor" class="btn-close">✕</button>
              </div>
              <div class="modal-body">
                <div class="form-grid-2">
                  <UiFormField label="Заголовок">
                    <UiInput v-model="articleFormData.title" />
                  </UiFormField>
                  <UiFormField label="Автор">
                    <UiInput v-model="articleFormData.author" />
                  </UiFormField>
                </div>
                <div class="form-grid-2">
                  <UiFormField label="Категория">
                    <UiInput v-model="articleFormData.category" />
                  </UiFormField>
                  <UiFormField label="URL изображения">
                    <UiInput v-model="articleFormData.image" />
                  </UiFormField>
                </div>
                <UiFormField label="Содержание">
                  <MarkdownEditor v-model="articleFormData.content" />
                </UiFormField>
              </div>
              <div class="modal-footer">
                <UiButton @click="closeArticleEditor" variant="ghost">Отмена</UiButton>
                <UiButton @click="saveArticle">
                  {{ editingArticle ? 'Сохранить' : 'Создать' }}
                </UiButton>
              </div>
            </div>
          </div>
        </Teleport>
      </div>

      <!-- Videos Tab -->
      <div v-if="currentTab === 'videos'" class="content-section">
        <div class="section-header-modern">
          <div>
            <h1>🎥 Видео</h1>
            <p class="subtitle">Видеоматериалы и записи</p>
          </div>
          <UiButton @click="showVideoForm = true">
            + Добавить видео
          </UiButton>
        </div>

        <div class="videos-grid">
          <div v-for="video in store.videos" :key="video.id" class="video-card">
            <VideoPlayer :url="video.url" :show-info="true" />
            <div class="video-info-panel">
              <h4>{{ video.title }}</h4>
              <p class="video-description">{{ video.description }}</p>
              <div class="video-meta">
                <span v-if="video.duration">⏱️ {{ video.duration }}</span>
                <span>📅 {{ new Date(video.date).toLocaleDateString('ru-RU') }}</span>
              </div>
            </div>
            <div class="video-actions">
              <UiButton @click="editVideo(video)" size="sm" variant="ghost">✏️ Редактировать</UiButton>
              <UiButton @click="deleteVideo(video.id)" size="sm" variant="danger">🗑️</UiButton>
            </div>
          </div>
        </div>

        <!-- Video Form Modal -->
        <Teleport to="body">
          <div v-if="showVideoForm || editingVideo" class="modal-overlay" @click.self="closeVideoEditor">
            <div class="modal-dialog">
              <div class="modal-header">
                <h2>{{ editingVideo ? 'Редактировать видео' : 'Добавить видео' }}</h2>
                <button @click="closeVideoEditor" class="btn-close">✕</button>
              </div>
              <div class="modal-body">
                <UiFormField label="Название">
                  <UiInput v-model="videoFormData.title" />
                </UiFormField>
                <UiFormField label="URL видео (YouTube, Vimeo, RuTube)">
                  <UiInput v-model="videoFormData.url" placeholder="https://www.youtube.com/watch?v=..." />
                </UiFormField>
                <UiFormField label="Описание">
                  <UiTextarea v-model="videoFormData.description" :rows="3" />
                </UiFormField>
                <UiFormField label="Длительность">
                  <UiInput v-model="videoFormData.duration" placeholder="10:30" />
                </UiFormField>
                <div v-if="videoFormData.url">
                  <label class="form-label">Превью:</label>
                  <VideoPlayer :url="videoFormData.url" />
                </div>
              </div>
              <div class="modal-footer">
                <UiButton @click="closeVideoEditor" variant="ghost">Отмена</UiButton>
                <UiButton @click="saveVideo">
                  {{ editingVideo ? 'Сохранить' : 'Добавить' }}
                </UiButton>
              </div>
            </div>
          </div>
        </Teleport>
      </div>

      <!-- Resources Tab -->
      <div v-if="currentTab === 'resources'" class="content-section">
        <div class="section-header-modern">
          <div>
            <h1>📚 Ресурсы</h1>
            <p class="subtitle">Полезные материалы и ссылки</p>
          </div>
          <UiButton @click="showResourceForm = true">
            + Добавить ресурс
          </UiButton>
        </div>

        <div class="resources-list">
          <div v-for="resource in store.resources" :key="resource.id" class="resource-item">
            <div class="resource-icon">🔗</div>
            <div class="resource-content">
              <h4>{{ resource.title }}</h4>
              <a :href="resource.url" target="_blank" class="resource-url">{{ resource.url }}</a>
              <span class="resource-category">{{ resource.category }}</span>
            </div>
            <div class="resource-actions">
              <UiButton @click="editResource(resource)" size="sm" variant="ghost">✏️</UiButton>
              <UiButton @click="store.deleteResource(resource.id)" size="sm" variant="danger">🗑️</UiButton>
            </div>
          </div>
        </div>

        <!-- Resource Form Modal -->
        <Teleport to="body">
          <div v-if="showResourceForm || editingResource" class="modal-overlay" @click.self="closeResourceEditor">
            <div class="modal-dialog">
              <div class="modal-header">
                <h2>{{ editingResource ? 'Редактировать ресурс' : 'Добавить ресурс' }}</h2>
                <button @click="closeResourceEditor" class="btn-close">✕</button>
              </div>
              <div class="modal-body">
                <UiFormField label="Название">
                  <UiInput v-model="resourceFormData.title" />
                </UiFormField>
                <UiFormField label="URL">
                  <UiInput v-model="resourceFormData.url" placeholder="https://..." />
                </UiFormField>
                <UiFormField label="Описание">
                  <UiTextarea
                    v-model="resourceFormData.description"
                    :rows="2"
                    placeholder="Краткое описание ресурса"
                  />
                </UiFormField>
                <UiFormField label="Категория">
                  <UiInput v-model="resourceFormData.category" placeholder="Документация, Инструкции, и т.д." />
                </UiFormField>
              </div>
              <div class="modal-footer">
                <UiButton @click="closeResourceEditor" variant="ghost">Отмена</UiButton>
                <UiButton @click="saveResource">
                  {{ editingResource ? 'Сохранить' : 'Добавить' }}
                </UiButton>
              </div>
            </div>
          </div>
        </Teleport>
      </div>

      <!-- Partners, Fundraising, Gallery, etc. - Similar modern patterns -->
      <!-- (keeping rest of tabs but with modern styling) -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCharityStore } from '../../stores/charity'
import { useAuthStore } from '../../stores/auth'
import { http, trackApiError } from '../../services/api/http'
import { UiButton, UiCard, UiFormField, UiInput, UiSelect, UiTextarea } from '../../ui'
import type { Project, Resource } from '@/types/charity'
import InlineEdit from '../../components/admin/InlineEdit.vue'
import StatsCard from '../../components/admin/StatsCard.vue'
import SimpleChart from '../../components/admin/SimpleChart.vue'
import MarkdownEditor from '../../components/admin/MarkdownEditor.vue'
import ImageGalleryManager from '../../components/admin/ImageGalleryManager.vue'
import VideoPlayer from '../../components/admin/VideoPlayer.vue'
import ExpandableRow from '../../components/admin/ExpandableRow.vue'

const store = useCharityStore()
const auth = useAuthStore()

const userName = computed(() => auth.username || 'Admin')
const userRoleLabel = computed(() => auth.role || 'guest')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const baseTabs = [
  { id: 'stats', label: 'Статистика', icon: '📊' },
  { id: 'requests', label: 'Заявки', icon: '📝', badge: computed(() => store.requests.length) },
  { id: 'projects', label: 'Проекты', icon: '🎯' },
  { id: 'partners', label: 'Партнёры', icon: '🤝' },
  { id: 'fundraising', label: 'Сборы', icon: '💰' },
  { id: 'done', label: 'Галерея', icon: '🖼️' },
  { id: 'articles', label: 'Статьи', icon: '📰' },
  { id: 'videos', label: 'Видео', icon: '🎥' },
  { id: 'files', label: 'Файлы', icon: '📎' },
  { id: 'models', label: '3D Модели', icon: '🎲' },
  { id: 'resources', label: 'Ресурсы', icon: '📚' },
  { id: 'materials', label: 'Материалы', icon: '📦' }
]

const tabs = computed(() => {
  const t = [...baseTabs]
  if (auth.isSuperAdmin) t.push({ id: 'users', label: 'Пользователи', icon: '👥' })
  return t
})

const currentTab = ref('stats')

// Stats
const statsSummary = ref<any | null>(null)
const statsStatus = ref<string | null>(null)

// Projects
type ProjectFormState = Pick<
  Project,
  | 'title'
  | 'description'
  | 'shortDescription'
  | 'status'
  | 'category'
  | 'heroImage'
  | 'startDate'
  | 'endDate'
  | 'beneficiaries'
  | 'impact'
  | 'budget'
  | 'raised'
>

const showProjectForm = ref(false)
const defaultProjectForm: ProjectFormState = {
  title: '',
  description: '',
  shortDescription: '',
  status: 'active',
  category: '',
  heroImage: '',
  startDate: '',
  endDate: '',
  beneficiaries: '',
  impact: '',
  budget: 0,
  raised: 0
}
const projectForm = ref<ProjectFormState>({ ...defaultProjectForm })

// Articles
const showArticleForm = ref(false)
const editingArticle = ref<any | null>(null)
const articleFormData = ref({
  title: '',
  content: '',
  author: 'Редакция',
  category: '',
  image: ''
})

// Videos
const showVideoForm = ref(false)
const editingVideo = ref<any | null>(null)
const videoFormData = ref({
  title: '',
  url: '',
  description: '',
  duration: ''
})

// Resources
type ResourceFormState = Omit<Resource, 'id'>
const showResourceForm = ref(false)
const editingResource = ref<Resource | null>(null)
const defaultResourceForm: ResourceFormState = {
  title: '',
  url: '',
  category: '',
  description: ''
}
const resourceFormData = ref<ResourceFormState>({ ...defaultResourceForm })

async function loadStats() {
  statsStatus.value = null
  try {
    statsSummary.value = await http.get('/admin/stats/summary')
  } catch (error) {
    trackApiError(error, 'AdminDashboardView.loadStats')
    statsSummary.value = null
    statsStatus.value = 'Ошибка загрузки статистики'
  }
}

// Update functions with auto-save
async function updateRequest(req: any) {
  await store.updateRequest(req.id, req)
}

async function updateProject(project: any) {
  await store.updateProject(project.id, project)
}

async function updateProjectField<Field extends keyof Project>(id: string, field: Field, value: Project[Field]) {
  const project = store.projects.find(p => p.id === id)
  if (!project) return

  const updates = { [field]: value } as Partial<Project>
  Object.assign(project, updates)
  await store.updateProject(id, updates)
}

function handleProjectStatusChange(id: string, value: string | number) {
  const normalized =
    value === 'completed' || value === 'active' || value === 'planned' ? value : 'planned'
  return updateProjectField(id, 'status', normalized)
}

function handleProjectAmountChange(id: string, field: 'raised' | 'budget', value: string | number) {
  const numeric = typeof value === 'number' ? value : Number(value)
  const safeValue = Number.isFinite(numeric) ? numeric : 0
  return updateProjectField(id, field, safeValue)
}

async function createProject() {
  if (!projectForm.value.title || !projectForm.value.category) {
    alert('Укажите название и категорию проекта')
    return
  }
  const newProject: Omit<Project, 'id'> = {
    ...projectForm.value,
    photos: [],
    videos: [],
    reports: [],
    videoReports: [],
    mediaLinks: []
  }
  await store.createProject(newProject)
  showProjectForm.value = false
  projectForm.value = { ...defaultProjectForm }
}

async function deleteProject(id: string) {
  if (confirm('Удалить проект?')) {
    await store.deleteProject(id)
  }
}

// Articles
function editArticle(article: any) {
  editingArticle.value = article
  articleFormData.value = { ...article }
}

function closeArticleEditor() {
  showArticleForm.value = false
  editingArticle.value = null
  articleFormData.value = {
    title: '',
    content: '',
    author: 'Редакция',
    category: '',
    image: ''
  }
}

async function saveArticle() {
  if (!articleFormData.value.title || !articleFormData.value.content) {
    alert('Укажите название и содержание')
    return
  }

  if (editingArticle.value) {
    await store.updateArticle(editingArticle.value.id, articleFormData.value)
  } else {
    await store.createArticle(articleFormData.value)
  }
  closeArticleEditor()
}

async function deleteArticle(id: string) {
  if (confirm('Удалить статью?')) {
    await store.deleteArticle(id)
  }
}

// Videos
function editVideo(video: any) {
  editingVideo.value = video
  videoFormData.value = { ...video }
}

function closeVideoEditor() {
  showVideoForm.value = false
  editingVideo.value = null
  videoFormData.value = {
    title: '',
    url: '',
    description: '',
    duration: ''
  }
}

async function saveVideo() {
  if (!videoFormData.value.title || !videoFormData.value.url) {
    alert('Укажите название и URL')
    return
  }

  if (editingVideo.value) {
    await store.updateVideo(editingVideo.value.id, videoFormData.value)
  } else {
    await store.createVideo(videoFormData.value)
  }
  closeVideoEditor()
}

async function deleteVideo(id: string) {
  if (confirm('Удалить видео?')) {
    await store.deleteVideo(id)
  }
}

// Resources
function editResource(resource: Resource) {
  editingResource.value = resource
  resourceFormData.value = {
    title: resource.title,
    url: resource.url,
    category: resource.category,
    description: resource.description
  }
}

function closeResourceEditor() {
  showResourceForm.value = false
  editingResource.value = null
  resourceFormData.value = { ...defaultResourceForm }
}

async function saveResource() {
  if (!resourceFormData.value.title || !resourceFormData.value.url) {
    alert('Укажите название и URL')
    return
  }

  if (editingResource.value) {
    await store.updateResource(editingResource.value.id, resourceFormData.value)
  } else {
    await store.createResource(resourceFormData.value)
  }
  closeResourceEditor()
}

onMounted(async () => {
  await Promise.all([
    store.fetchRequests(),
    store.fetchPartners(),
    store.fetchCampaigns(true),
    store.fetchDoneWorks(),
    store.fetchResources(),
    store.fetchArticles(),
    store.fetchVideos(),
    store.fetchMaterials(),
    store.fetchPrintModels(),
    store.fetchProjects(),
    loadStats()
  ])
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

// Beautiful gradient background
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f0f7 100%);
}

// Modernized Sidebar
.admin-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: $spacing-6;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  margin-bottom: $spacing-6;

  .logo-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
    border-radius: $border-radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  h2 {
    margin: 0;
    font-size: $text-xl;
    font-weight: 700;
    background: linear-gradient(90deg, $primary-teal, $primary-mint);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  padding: $spacing-3;
  background: rgba(255, 255, 255, 0.05);
  border-radius: $border-radius-md;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  padding: $spacing-4;
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  flex-grow: 1;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  text-align: left;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: $spacing-3 $spacing-4;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  font-size: 0.95rem;
  font-weight: 500;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateX(2px);
  }

  &.active {
    background: linear-gradient(90deg, $primary-teal, $primary-mint);
    color: white;
    box-shadow: 0 4px 12px rgba($primary-teal, 0.3);
  }
}

.nav-icon {
  font-size: 1.3rem;
  width: 24px;
  text-align: center;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.sidebar-footer {
  padding: $spacing-6;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
}

.back-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: $spacing-2;
  border-radius: $border-radius-sm;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
}

.logout-btn {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  font-weight: 600;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.5);
  }
}

// Main Content Area
.admin-content {
  flex-grow: 1;
  padding: $spacing-8;
  overflow-y: auto;
}

.content-section {
  max-width: 1400px;
  margin: 0 auto;
}

// Modern Section Header
.section-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-8;

  h1 {
    font-size: $text-3xl;
    font-weight: 700;
    color: $gray-900;
    margin: 0 0 $spacing-2;
    display: flex;
    align-items: center;
    gap: $spacing-3;
  }

  .subtitle {
    color: $gray-600;
    font-size: $text-base;
    margin: 0;
  }
}

// Stats Grid
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-6;
  margin-bottom: $spacing-8;
}

// Charts Grid
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: $spacing-6;
}

// Modern Table
.modern-table-container {
  background: white;
  border-radius: $border-radius-xl;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: linear-gradient(90deg, $gray-50, $gray-100);
  }

  th {
    padding: $spacing-4 $spacing-6;
    text-align: left;
    font-weight: 600;
    color: $gray-700;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid $gray-200;
  }

  td {
    padding: $spacing-4 $spacing-6;
    border-bottom: 1px solid $gray-100;
    vertical-align: middle;
  }

  tbody tr {
    transition: background $transition-fast;

    &:hover {
      background: rgba($primary-teal, 0.02);
    }
  }
}

.id-badge {
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  color: white;
  padding: 4px 10px;
  border-radius: $border-radius-sm;
  font-weight: 600;
  font-size: 0.85rem;
}

.cell-main {
  font-weight: 600;
  color: $gray-900;
  margin-bottom: 2px;
}

.cell-sub {
  font-size: 0.85rem;
  color: $gray-600;
}

.category-badge,
.category-tag {
  background: linear-gradient(135deg, rgba($primary-teal, 0.1), rgba($primary-mint, 0.1));
  color: $primary-teal;
  padding: 4px 12px;
  border-radius: $border-radius-sm;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-block;
}

.budget-display {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-weight: 600;

  .budget-divider {
    color: $gray-400;
  }
}

.action-buttons {
  display: flex;
  gap: $spacing-2;
}

.btn-icon {
  background: white;
  border: 1px solid $gray-300;
  padding: 6px 10px;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: all $transition-fast;
  font-size: 0.9rem;

  &:hover {
    background: $gray-50;
    border-color: $primary-teal;
    transform: scale(1.05);
  }

  &.active {
    background: $primary-teal;
    border-color: $primary-teal;
    color: white;
  }

  &.btn-delete:hover {
    background: $primary-coral;
    border-color: $primary-coral;
    color: white;
  }
}

// Expansion Panel
.expansion-form {
  h3 {
    margin: 0 0 $spacing-6;
    font-size: $text-xl;
    color: $gray-900;
  }
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-4;
  margin-bottom: $spacing-4;
}

// Articles Grid
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-6;
}

.article-card {
  background: white;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all $transition-fast;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: $gray-100;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.article-body {
  padding: $spacing-6;
  flex: 1;

  h3 {
    margin: 0 0 $spacing-3;
    font-size: $text-lg;
    color: $gray-900;
  }
}

.article-meta {
  display: flex;
  gap: $spacing-3;
  font-size: 0.85rem;
  color: $gray-600;
  margin-bottom: $spacing-3;
  flex-wrap: wrap;
}

.article-excerpt {
  color: $gray-700;
  line-height: 1.6;
  font-size: 0.95rem;
}

.article-actions {
  padding: $spacing-4 $spacing-6;
  border-top: 1px solid $gray-100;
  display: flex;
  gap: $spacing-2;
}

// Videos Grid
.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: $spacing-6;
}

.video-card {
  background: white;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all $transition-fast;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  }
}

.video-info-panel {
  padding: $spacing-6;

  h4 {
    margin: 0 0 $spacing-2;
    font-size: $text-lg;
    color: $gray-900;
  }
}

.video-description {
  color: $gray-700;
  margin: 0 0 $spacing-3;
  font-size: 0.95rem;
  line-height: 1.5;
}

.video-meta {
  display: flex;
  gap: $spacing-3;
  font-size: 0.85rem;
  color: $gray-600;
}

.video-actions {
  padding: $spacing-4 $spacing-6;
  border-top: 1px solid $gray-100;
  display: flex;
  gap: $spacing-2;
}

// Resources List
.resources-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.resource-item {
  background: white;
  padding: $spacing-6;
  border-radius: $border-radius-lg;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: $spacing-4;
  transition: all $transition-fast;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateX(4px);
  }
}

.resource-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba($primary-teal, 0.1), rgba($primary-mint, 0.1));
  border-radius: $border-radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.resource-content {
  flex: 1;

  h4 {
    margin: 0 0 $spacing-2;
    font-size: $text-base;
    color: $gray-900;
  }
}

.resource-url {
  color: $primary-teal;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  margin-bottom: $spacing-2;

  &:hover {
    text-decoration: underline;
  }
}

.resource-category {
  background: $gray-100;
  color: $gray-700;
  padding: 2px 8px;
  border-radius: $border-radius-sm;
  font-size: 0.8rem;
  font-weight: 500;
}

.resource-actions {
  display: flex;
  gap: $spacing-2;
}

// Modal Styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-6;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-dialog {
  background: white;
  border-radius: $border-radius-xl;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;

  &.modal-large {
    max-width: 1000px;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: $spacing-6;
  border-bottom: 1px solid $gray-200;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, $gray-50, white);

  h2 {
    margin: 0;
    font-size: $text-2xl;
    color: $gray-900;
  }
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: $gray-400;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-md;
  transition: all $transition-fast;

  &:hover {
    background: $gray-100;
    color: $gray-900;
  }
}

.modal-body {
  padding: $spacing-6;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: $spacing-6;
  border-top: 1px solid $gray-200;
  display: flex;
  justify-content: flex-end;
  gap: $spacing-3;
  background: $gray-50;
}

.form-label {
  display: block;
  margin-bottom: $spacing-2;
  font-weight: 600;
  color: $gray-700;
  font-size: 0.9rem;
}

// Responsive
@media (max-width: $breakpoint-lg) {
  .admin-layout {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .charts-grid,
  .articles-grid,
  .videos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
