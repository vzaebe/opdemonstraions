<template>
  <div class="organization-projects-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-overlay"></div>
        <div class="animated-shapes">
          <span class="shape" v-for="n in 15" :key="n"></span>
        </div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">Проекты Открытых Перспектив</h1>
        <p class="hero-subtitle">
          Образовательные инициативы, социальные программы и инновационные решения
        </p>
        <p class="hero-description">
          Мы реализуем разнообразные проекты, направленные на развитие молодежи, 
          профориентацию и интеграцию в современный мир технологий
        </p>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <section class="navigation-tabs">
      <div class="container">
        <div class="tabs">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['tab', { active: activeCategory === category.id }]"
            @click="activeCategory = category.id"
          >
            <span class="tab-icon">{{ category.icon }}</span>
            <span class="tab-name">{{ category.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="projects-section">
      <div class="container">
        <transition-group name="fade" tag="div" class="projects-grid">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="project-card"
          >
            <div class="project-header">
              <div class="project-icon">{{ project.icon }}</div>
              <div class="project-status" :class="project.status">
                {{ getStatusText(project.status) }}
              </div>
            </div>
            <div class="project-image-wrapper" v-if="project.image">
              <img :src="project.image" :alt="project.title" class="project-image" loading="lazy" />
              <div class="image-overlay"></div>
            </div>
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
              
              <div class="project-details">
                <div class="detail-item" v-if="project.participants">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ project.participants }}+ участников</span>
                </div>
                <div class="detail-item" v-if="project.duration">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ project.duration }}</span>
                </div>
                <div class="detail-item" v-if="project.location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ project.location }}</span>
                </div>
              </div>

              <div class="project-tags">
                <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
              </div>

              <div class="project-footer">
                <button class="btn-primary" @click="openProjectModal(project)">
                  Подробнее
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Присоединяйтесь к нашим проектам</h2>
          <p class="cta-description">
            Станьте частью команды единомышленников и помогите нам менять мир к лучшему
          </p>
          <div class="cta-buttons">
            <router-link to="/contacts" class="cta-button primary">Связаться с нами</router-link>
            <router-link to="/charity/help" class="cta-button secondary">Поддержать проект</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Detail Modal -->
    <transition name="modal-fade">
      <div v-if="selectedProject" class="modal-backdrop" @click="closeProjectModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeProjectModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="modal-header">
            <div class="modal-icon">{{ selectedProject.icon }}</div>
            <h2 class="modal-title">{{ selectedProject.title }}</h2>
            <div class="modal-status" :class="selectedProject.status">
              {{ getStatusText(selectedProject.status) }}
            </div>
          </div>
          <div class="modal-body">
            <img v-if="selectedProject.image" :src="selectedProject.image" :alt="selectedProject.title" class="modal-image" />
            <p class="modal-description">{{ selectedProject.fullDescription || selectedProject.description }}</p>
            
            <div class="modal-details">
              <div class="modal-detail-item" v-if="selectedProject.participants">
                <strong>Участников:</strong> {{ selectedProject.participants }}+
              </div>
              <div class="modal-detail-item" v-if="selectedProject.duration">
                <strong>Длительность:</strong> {{ selectedProject.duration }}
              </div>
              <div class="modal-detail-item" v-if="selectedProject.location">
                <strong>Локация:</strong> {{ selectedProject.location }}
              </div>
            </div>

            <div class="modal-tags">
              <span class="tag" v-for="tag in selectedProject.tags" :key="tag">{{ tag }}</span>
            </div>

            <div class="modal-actions">
              <router-link to="/contacts" class="modal-button primary">Узнать больше</router-link>
              <button class="modal-button secondary" @click="closeProjectModal">Закрыть</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Project {
  id: number
  title: string
  description: string
  fullDescription?: string
  icon: string
  image?: string
  category: string
  status: 'active' | 'completed' | 'planned'
  participants?: number
  duration?: string
  location?: string
  tags: string[]
}

const activeCategory = ref('all')
const selectedProject = ref<Project | null>(null)

const categories = [
  { id: 'all', name: 'Все проекты', icon: '🎯' },
  { id: 'education', name: 'Образование', icon: '🎓' },
  { id: 'social', name: 'Социальные', icon: '🤝' },
  { id: 'events', name: 'Мероприятия', icon: '🎪' },
  { id: 'innovation', name: 'Инновации', icon: '💡' }
]

const projects: Project[] = [
  {
    id: 1,
    title: 'Летние интенсивы в Бауманке',
    description: 'Трехдневная программа погружения в студенческую жизнь МГТУ им. Баумана через диалоги, практические занятия и 3D-печать.',
    fullDescription: 'Летние интенсивы в МГТУ им. Баумана - это уникальная возможность для школьников погрузиться в атмосферу ведущего технического вуза страны. В течение трех дней участники знакомятся с направлениями обучения, посещают лаборатории, общаются со студентами и преподавателями, участвуют в практических занятиях по 3D-моделированию и печати.',
    icon: '🏛️',
    image: '/src/assets/png/Projects/Photo.png',
    category: 'events',
    status: 'active',
    participants: 150,
    duration: '3 дня',
    location: 'МГТУ им. Баумана',
    tags: ['Профориентация', 'МГТУ', 'Интенсив', '3D-печать']
  },
  {
    id: 2,
    title: 'Грант Росмолодежи',
    description: 'Масштабный проект 2024 года: 11 мероприятий, около 400 участников. Реализация образовательных и социальных инициатив.',
    fullDescription: 'В 2024 году наш проект выиграл грант Росмолодежи, что позволило реализовать масштабную программу мероприятий. Было проведено 11 различных событий, охватывающих образовательные лекции, практические мастер-классы, профориентационные встречи и социальные проекты. Общее количество участников составило около 400 человек из разных регионов России.',
    icon: '🏆',
    image: '/src/assets/png/Projects/Photo-1.png',
    category: 'social',
    status: 'completed',
    participants: 400,
    duration: '2024 год',
    location: 'Россия',
    tags: ['Грант', 'Росмолодежь', 'Образование', 'Социальное развитие']
  },
  {
    id: 3,
    title: 'Инклюзивные лекции',
    description: 'Цикл лекций об интеграции в реальный сектор экономики, инновациях и способах реализации для людей с ограниченными возможностями.',
    fullDescription: 'Серия специализированных лекций, направленных на помощь людям с ограниченными возможностями в профессиональной интеграции. Темы включают современные технологии адаптации, успешные кейсы трудоустройства, инновационные подходы к обучению и развитию карьеры. Все мероприятия адаптированы для различных категорий участников.',
    icon: '♿',
    image: '/src/assets/png/Projects/Photo-2.png',
    category: 'education',
    status: 'active',
    participants: 200,
    duration: 'Ежемесячно',
    location: 'Онлайн/Офлайн',
    tags: ['Инклюзия', 'Образование', 'Интеграция', 'Профориентация']
  },
  {
    id: 4,
    title: 'Перевод науки на РЖЯ',
    description: 'Делаем научные знания доступными для глухих и слабослышащих через перевод на русский жестовый язык.',
    fullDescription: 'Инновационный проект по переводу научно-популярных лекций, образовательных материалов и технических текстов на русский жестовый язык. Мы сотрудничаем с профессиональными переводчиками РЖЯ и создаем видеоматериалы, делая науку и технологии доступными для глухих и слабослышащих людей.',
    icon: '🤟',
    image: '/src/assets/png/Projects/Photo-3.png',
    category: 'social',
    status: 'active',
    participants: 50,
    duration: 'Постоянно',
    location: 'Онлайн',
    tags: ['РЖЯ', 'Инклюзия', 'Наука', 'Доступность']
  },
  {
    id: 5,
    title: 'Программа наставничества',
    description: 'Персональное сопровождение молодых специалистов опытными менторами из индустрии технологий и инженерии.',
    fullDescription: 'Долгосрочная программа менторства, где опытные специалисты из IT, инженерии и смежных областей помогают молодым людям развивать профессиональные навыки, строить карьеру и находить свое место в индустрии. Программа включает индивидуальные встречи, групповые сессии и практические проекты.',
    icon: '👨‍🏫',
    category: 'education',
    status: 'active',
    participants: 80,
    duration: '6 месяцев',
    location: 'Онлайн',
    tags: ['Менторство', 'Карьера', 'Развитие', 'IT']
  },
  {
    id: 6,
    title: 'Технологические мастер-классы',
    description: 'Практические занятия по современным технологиям: программирование, робототехника, 3D-моделирование, AR/VR.',
    fullDescription: 'Серия интерактивных мастер-классов, где участники получают практические навыки работы с современными технологиями. От основ программирования до создания прототипов на 3D-принтерах, от базовой робототехники до разработки AR/VR приложений. Все занятия проводятся в формате "обучение через практику".',
    icon: '🛠️',
    category: 'education',
    status: 'active',
    participants: 300,
    duration: 'Еженедельно',
    location: 'Москва, Санкт-Петербург',
    tags: ['3D-печать', 'Робототехника', 'Программирование', 'AR/VR']
  },
  {
    id: 7,
    title: 'Открытые диалоги с экспертами',
    description: 'Встречи с ведущими специалистами индустрии: обмен опытом, обсуждение трендов и открытые вопросы.',
    fullDescription: 'Ежемесячные встречи в формате открытого диалога с экспертами из различных областей: технологии, образование, бизнес, наука. Участники могут задать любые вопросы, обсудить актуальные темы и получить инсайты от профессионалов. Формат способствует свободному обмену идеями и нетворкингу.',
    icon: '💬',
    category: 'events',
    status: 'active',
    participants: 120,
    duration: 'Ежемесячно',
    location: 'Онлайн',
    tags: ['Диалоги', 'Эксперты', 'Нетворкинг', 'Развитие']
  },
  {
    id: 8,
    title: 'Фаблаб для школьников',
    description: 'Открытая лаборатория цифрового производства для детей и подростков: доступ к оборудованию и обучение.',
    fullDescription: 'Создание сети открытых лабораторий (фаблабов) на базе школ и молодежных центров. Школьники получают доступ к современному оборудованию (3D-принтеры, лазерные станки, паяльные станции) и могут реализовывать свои проекты под руководством опытных наставников. Программа развивает технические навыки и инженерное мышление.',
    icon: '🔬',
    category: 'innovation',
    status: 'active',
    participants: 250,
    duration: 'Постоянно',
    location: '10 регионов России',
    tags: ['Фаблаб', 'Школьники', 'Инженерия', 'Производство']
  },
  {
    id: 9,
    title: 'Хакатоны социальных инноваций',
    description: 'Командные соревнования по созданию технологических решений для социальных проблем.',
    fullDescription: 'Регулярные хакатоны, где команды участников за 48 часов создают прототипы решений для реальных социальных проблем. Проекты могут касаться доступности образования, помощи людям с ограниченными возможностями, экологии, здравоохранения. Лучшие проекты получают поддержку для дальнейшей реализации.',
    icon: '💻',
    category: 'innovation',
    status: 'active',
    participants: 180,
    duration: '48 часов',
    location: 'Москва',
    tags: ['Хакатон', 'Инновации', 'Социальные проекты', 'Команды']
  },
  {
    id: 10,
    title: 'Стажировки в партнерских компаниях',
    description: 'Программа стажировок для студентов и выпускников в технологических компаниях-партнерах.',
    fullDescription: 'Организация стажировок в ведущих технологических компаниях для талантливой молодежи. Участники программы проходят отбор и получают возможность реальной работы в компаниях на срок от 3 до 6 месяцев. Многие стажеры после успешного прохождения программы получают предложения о постоянной работе.',
    icon: '🚀',
    category: 'education',
    status: 'active',
    participants: 60,
    duration: '3-6 месяцев',
    location: 'Партнерские компании',
    tags: ['Стажировка', 'Карьера', 'IT-компании', 'Трудоустройство']
  },
  {
    id: 11,
    title: 'Всероссийский конкурс проектов',
    description: 'Ежегодный конкурс инновационных проектов молодых инженеров и изобретателей.',
    fullDescription: 'Масштабный всероссийский конкурс, где молодые инженеры, изобретатели и предприниматели представляют свои инновационные проекты. Конкурс проходит в несколько этапов: региональный отбор, полуфинал и финал. Победители получают гранты на реализацию проектов, наставническую поддержку и возможность презентации на крупных выставках.',
    icon: '🏅',
    category: 'innovation',
    status: 'planned',
    duration: 'Ноябрь 2025',
    location: 'Вся Россия',
    tags: ['Конкурс', 'Инновации', 'Проекты', 'Гранты']
  },
  {
    id: 12,
    title: 'Летняя школа технологий',
    description: 'Двухнедельная интенсивная программа для школьников с погружением в мир современных технологий.',
    fullDescription: 'Летний образовательный лагерь, где школьники 14-17 лет в течение двух недель изучают различные направления современных технологий. Программа включает лекции, практические занятия, работу над групповыми проектами, экскурсии в технологические компании и научные центры. Участники живут в кампусе и полностью погружаются в образовательную атмосферу.',
    icon: '☀️',
    category: 'events',
    status: 'planned',
    duration: '2 недели',
    location: 'Подмосковье',
    tags: ['Летняя школа', 'Школьники', 'Интенсив', 'Технологии']
  }
]

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') {
    return projects
  }
  return projects.filter(p => p.category === activeCategory.value)
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Активный',
    completed: 'Завершен',
    planned: 'Планируется'
  }
  return statusMap[status] || status
}

const openProjectModal = (project: Project) => {
  selectedProject.value = project
  document.body.style.overflow = 'hidden'
}

const closeProjectModal = () => {
  selectedProject.value = null
  document.body.style.overflow = ''
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.organization-projects-page {
  width: 100%;
  overflow-x: hidden;
}

// Hero Section
.hero-section {
  position: relative;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: $spacing-24 $spacing-8;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    $primary-teal 0%, 
    $primary-mint 50%, 
    $primary-cyan 100%);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
}

.animated-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .shape {
    position: absolute;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    animation: floatShape 20s infinite;

    @for $i from 1 through 15 {
      &:nth-child(#{$i}) {
        left: random(100) * 1%;
        top: random(100) * 1%;
        animation-delay: random(15) * 0.1s;
        animation-duration: (15 + random(10)) * 1s;
        transform: rotate(random(360) * 1deg);
      }
    }
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: $white;
  max-width: 900px;
  padding: 0 $spacing-8;
}

.hero-title {
  font-size: $text-6xl;
  font-weight: 700;
  margin-bottom: $spacing-6;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease;
}

.hero-subtitle {
  font-size: $text-2xl;
  font-weight: 500;
  margin-bottom: $spacing-4;
  opacity: 0.95;
  animation: fadeInUp 1s ease 0.2s backwards;
}

.hero-description {
  font-size: $text-xl;
  line-height: $leading-relaxed;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
  animation: fadeInUp 1s ease 0.4s backwards;
}

// Container
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-8;
}

// Navigation Tabs
.navigation-tabs {
  background: $white;
  padding: $spacing-8 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 100px;
  z-index: $z-sticky;
}

.tabs {
  display: flex;
  gap: $spacing-4;
  overflow-x: auto;
  padding: $spacing-2 0;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: $gray-100;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: $primary-teal;
    border-radius: 3px;
  }
}

.tab {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  padding: $spacing-3 $spacing-6;
  background: $gray-100;
  border: 2px solid transparent;
  border-radius: $border-radius-full;
  font-size: $text-base;
  font-weight: 600;
  color: $gray-700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: $gray-200;
    transform: translateY(-2px);
  }

  &.active {
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
    color: $white;
    border-color: $primary-teal;
    box-shadow: 0 4px 15px rgba($primary-teal, 0.3);
  }
}

.tab-icon {
  font-size: $text-xl;
}

// Projects Section
.projects-section {
  padding: $spacing-24 0;
  background: linear-gradient(135deg, rgba($primary-teal, 0.02), rgba($primary-mint, 0.02));
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: $spacing-8;
}

.project-card {
  background: $white;
  border-radius: $border-radius-2xl;
  overflow: hidden;
  box-shadow: $shadow-lg;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-10px);
    box-shadow: $shadow-xl;

    .project-image {
      transform: scale(1.1);
    }

    .image-overlay {
      opacity: 0.3;
    }
  }
}

.project-header {
  padding: $spacing-6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $gray-200;
}

.project-icon {
  font-size: $text-5xl;
}

.project-status {
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  font-weight: 600;

  &.active {
    background: rgba($primary-teal, 0.1);
    color: $primary-teal;
  }

  &.completed {
    background: rgba($primary-mint, 0.1);
    color: darken($primary-mint, 20%);
  }

  &.planned {
    background: rgba($primary-orange, 0.1);
    color: darken($primary-orange, 10%);
  }
}

.project-image-wrapper {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0.5;
  transition: opacity 0.4s ease;
}

.project-content {
  padding: $spacing-6;
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  flex-grow: 1;
}

.project-title {
  font-size: $text-2xl;
  font-weight: 600;
  color: $primary-teal;
  margin: 0;
  line-height: $leading-tight;
}

.project-description {
  font-size: $text-base;
  line-height: $leading-relaxed;
  color: $gray-700;
  margin: 0;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  padding: $spacing-4;
  background: $gray-50;
  border-radius: $border-radius-md;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-size: $text-sm;
  color: $gray-600;

  svg {
    color: $primary-teal;
    flex-shrink: 0;
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
}

.tag {
  padding: $spacing-1 $spacing-3;
  background: linear-gradient(135deg, rgba($primary-teal, 0.1), rgba($primary-mint, 0.1));
  color: $primary-teal;
  border-radius: $border-radius-full;
  font-size: $text-sm;
  font-weight: 500;
}

.project-footer {
  margin-top: auto;
  padding-top: $spacing-4;
  border-top: 1px solid $gray-200;
}

.btn-primary {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;
  padding: $spacing-4 $spacing-6;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  color: $white;
  border: none;
  border-radius: $border-radius-md;
  font-size: $text-base;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba($primary-teal, 0.3);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }
}

// CTA Section
.cta-section {
  padding: $spacing-24 0;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
}

.cta-content {
  text-align: center;
  color: $white;
}

.cta-title {
  font-size: $text-5xl;
  font-weight: 700;
  margin-bottom: $spacing-6;
}

.cta-description {
  font-size: $text-2xl;
  line-height: $leading-relaxed;
  margin-bottom: $spacing-12;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: $spacing-6;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-block;
  padding: $spacing-5 $spacing-10;
  font-size: $text-xl;
  font-weight: 600;
  border-radius: $border-radius-full;
  text-decoration: none;
  transition: all 0.3s ease;

  &.primary {
    background: $white;
    color: $primary-teal;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  }

  &.secondary {
    background: transparent;
    color: $white;
    border: 2px solid $white;

    &:hover {
      background: $white;
      color: $primary-teal;
      transform: translateY(-5px);
    }
  }
}

// Modal
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal;
  padding: $spacing-8;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  background: $white;
  border-radius: $border-radius-2xl;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: $spacing-4;
  right: $spacing-4;
  background: rgba($white, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: $white;
    transform: rotate(90deg);
  }
}

.modal-header {
  padding: $spacing-8;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  color: $white;
  text-align: center;
}

.modal-icon {
  font-size: $text-7xl;
  margin-bottom: $spacing-4;
}

.modal-title {
  font-size: $text-4xl;
  font-weight: 700;
  margin-bottom: $spacing-4;
}

.modal-status {
  display: inline-block;
  padding: $spacing-2 $spacing-6;
  border-radius: $border-radius-full;
  font-size: $text-base;
  font-weight: 600;
  background: rgba($white, 0.2);
}

.modal-body {
  padding: $spacing-8;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-6;
}

.modal-description {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  color: $gray-700;
  margin-bottom: $spacing-6;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  padding: $spacing-6;
  background: $gray-50;
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-6;
}

.modal-detail-item {
  font-size: $text-base;
  color: $gray-700;

  strong {
    color: $primary-teal;
    margin-right: $spacing-2;
  }
}

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
  margin-bottom: $spacing-8;
}

.modal-actions {
  display: flex;
  gap: $spacing-4;
}

.modal-button {
  flex: 1;
  padding: $spacing-4 $spacing-8;
  border-radius: $border-radius-md;
  font-size: $text-lg;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
    color: $white;
    border: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba($primary-teal, 0.3);
    }
  }

  &.secondary {
    background: $gray-200;
    color: $gray-700;
    border: none;

    &:hover {
      background: $gray-300;
    }
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes floatShape {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translate(50px, 50px) rotate(180deg);
    opacity: 0.6;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9);
}

// Responsive Design
@media (max-width: $breakpoint-lg) {
  .hero-title {
    font-size: $text-5xl;
  }

  .hero-subtitle {
    font-size: $text-xl;
  }

  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: $spacing-6;
  }

  .navigation-tabs {
    top: 80px;
  }
}

@media (max-width: $breakpoint-md) {
  .hero-title {
    font-size: $text-4xl;
  }

  .hero-subtitle {
    font-size: $text-lg;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    justify-content: flex-start;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-button {
    width: 100%;
  }

  .modal-actions {
    flex-direction: column;
  }

  .navigation-tabs {
    position: static;
  }
}
</style>

