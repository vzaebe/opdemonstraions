<template>
  <section class="team-section">
    <div class="team-header">
      <h2 class="team-title">Наша команда</h2>
      <p class="team-subtitle">
        Знакомьтесь с людьми, которые делают наши проекты возможными
      </p>
    </div>
    <div class="team-grid">
      <div class="team-member">
        <img class="member-photo" src="@/assets/images/avatar.svg" alt="Анна Петрова" />
        <div class="member-info">
          <h3 class="member-name">Анна Петрова</h3>
          <p class="member-role">Руководитель проекта</p>
          <p class="member-description">
            Эксперт по инклюзивному образованию с 10-летним опытом работы
          </p>
        </div>
      </div>
      <div class="team-member">
        <img class="member-photo" src="@/assets/images/avatar.svg" alt="Михаил Сидоров" />
        <div class="member-info">
          <h3 class="member-name">Михаил Сидоров</h3>
          <p class="member-role">Технический директор</p>
          <p class="member-description">
            Разработчик программного обеспечения и специалист по доступности
          </p>
        </div>
      </div>
      <div class="team-member">
        <img class="member-photo" src="@/assets/images/avatar.svg" alt="Елена Козлова" />
        <div class="member-info">
          <h3 class="member-name">Елена Козлова</h3>
          <p class="member-role">Координатор мероприятий</p>
          <p class="member-description">
            Организатор образовательных программ и мастер-классов
          </p>
        </div>
      </div>
      <div class="team-member">
        <img class="member-photo" src="@/assets/images/avatar.svg" alt="Дмитрий Волков" />
        <div class="member-info">
          <h3 class="member-name">Дмитрий Волков</h3>
          <p class="member-role">Переводчик РЖЯ</p>
          <p class="member-description">
            Сертифицированный переводчик русского жестового языка
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TeamSection'
}
</script>

<style lang="scss" scoped>
.team-section {
  width: 100%;
  height: 800px;
  background-color: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 6rem 2rem;
  gap: 4rem;
}

.team-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.25rem;
  width: 600px;
  height: 136px;
}

.team-title {
  font-size: $text-4xl;
  font-weight: 700;
  line-height: $leading-10;
  text-align: center;
  color: $primary-indigo;
  margin: 0;
}

.team-subtitle {
  font-size: $text-lg;
  line-height: $leading-relaxed;
  text-align: center;
  color: $gray-700;
  width: 600px;
  margin: 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  width: 100%;
}

.team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  padding: 2rem;
  background-color: $gray-50;
  border-radius: $border-radius-xl;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-lg;
  }
}

.member-photo {
  width: 12.5rem;
  height: 12.5rem;
  border-radius: $border-radius-full;
  object-fit: cover;
  border: 4px solid $white;
  box-shadow: $shadow-md;
}

.member-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  text-align: center;
}

.member-name {
  font-size: $text-xl;
  font-weight: 700;
  line-height: $leading-7;
  color: $primary-indigo;
  margin: 0;
}

.member-role {
  font-size: $text-sm;
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: $leading-relaxed;
  color: $primary-green;
  text-transform: uppercase;
  margin: 0;
}

.member-description {
  font-size: $text-sm;
  line-height: $leading-relaxed;
  color: $gray-600;
  margin: 0;
}

@media (max-width: $breakpoint-lg) {
  .team-section {
    height: auto;
    padding: 4rem 2rem;
  }
  
  .team-header {
    width: 100%;
    height: auto;
    margin-bottom: 2rem;
  }
  
  .team-title {
    font-size: $text-3xl;
  }
  
  .team-subtitle {
    width: 100%;
  }
  
  .team-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
}

@media (max-width: $breakpoint-md) {
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .member-photo {
    width: 10rem;
    height: 10rem;
  }
}
</style> 