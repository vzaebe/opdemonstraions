<template>
  <section class="gallery-section">
    <div class="gallery-container">
      <img class="gallery-image" src="@/assets/images/placeholder.svg" alt="Галерея 1" />
      <img class="gallery-image" src="@/assets/images/placeholder.svg" alt="Галерея 2" />
      <img class="gallery-image" src="@/assets/images/placeholder.svg" alt="Галерея 3" />
      <img class="gallery-image" src="@/assets/images/placeholder.svg" alt="Галерея 4" />
      <img class="gallery-image" src="@/assets/images/placeholder.svg" alt="Галерея 5" />
      <img class="gallery-image" src="@/assets/images/placeholder.svg" alt="Галерея 6" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'GallerySection'
}
</script>

<style lang="scss" scoped>
.gallery-section {
  width: 100%;
  height: 970px;
  background-color: $white;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 4rem 7rem 6rem 7rem;
}

.gallery-container {
  position: relative;
  width: 1170px;
  height: 802px;
}

.gallery-image {
  position: absolute;
  border-radius: $border-radius-lg;
  object-fit: cover;
  
  &:nth-child(1) {
    width: 24rem;
    height: 24rem;
    left: 0;
    top: 101px;
  }
  
  &:nth-child(2) {
    width: 24rem;
    height: 15rem;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
  
  &:nth-child(3) {
    width: 24rem;
    height: 12rem;
    left: 0;
    bottom: 0;
  }
  
  &:nth-child(4) {
    width: 24rem;
    height: 24rem;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }
  
  &:nth-child(5) {
    width: 20rem;
    height: 24rem;
    left: 820px;
    top: 47px;
  }
  
  &:nth-child(6) {
    width: 24rem;
    height: 24rem;
    right: 0;
    bottom: 0;
  }
}

@media (max-width: $breakpoint-lg) {
  .gallery-section {
    height: auto;
    padding: 2rem;
  }
  
  .gallery-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    position: static;
    width: 100%;
    height: auto;
  }
  
  .gallery-image {
    position: static;
    width: 100%;
    height: 200px;
    transform: none;
  }
}
</style> 