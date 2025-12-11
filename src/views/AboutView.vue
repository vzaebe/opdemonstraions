<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-overlay"></div>
        <div class="animated-particles">
          <span class="particle" v-for="n in 20" :key="n"></span>
        </div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">Открытые Перспективы</h1>
        <p class="hero-subtitle">История создания будущего</p>
        <p class="hero-description">
          Мы верим, что каждый человек заслуживает доступ к современным технологиям и возможностям для развития
        </p>
      </div>
      <div class="scroll-indicator">
        <span class="scroll-arrow">↓</span>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section">
      <div class="container">
        <div class="mission-content">
          <h2 class="section-title">Наша миссия</h2>
          <div class="mission-cards">
            <div class="mission-card" v-for="(mission, index) in missions" :key="index">
              <div class="card-icon">{{ mission.icon }}</div>
              <h3 class="card-title">{{ mission.title }}</h3>
              <p class="card-text">{{ mission.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="timeline-section">
      <div class="container">
        <h2 class="section-title">История нашего пути</h2>
        <p class="timeline-intro">
          С момента основания мы прошли долгий путь от небольшой инициативной группы до признанной организации, 
          помогающей тысячам людей по всей России
        </p>
        
        <div class="timeline">
          <div 
            class="timeline-item" 
            v-for="(event, index) in timelineEvents" 
            :key="index"
            :class="{ 'left': index % 2 === 0, 'right': index % 2 === 1 }"
          >
            <div class="timeline-marker">
              <span class="marker-dot"></span>
            </div>
            <div class="timeline-content">
              <div class="timeline-year">{{ event.year }}</div>
              <h3 class="timeline-title">{{ event.title }}</h3>
              <p class="timeline-description">{{ event.description }}</p>
              <div class="timeline-stats" v-if="event.stats">
                <span class="stat" v-for="(stat, i) in event.stats" :key="i">
                  {{ stat }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="container">
        <h2 class="section-title">Наши ценности</h2>
        <div class="values-grid">
          <div class="value-card" v-for="(value, index) in values" :key="index">
            <div class="value-icon-wrapper">
              <div class="value-icon">{{ value.icon }}</div>
            </div>
            <h3 class="value-title">{{ value.title }}</h3>
            <p class="value-description">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Achievements Section -->
    <section class="achievements-section">
      <div class="container">
        <h2 class="section-title">Наши достижения</h2>
        <div class="achievements-grid">
          <div class="achievement-card" v-for="(achievement, index) in achievements" :key="index">
            <div class="achievement-number">{{ achievement.number }}</div>
            <div class="achievement-label">{{ achievement.label }}</div>
            <div class="achievement-description">{{ achievement.description }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section class="vision-section">
      <div class="vision-background">
        <div class="vision-overlay"></div>
      </div>
      <div class="container">
        <div class="vision-content">
          <h2 class="section-title white-title">Наше видение будущего</h2>
          <div class="vision-text">
            <p>
              Мы стремимся к миру, где технологии служат людям, а не наоборот. Где каждый ребенок имеет доступ 
              к современному образованию и инструментам для реализации своего потенциала.
            </p>
            <p>
              Наша цель — создать устойчивую экосистему, которая объединяет образование, технологии и социальную 
              ответственность. Мы верим, что через открытые технологии и сотрудничество можем изменить жизнь 
              миллионов людей к лучшему.
            </p>
            <p class="vision-quote">
              "Будущее создается сегодня, и мы делаем все возможное, чтобы оно было открытым, доступным и 
              полным возможностей для каждого"
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Approach Section -->
    <section class="team-approach-section">
      <div class="container">
        <h2 class="section-title">Как мы работаем</h2>
        <div class="approach-grid">
          <div class="approach-item" v-for="(item, index) in approaches" :key="index">
            <div class="approach-number">{{ index + 1 }}</div>
            <h3 class="approach-title">{{ item.title }}</h3>
            <p class="approach-description">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Присоединяйтесь к нам</h2>
          <p class="cta-description">
            Станьте частью истории. Вместе мы можем создать будущее, которым будем гордиться
          </p>
          <div class="cta-buttons">
            <router-link to="/charity/help" class="cta-button primary">Помочь проекту</router-link>
            <router-link to="/contacts" class="cta-button secondary">Связаться с нами</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const missions = [
  {
    icon: '🎓',
    title: 'Образование',
    text: 'Делаем современные технологии доступными для детей и подростков через образовательные программы и мастер-классы'
  },
  {
    icon: '🤝',
    title: 'Помощь',
    text: 'Создаем реальные решения для детских домов, школ и социальных учреждений с помощью 3D-печати и технологий'
  },
  {
    icon: '🚀',
    title: 'Инновации',
    text: 'Развиваем открытые технологии и делимся знаниями для создания устойчивого будущего'
  }
]

const timelineEvents = [
  {
    year: '2018',
    title: 'Зарождение идеи',
    description: 'Группа энтузиастов из МГТУ им. Баумана объединилась с идеей использовать 3D-печать для помощи детским домам. Первые встречи, обсуждения и формирование концепции проекта.',
    stats: ['5 человек в команде', 'Первая встреча']
  },
  {
    year: '2019',
    title: 'Первые шаги',
    description: 'Запуск пилотного проекта в трех детских домах Москвы. Печать первых игрушек и развивающих пособий. Установление партнерских отношений с производителями материалов для 3D-печати.',
    stats: ['3 детских дома', '500+ напечатанных изделий']
  },
  {
    year: '2020',
    title: 'Официальная регистрация',
    description: 'Регистрация АНО "Открытые Перспективы". Расширение команды до 15 человек. Запуск образовательных программ по 3D-моделированию для детей из детских домов.',
    stats: ['АНО зарегистрирована', '15 человек в команде']
  },
  {
    year: '2021',
    title: 'Масштабирование',
    description: 'Выход на межрегиональный уровень. Открытие филиалов в Санкт-Петербурге и Казани. Создание онлайн-платформы для приема заявок. Запуск программы волонтерской 3D-печати.',
    stats: ['3 города', '2000+ выполненных заказов', '50+ волонтеров']
  },
  {
    year: '2022',
    title: 'Развитие экосистемы',
    description: 'Запуск образовательного центра "3D-технологии для будущего". Партнерство с 20+ учебными заведениями. Создание открытой библиотеки 3D-моделей для социальных проектов.',
    stats: ['Образовательный центр', '1000+ обученных детей', '20+ партнеров']
  },
  {
    year: '2023',
    title: 'Признание и награды',
    description: 'Получение премии "Лучший социальный проект года". Презентация на международных конференциях. Запуск программы целевых сборов для приобретения оборудования детским учреждениям.',
    stats: ['Премия года', '5000+ благополучателей']
  },
  {
    year: '2024',
    title: 'Новые горизонты',
    description: 'Расширение направлений работы: добавление проектов по робототехнике и программированию. Создание сети фаблабов в регионах России. Запуск программы наставничества для молодых инженеров.',
    stats: ['10 регионов', '10000+ помогли', '100+ волонтеров']
  },
  {
    year: '2025',
    title: 'Настоящее и будущее',
    description: 'Сегодня мы - это большая семья единомышленников, объединенных общей целью. Мы продолжаем расти, развиваться и помогать все большему количеству людей, делая мир чуточку лучше каждый день.',
    stats: ['Активное развитие', 'Новые проекты', 'Светлое будущее']
  }
]

const values = [
  {
    icon: '💎',
    title: 'Открытость',
    description: 'Мы открыты для всех: делимся знаниями, опытом и технологиями. Наши проекты и решения доступны каждому'
  },
  {
    icon: '🌟',
    title: 'Качество',
    description: 'Мы стремимся к высочайшему качеству во всем: от образовательных программ до каждого напечатанного изделия'
  },
  {
    icon: '❤️',
    title: 'Забота',
    description: 'В центре нашей работы — люди. Мы заботимся о каждом ребенке, партнере и волонтере'
  },
  {
    icon: '🔬',
    title: 'Инновации',
    description: 'Мы постоянно ищем новые решения и не боимся экспериментировать, чтобы найти лучшие способы помощи'
  },
  {
    icon: '🤲',
    title: 'Сотрудничество',
    description: 'Мы верим в силу командной работы и строим долгосрочные партнерские отношения'
  },
  {
    icon: '🎯',
    title: 'Результат',
    description: 'Мы фокусируемся на реальных, измеримых результатах, которые улучшают жизнь людей'
  }
]

const achievements = [
  {
    number: '15000+',
    label: 'Изделий напечатано',
    description: 'Игрушки, пособия, протезы'
  },
  {
    number: '50+',
    label: 'Детских учреждений',
    description: 'По всей России'
  },
  {
    number: '200+',
    label: 'Волонтеров',
    description: 'Активных участников'
  },
  {
    number: '5000+',
    label: 'Детей обучено',
    description: '3D-технологиям'
  },
  {
    number: '100+',
    label: 'Партнерских организаций',
    description: 'Вузы, компании, фонды'
  },
  {
    number: '10',
    label: 'Регионов присутствия',
    description: 'От Москвы до Владивостока'
  }
]

const approaches = [
  {
    title: 'Слушаем потребности',
    description: 'Мы начинаем с диалога: узнаем, что действительно нужно детским учреждениям и их воспитанникам'
  },
  {
    title: 'Разрабатываем решения',
    description: 'Наша команда инженеров и дизайнеров создает индивидуальные решения под конкретные запросы'
  },
  {
    title: 'Вовлекаем сообщество',
    description: 'Привлекаем волонтеров, партнеров и благотворителей к реализации проектов'
  },
  {
    title: 'Обучаем и вдохновляем',
    description: 'Проводим мастер-классы и образовательные программы, передавая знания и навыки'
  },
  {
    title: 'Измеряем результаты',
    description: 'Отслеживаем влияние наших проектов и постоянно улучшаем подходы'
  },
  {
    title: 'Масштабируем успех',
    description: 'Успешные практики тиражируем в другие регионы, помогая еще большему числу людей'
  }
]
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.about-page {
  width: 100%;
  overflow-x: hidden;
}

// Hero Section
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    $primary-teal 0%, 
    $primary-mint 25%, 
    $primary-cyan 50%, 
    $primary-teal 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
}

.animated-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: floatParticle 20s infinite;

    @for $i from 1 through 20 {
      &:nth-child(#{$i}) {
        left: random(100) * 1%;
        top: random(100) * 1%;
        animation-delay: random(20) * 0.1s;
        animation-duration: (15 + random(10)) * 1s;
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
  font-size: $text-7xl;
  font-weight: 700;
  margin-bottom: $spacing-6;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease;
}

.hero-subtitle {
  font-size: $text-3xl;
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

.scroll-indicator {
  position: absolute;
  bottom: $spacing-12;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  animation: bounce 2s infinite;
}

.scroll-arrow {
  font-size: $text-4xl;
  color: $white;
  opacity: 0.8;
}

// Container
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-8;
}

// Section Title
.section-title {
  font-size: $text-5xl;
  font-weight: 700;
  text-align: center;
  margin-bottom: $spacing-12;
  color: $primary-teal;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -$spacing-4;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, $primary-mint, $primary-cyan);
    border-radius: 2px;
  }

  &.white-title {
    color: $white;
  }
}

// Mission Section
.mission-section {
  padding: $spacing-24 0;
  background: $gray-50;
}

.mission-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-8;
  margin-top: $spacing-12;
}

.mission-card {
  background: $white;
  padding: $spacing-8;
  border-radius: $border-radius-2xl;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: $shadow-md;

  &:hover {
    transform: translateY(-10px);
    box-shadow: $shadow-xl;
  }
}

.card-icon {
  font-size: $text-6xl;
  margin-bottom: $spacing-4;
}

.card-title {
  font-size: $text-2xl;
  font-weight: 600;
  color: $primary-teal;
  margin-bottom: $spacing-3;
}

.card-text {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  color: $gray-700;
}

// Timeline Section
.timeline-section {
  padding: $spacing-24 0;
  background: $white;
}

.timeline-intro {
  text-align: center;
  font-size: $text-xl;
  line-height: $leading-relaxed;
  color: $gray-700;
  max-width: 800px;
  margin: 0 auto $spacing-16 auto;
}

.timeline {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: $spacing-8 0;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, $primary-mint, $primary-teal, $primary-cyan);
    transform: translateX(-50%);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: $spacing-16;
  
  &.left .timeline-content {
    margin-left: 0;
    margin-right: calc(50% + 60px);
    text-align: right;
  }

  &.right .timeline-content {
    margin-left: calc(50% + 60px);
    margin-right: 0;
    text-align: left;
  }
}

.timeline-marker {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 2;
}

.marker-dot {
  display: block;
  width: 24px;
  height: 24px;
  background: $primary-mint;
  border: 4px solid $white;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba($primary-mint, 0.2);
  animation: pulse 2s infinite;
}

.timeline-content {
  background: $white;
  padding: $spacing-8;
  border-radius: $border-radius-2xl;
  box-shadow: $shadow-lg;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.timeline-year {
  display: inline-block;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  color: $white;
  padding: $spacing-2 $spacing-6;
  border-radius: $border-radius-full;
  font-size: $text-xl;
  font-weight: 700;
  margin-bottom: $spacing-4;
}

.timeline-title {
  font-size: $text-2xl;
  font-weight: 600;
  color: $primary-teal;
  margin-bottom: $spacing-3;
}

.timeline-description {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  color: $gray-700;
  margin-bottom: $spacing-4;
}

.timeline-stats {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-3;
  
  .stat {
    background: rgba($primary-mint, 0.1);
    color: $primary-teal;
    padding: $spacing-2 $spacing-4;
    border-radius: $border-radius-full;
    font-size: $text-sm;
    font-weight: 500;
  }
}

// Values Section
.values-section {
  padding: $spacing-24 0;
  background: linear-gradient(135deg, rgba($primary-teal, 0.05), rgba($primary-mint, 0.05));
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-8;
  margin-top: $spacing-12;
}

.value-card {
  background: $white;
  padding: $spacing-8;
  border-radius: $border-radius-2xl;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: $shadow-md;

  &:hover {
    transform: translateY(-10px) rotate(2deg);
    box-shadow: $shadow-xl;
  }
}

.value-icon-wrapper {
  margin-bottom: $spacing-4;
}

.value-icon {
  font-size: $text-6xl;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

.value-title {
  font-size: $text-2xl;
  font-weight: 600;
  color: $primary-teal;
  margin-bottom: $spacing-3;
}

.value-description {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  color: $gray-700;
}

// Achievements Section
.achievements-section {
  padding: $spacing-24 0;
  background: $white;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-6;
  margin-top: $spacing-12;
}

.achievement-card {
  text-align: center;
  padding: $spacing-8;
  background: linear-gradient(135deg, rgba($primary-teal, 0.1), rgba($primary-mint, 0.1));
  border-radius: $border-radius-2xl;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.achievement-number {
  font-size: $text-6xl;
  font-weight: 700;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: $spacing-2;
}

.achievement-label {
  font-size: $text-xl;
  font-weight: 600;
  color: $primary-teal;
  margin-bottom: $spacing-2;
}

.achievement-description {
  font-size: $text-base;
  color: $gray-600;
}

// Vision Section
.vision-section {
  position: relative;
  padding: $spacing-24 0;
  overflow: hidden;
}

.vision-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, $primary-teal, $primary-cyan);
  background-size: 200% 200%;
  animation: gradientShift 10s ease infinite;
}

.vision-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}

.vision-content {
  position: relative;
  z-index: 2;
  color: $white;
}

.vision-text {
  max-width: 900px;
  margin: 0 auto;
  font-size: $text-xl;
  line-height: $leading-loose;

  p {
    margin-bottom: $spacing-6;
  }
}

.vision-quote {
  font-size: $text-2xl;
  font-style: italic;
  font-weight: 500;
  text-align: center;
  padding: $spacing-8;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $border-radius-2xl;
  border-left: 4px solid $primary-mint;
  margin-top: $spacing-12;
}

// Team Approach Section
.team-approach-section {
  padding: $spacing-24 0;
  background: $gray-50;
}

.approach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-6;
  margin-top: $spacing-12;
}

.approach-item {
  position: relative;
  padding: $spacing-8;
  padding-left: $spacing-16;
  background: $white;
  border-radius: $border-radius-2xl;
  box-shadow: $shadow-md;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(10px);
  }
}

.approach-number {
  position: absolute;
  left: $spacing-6;
  top: $spacing-6;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $text-2xl;
  font-weight: 700;
  background: linear-gradient(135deg, $primary-teal, $primary-mint);
  color: $white;
  border-radius: 50%;
}

.approach-title {
  font-size: $text-xl;
  font-weight: 600;
  color: $primary-teal;
  margin-bottom: $spacing-3;
}

.approach-description {
  font-size: $text-base;
  line-height: $leading-relaxed;
  color: $gray-700;
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

@keyframes floatParticle {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% {
    transform: translate(random(200) - 100px, random(200) - 100px);
    opacity: 0;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba($primary-mint, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba($primary-mint, 0.4);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

// Responsive Design
@media (max-width: $breakpoint-lg) {
  .hero-title {
    font-size: $text-5xl;
  }

  .hero-subtitle {
    font-size: $text-2xl;
  }

  .section-title {
    font-size: $text-4xl;
  }

  .timeline {
    &::before {
      left: 30px;
    }
  }

  .timeline-item {
    &.left .timeline-content,
    &.right .timeline-content {
      margin-left: 70px;
      margin-right: 0;
      text-align: left;
    }
  }

  .timeline-marker {
    left: 30px;
  }
}

@media (max-width: $breakpoint-md) {
  .hero-title {
    font-size: $text-4xl;
  }

  .hero-subtitle {
    font-size: $text-xl;
  }

  .hero-description {
    font-size: $text-lg;
  }

  .section-title {
    font-size: $text-3xl;
  }

  .mission-cards,
  .values-grid,
  .achievements-grid,
  .approach-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
