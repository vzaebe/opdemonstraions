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
        <img class="project-image" src="@/assets/images/placeholder.svg" alt="Перевод науки на РЖЯ" />
        <div class="project-content">
          <h3>Перевод науки на РЖЯ</h3>
          <p>Создание доступных научных материалов на русском жестовом языке</p>
        </div>
      </div>
      <div class="project-card">
        <img class="project-image" src="@/assets/images/placeholder.svg" alt="Инклюзивные лекции" />
        <div class="project-content">
          <h3>Инклюзивные лекции</h3>
          <p>Проведение образовательных мероприятий с переводом на РЖЯ</p>
        </div>
      </div>
      <div class="project-card">
        <img class="project-image" src="@/assets/images/placeholder.svg" alt="Грант Росмолодёжи" />
        <div class="project-content">
          <h3>Грант Росмолодёжи</h3>
          <p>Реализация проектов при поддержке Федерального агентства по делам молодёжи</p>
        </div>
      </div>
      <div class="project-card">
        <img class="project-image" src="@/assets/images/placeholder.svg" alt="Летние интенсивы в Бауманке" />
        <div class="project-content">
          <h3>Летние интенсивы в Бауманке</h3>
          <p>Образовательные программы в МГТУ им. Н.Э. Баумана</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProjectsSection'
}
</script>

<style lang="scss" scoped>
.projects-section {
  width: 100%;
  height: 1490px;
  background-color: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 6rem 7rem;
  gap: 6rem;
}

.projects-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 1.25rem;
  width: 758px;
  height: 136px;
}

.projects-title {
  font-size: $text-5xl;
  font-weight: 700;
  line-height: $leading-10;
  text-align: center;
  color: $primary-indigo;
  margin: 0;
}

.projects-subtitle {
  font-size: $text-xl;
  font-weight: 500;
  line-height: $leading-loose;
  text-align: center;
  color: $gray-900;
  opacity: $opacity-40;
  width: 758px;
  margin: 0;
}

.projects-grid {
  position: relative;
  width: 1170px;
  height: 1070px;
}

.project-card {
  position: absolute;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 570px;
  height: 520px;
  
  &:nth-child(1) {
    right: 0;
    bottom: 0;
  }
  
  &:nth-child(2) {
    left: 0;
    bottom: 0;
  }
  
  &:nth-child(3) {
    right: 0;
    top: 0;
  }
  
  &:nth-child(4) {
    left: 0;
    top: 0;
  }
}

.project-image {
  width: 570px;
  height: 330px;
  border-radius: $border-radius-lg;
  object-fit: cover;
}

.project-content {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.5rem 2rem 1.75rem 2rem;
  border: 2px solid $gray-200;
  border-top: none;
  border-radius: 0 0 $border-radius-lg $border-radius-lg;
  width: 570px;
  height: 190px;
}

.project-title {
  font-size: $text-xl;
  font-weight: 500;
  line-height: $leading-loose;
  color: $primary-indigo;
  margin: 0 0 0.875rem 0;
}

.project-description {
  font-size: $text-base;
  line-height: $leading-relaxed;
  color: $gray-900;
  opacity: $opacity-40;
  width: 456px;
  margin: 0 0 0.875rem 0;
}

.project-link {
  font-size: $text-sm;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: $leading-relaxed;
  color: $primary-green;
  text-transform: uppercase;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: $breakpoint-lg) {
  .projects-section {
    height: auto;
    padding: 4rem 2rem;
  }
  
  .projects-header {
    width: 100%;
    height: auto;
    margin-bottom: 3rem;
  }
  
  .projects-title {
    font-size: $text-3xl;
  }
  
  .projects-subtitle {
    width: 100%;
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    position: static;
    width: 100%;
    height: auto;
  }
  
  .project-card {
    position: static;
    width: 100%;
    height: auto;
  }
  
  .project-image {
    width: 100%;
    height: 200px;
  }
  
  .project-content {
    width: 100%;
    height: auto;
    padding: 1rem;
  }
  
  .project-description {
    width: 100%;
  }
}

@media (max-width: $breakpoint-md) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style> 