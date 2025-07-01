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
          <img class="member-photo" src="@/assets/png/face/komarov pic.png" alt="Дмитрий Комаров" />
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
          <img class="member-photo" src="@/assets/png/face/ivanova pic.png" alt="Ольга Иванова" />
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
          <img class="member-photo" src="@/assets/png/face/mironova pic.png" alt="София Миронова" />
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

<script>
export default {
  name: 'TeamSection'
}
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

@media (max-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .team-section {
    padding: 60px 16px;
  }

  .team-title {
    font-size: 36px;
  }

  .team-subtitle {
    font-size: 18px;
  }

  .team-grid {
    grid-template-columns: 1fr;
  }

  .member-photo-wrapper {
    width: 150px;
    height: 150px;
  }
}
</style> 