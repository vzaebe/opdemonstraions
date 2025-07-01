<template>
  <section class="projects-section">
    <div class="projects-header">
      <h2 class="projects-title">Наши основные проекты</h2>
      <p class="projects-subtitle">
        История наших проектов в разных университетах, предприятиях<br/>и организациях
      </p>
    </div>
    <div class="projects-grid">
      <div class="project-card">
        <img class="project-image" src="@/assets/png/Projects/Photo.png" alt="Летние интенсивы в Бауманке" />
        <div class="project-content">
          <h3 class="project-title">Летние интенсивы в Бауманке</h3>
          <p class="project-description">Три дня невероятного погружения в бауманскую атмосферу через диалоги и 3D печать</p>
          <a href="#" class="project-link">Узнать больше о мероприятии</a>
        </div>
      </div>
      <div class="project-card">
        <img class="project-image" src="@/assets/png/Projects/Photo-1.png" alt="Грант Росмолодежи" />
        <div class="project-content">
          <h3 class="project-title">Грант Росмолодежи</h3>
          <p class="project-description">В 2024 году проект выиграл заявку. Было проведено 11 мероприятий, которые посетило около 400 человек</p>
          <a href="#" class="project-link">Перейти к списку мероприятий и отчету</a>
        </div>
      </div>
      <div class="project-card">
        <img class="project-image" src="@/assets/png/Projects/Photo-2.png" alt="Инклюзивные лекции" />
        <div class="project-content">
          <h3 class="project-title">Инклюзивные лекции</h3>
          <p class="project-description">Проводим лекции про интеграцию в реальный сектор, инновации и способы реализации</p>
          <a href="#" class="project-link">Посмотреть лекции и материалы</a>
        </div>
      </div>
      <div class="project-card">
        <img class="project-image" src="@/assets/png/Projects/Photo-3.png" alt="Перевод науки на РЖЯ" />
        <div class="project-content">
          <h3 class="project-title">Перевод науки на РЖЯ</h3>
          <p class="project-description">Делаем науку доступной с помощью переведения русского жестового языка</p>
          <a href="#" class="project-link">Открыть перечень переводов</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'ProjectsSection'
}
</script>

<style lang="scss" scoped>
.projects-section {
  width: 100%;
  padding: 120px 135px;
  background-color: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
}

.projects-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 758px;
}

.projects-title {
  color: $primary-teal;
  font-size: 48px;
  font-weight: 700;
  line-height: 60px;
  margin: 0;
  text-align: center;
}

.projects-subtitle {
  color: rgba($gray-900, 0.4);
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  text-align: center;
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  max-width: 1170px;
}

.project-card {
  width: 570px;
  display: flex;
  flex-direction: column;
}

.project-image {
  width: 100%;
  height: 330px;
  border-radius: 12px 12px 0 0;
  object-fit: cover;
}

.project-content {
  padding: 24px 32px 28px;
  border: 2px solid $gray-200;
  border-top: none;
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.project-title {
  color: $primary-teal;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  margin: 0;
}

.project-description {
  color: rgba($gray-900, 0.4);
  font-size: 16px;
  line-height: 24px;
  margin: 0;
}

.project-link {
  color: $primary-orange;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: $breakpoint-lg) {
  .projects-section {
    padding: 64px 32px;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .project-card {
    width: 100%;
  }
  
  .project-image {
    height: 250px;
  }
  
  .project-content {
    padding: 20px 24px;
  }
  
  .projects-title {
    font-size: 36px;
    line-height: 44px;
  }
  
  .projects-subtitle {
    font-size: 18px;
    line-height: 28px;
  }
}

@media (max-width: $breakpoint-md) {
  .projects-section {
    padding: 48px 16px;
  }
  
  .project-image {
    height: 200px;
  }
  
  .project-content {
    padding: 16px 20px;
  }
}
</style> 