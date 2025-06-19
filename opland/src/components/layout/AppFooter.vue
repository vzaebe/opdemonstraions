<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">Открытые Перспективы</h3>
          <p class="footer-description">
            Создаём инклюзивное будущее для всех через образование и технологии
          </p>
          <div class="footer-social">
            <a href="#" class="social-link">
              <img src="@/assets/images/icon.svg" alt="Telegram" />
            </a>
            <a href="#" class="social-link">
              <img src="@/assets/images/icon.svg" alt="VK" />
            </a>
            <a href="#" class="social-link">
              <img src="@/assets/images/icon.svg" alt="YouTube" />
            </a>
          </div>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">Проекты</h4>
          <ul class="footer-links">
            <li><a href="#">Перевод науки на РЖЯ</a></li>
            <li><a href="#">Инклюзивные лекции</a></li>
            <li><a href="#">Летние интенсивы</a></li>
            <li><a href="#">База знаний</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">Поддержка</h4>
          <ul class="footer-links">
            <li><a href="#">Волонтёрство</a></li>
            <li><a href="#">Партнёрство</a></li>
            <li><a href="#">Пожертвования</a></li>
            <li><a href="#">Контакты</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4 class="footer-subtitle">Контакты</h4>
          <div class="footer-contact">
            <p>Email: info@opland.ru</p>
            <p>Телефон: +7 (495) 123-45-67</p>
            <p>Адрес: г. Москва, ул. Примерная, д. 123</p>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="copyright">
          © 2024 Открытые Перспективы. Все права защищены.
        </p>
        <div class="footer-legal">
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Условия использования</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style lang="scss" scoped>
.app-footer {
  width: 100%;
  background-color: $gray-900;
  color: $white;
  padding: 4rem 2rem 2rem 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-size: $text-xl;
  font-weight: 700;
  color: $primary-green;
  margin: 0;
}

.footer-description {
  font-size: $text-sm;
  line-height: $leading-relaxed;
  color: $gray-300;
  margin: 0;
}

.footer-social {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: $gray-800;
  border-radius: $border-radius-md;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: $primary-green;
  }
  
  img {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.footer-subtitle {
  font-size: $text-base;
  font-weight: 600;
  color: $white;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  li a {
    font-size: $text-sm;
    color: $gray-300;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: $primary-green;
    }
  }
}

.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  p {
    font-size: $text-sm;
    color: $gray-300;
    margin: 0;
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid $gray-800;
  
  .copyright {
    font-size: $text-sm;
    color: $gray-400;
    margin: 0;
  }
  
  .footer-legal {
    display: flex;
    gap: 2rem;
    
    a {
      font-size: $text-sm;
      color: $gray-400;
      text-decoration: none;
      transition: color 0.2s ease;
      
      &:hover {
        color: $primary-green;
      }
    }
  }
}

@media (max-width: $breakpoint-lg) {
  .footer-content {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: $breakpoint-md) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-social {
    justify-content: center;
  }
  
  .footer-legal {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 