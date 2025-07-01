<template>
  <section class="about-section">
    <div class="about-background">
      <div class="overlay"></div>
      <div class="about-content">
        <h2 class="about-title">Больше, чем АНО</h2>
        <div class="about-features">
          <div class="feature">
            <HtmlFileIcon class="feature-icon smaller-icon" />
            <h3>Решения для всех</h3>
            <p>Разрабатываем открытые решения для обеспечения адаптации</p>
          </div>
          <div class="feature">
            <CircleIcon class="feature-icon" />
            <h3>Только реальное дело</h3>
            <p>Мы нацелены на работу в самых стабильных и важных отраслях российской экономики</p>
          </div>
          <div class="feature">
            <TgIcon class="feature-icon smaller-icon" />
            <h3>Главное результат</h3>
            <p>Наша задача качественно улучшить ситуацию с профориентацией в области инженерии</p>
          </div>
        </div>
        <div class="about-quote">
          <p>Сколько еще новых, неизведанных задач на этом пути предстоит решить специалистам, экспертам, организаторам! Хочется работать и работать, достигая новых высот и улучшая жизнь каждого.<br/>В этом и заключается смысл и цель работы нашей команды</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import HtmlFileIcon from '@/components/icons/HtmlFileIcon.vue'
import CircleIcon from '@/components/icons/CircleIcon.vue'
import TgIcon from '@/components/icons/TgIcon.vue'

export default {
  name: 'AboutSection',
  components: {
    HtmlFileIcon,
    CircleIcon,
    TgIcon
  }
}
</script>

<style lang="scss" scoped>
.about-section {
  width: 100%;
  height: 910px;
  position: relative;
}

.about-background {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/png/airplane.png');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00737A;
  opacity: 0.7;
}

.about-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.about-title {
  position: absolute;
  left: 215px;
  top: 100px;
  font-size: $text-5xl;
  font-weight: 700;
  color: $white;
  margin: 0;
  text-align: left;
}

.about-features {
  position: absolute;
  left: 215px;
  top: 222px;
  width: 768px;
  height: 486px;
}

.feature {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
  color: $white;
  text-align: left;
  
  &:nth-child(1) {
    left: 0;
    bottom: 0;
    width: 16rem;
    height: 13rem;
  }
  
  &:nth-child(2) {
    right: 0;
    top: 0;
    width: 24rem;
    height: 11rem;
  }
  
  &:nth-child(3) {
    left: 0;
    top: 0;
    width: 18rem;
    height: 14rem;
  }
}

.feature-icon {
  width: 48px;
  height: 48px;
}

.smaller-icon {
  width: 32px;
  height: 32px;
}

.feature h3 {
  font-size: $text-xl;
  font-weight: 500;
  line-height: $leading-relaxed;
  margin: 0;
}

.feature p {
  opacity: $opacity-70;
  font-size: $text-base;
  line-height: $leading-relaxed;
  margin: 0;
}

.about-quote {
  position: absolute;
  left: 615px;
  top: 456px;
  width: 570px;
  height: 330px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.25rem 4rem;
  border: 2px solid $white;
  border-radius: $border-radius-lg;
  
  p {
    font-size: $text-xl;
    font-weight: 500;
    line-height: $leading-loose;
    color: $white;
    width: 437px;
    margin: 0;
    text-align: left;
  }
}

@media (max-width: $breakpoint-lg) {
  .about-section {
    height: auto;
  }
  
  .about-title {
    position: static;
    margin-bottom: 2rem;
  }
  
  .about-features {
    position: static;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .feature {
    position: static;
    width: 100%;
    height: auto;
  }
  
  .about-quote {
    position: static;
    width: 100%;
    height: auto;
    margin-top: 2rem;
  }
}
</style> 