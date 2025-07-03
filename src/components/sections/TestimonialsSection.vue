<template>
  <section class="testimonials-section">
    <div class="testimonials-container">
      <div class="testimonial">
        <img class="testimonial-avatar" src="@/assets/png/1face.png" alt="Андрей Иванов" />
        <div class="testimonial-content">
          <p class="testimonial-text">
            Я поступил в бауманку, не смотря на инвалидность по слуху. Всё благодаря команде открытых перспектив и их проектам в университете
          </p>
          <p class="testimonial-author">Андрей иванов</p>
        </div>
      </div>
      <div class="testimonial">
        <img class="testimonial-avatar" src="@/assets/png/2face.png" alt="Алина Гришко" />
        <div class="testimonial-content">
          <p class="testimonial-text">
            Я из небольшого города из детского дома, Открытые Перспективы помогли мне поступить в Губкинский университет
          </p>
          <p class="testimonial-author">Алина гришко</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TestimonialsSection'
}
</script>

<style lang="scss" scoped>
.testimonials-section {
  width: 100%;
  min-height: 430px;
  background-color: $primary-teal;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7rem 0;
}

.testimonials-container {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
}

.testimonial {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: flex-end;
  width: 470px;
  height: 203px;
}

.testimonial-avatar {
  width: 4rem;
  height: 4rem;
  border-radius: $border-radius-full;
  object-fit: cover;
}

.testimonial-content {
  display: inline-flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  justify-content: flex-end;
  width: 24rem;
  height: 100%;
}

.testimonial-text {
  width: 100%;
  font-size: $text-xl;
  font-weight: 500;
  line-height: $leading-loose;
  color: $white;
  margin: 0;
}

.testimonial-author {
  opacity: $opacity-30;
  font-size: $text-sm;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: $leading-relaxed;
  color: $white;
  text-transform: uppercase;
  margin: 0;
}

@media (max-width: $breakpoint-lg) {
  .testimonial {
    width: 100%;
    height: auto;
    justify-content: center;
  }
}

@media (max-width: $breakpoint-md) {
  .testimonial {
    flex-direction: column;
    text-align: center;
  }
}
</style>