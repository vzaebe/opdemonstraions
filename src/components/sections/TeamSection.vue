<template>
  <section class="team-section">
    <div class="team-header">
      <h2 class="team-title">Наша прекрасная команда</h2>
      <p class="team-subtitle">
        Любая организация это в первую очередь люди, без которых наши проекты невозможно было бы реализовать
      </p>
      <button class="team-button">Встречайте нашу команду</button>
    </div>
    <div class="team-grid">
      <div class="team-member">
        <div class="member-photo-wrapper">
          <img class="member-photo" :src="komarovUrl" alt="Дмитрий Комаров" />
        </div>
        <div class="member-info">
          <h3 class="member-name">Дмитрий Комаров</h3>
          <p class="member-role">НАЧАЛЬНИК УПРАВЛЕНИЯ<br>ДОСТУПНОЙ ИНФОРМАЦИОННОЙ СРЕДЫ</p>
          <div class="member-social">
            <a href="#" class="social-link"><i class="fas fa-globe"></i></a>
            <a href="mailto:#" class="social-link"><i class="fas fa-envelope"></i></a>
            <a href="#" class="social-link"><i class="fab fa-telegram"></i></a>
          </div>
        </div>
      </div>
      <div class="team-member">
        <div class="member-photo-wrapper">
          <img class="member-photo" :src="ivanovaUrl" alt="Ольга Иванова" />
        </div>
        <div class="member-info">
          <h3 class="member-name">Ольга Иванова</h3>
          <p class="member-role">ДИРЕКТОР</p>
          <div class="member-social">
            <a href="#" class="social-link"><i class="fas fa-globe"></i></a>
            <a href="mailto:#" class="social-link"><i class="fas fa-envelope"></i></a>
            <a href="#" class="social-link"><i class="fab fa-telegram"></i></a>
          </div>
        </div>
      </div>
      <div class="team-member">
        <div class="member-photo-wrapper">
          <img class="member-photo" :src="mironovaUrl" alt="София Миронова" />
        </div>
        <div class="member-info">
          <h3 class="member-name">София Миронова</h3>
          <p class="member-role">НАЧАЛЬНИК УПРАВЛЕНИЯ<br>ИНКЛЮЗИВНЫХ ПРОГРАММ</p>
          <div class="member-social">
            <a href="#" class="social-link"><i class="fas fa-globe"></i></a>
            <a href="mailto:#" class="social-link"><i class="fas fa-envelope"></i></a>
            <a href="#" class="social-link"><i class="fab fa-telegram"></i></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
/**
 * Секция «Команда» (TeamSection).
 * Показывает карточки ключевых участников команды с фото и должностями.
 * Данные сейчас захардкожены в шаблоне. При масштабировании проекта стоит
 * вынести их в props/JSON/API.
 */
export default {
  name: 'TeamSection'
}
</script>
<script lang="ts" setup>
const komarovUrl = new URL('../../assets/png/face/komarov pic.png', import.meta.url).href
const ivanovaUrl = new URL('../../assets/png/face/ivanova pic.png', import.meta.url).href
const mironovaUrl = new URL('../../assets/png/face/mironova pic.png', import.meta.url).href
</script>

<style lang="scss" scoped>
.team-section {
  width: 100%;
  background-color: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  gap: 60px;
}

.team-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 800px;
  text-align: center;
}

.team-title {
  font-size: 48px;
  font-weight: 700;
  color: $primary-teal;
  margin: 0;
}

.team-subtitle {
  font-size: 22px;
  line-height: 1.6;
  color: $gray-700;
  opacity: 0.7;
  margin: 0;
}

.team-button {
  margin-top: 16px;
  padding: 15px 30px;
  background: linear-gradient(135deg, transparent, transparent);
  border: 2px solid $primary-mint;
  border-radius: 100px;
  color: $primary-teal;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, $primary-mint, $primary-cyan);
    transition: left 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(29, 233, 182, 0.3);

    &::before {
      left: 0;
    }
  }
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  width: 100%;
}

.team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.member-photo-wrapper {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(46, 172, 180, 0.2), rgba(29, 233, 182, 0.2));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: scale(1.05);

    &::after {
      opacity: 1;
    }
  }
}

.member-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.member-name {
  font-size: 22px;
  font-weight: 700;
  color: $primary-teal;
  margin: 0;
}

.member-role {
  font-size: 14px;
  font-weight: 500;
  color: $gray-700;
  opacity: 0.7;
  margin: 0;
  line-height: 1.4;
}

.member-social {
  display: flex;
  gap: 20px;
  margin-top: 12px;
}

.social-link {
  color: $gray-700;
  opacity: 0.7;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 50%;

  &:hover {
    opacity: 1;
    color: $white;
    background: linear-gradient(135deg, $primary-orange, $primary-yellow);
    transform: translateY(-2px);
  }

  &:nth-child(1):hover {
    background: linear-gradient(135deg, $primary-teal, $primary-mint);
  }

  &:nth-child(2):hover {
    background: linear-gradient(135deg, $primary-coral, $primary-orange);
  }

  &:nth-child(3):hover {
    background: linear-gradient(135deg, $primary-cyan, $primary-mint);
  }
}

// Планшеты
@media (max-width: $breakpoint-lg) {
  .team-section {
    padding: 60px 16px;
    gap: 48px;
  }

  .team-title {
    font-size: 40px;
  }

  .team-subtitle {
    font-size: 20px;
  }

  .team-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 36px;
  }
}

// Мобильные устройства
@media (max-width: $breakpoint-md) {
  .team-section {
    padding: 48px 16px;
    gap: 36px;
  }

  .team-header {
    gap: 20px;
  }

  .team-title {
    font-size: 32px;
    line-height: 1.2;
  }

  .team-subtitle {
    font-size: 18px;
    line-height: 1.5;
  }

  .team-button {
    font-size: 16px;
    padding: 14px 28px;
    min-height: 48px; // touch-friendly
  }

  .team-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    max-width: 400px;
  }

  .member-photo-wrapper {
    width: 140px;
    height: 140px;
  }

  .member-name {
    font-size: 20px;
  }

  .member-role {
    font-size: 14px;
    line-height: 1.4;
  }

  .social-link {
    padding: 12px;
    min-width: 44px; // touch-friendly
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 16px;
    }
  }
}

// Маленькие мобильные экраны
@media (max-width: $breakpoint-sm) {
  .team-section {
    padding: 36px 12px;
    gap: 28px;
  }

  .team-header {
    gap: 16px;
  }

  .team-title {
    font-size: 28px;
  }

  .team-subtitle {
    font-size: 16px;
  }

  .team-button {
    font-size: 15px;
    padding: 12px 24px;
    min-height: 44px;
  }

  .team-grid {
    gap: 24px;
  }

  .member-photo-wrapper {
    width: 120px;
    height: 120px;
  }

  .member-info {
    gap: 12px;
  }

  .member-name {
    font-size: 18px;
  }

  .member-role {
    font-size: 13px;
  }

  .member-social {
    gap: 12px;
  }

  .social-link {
    padding: 10px;
    min-width: 40px;
    min-height: 40px;

    i {
      font-size: 14px;
    }
  }
}
</style>
