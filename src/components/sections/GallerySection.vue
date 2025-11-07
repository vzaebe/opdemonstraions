<template>
  <section class="gallery-section">
    <div class="gallery-container">
      <img class="gallery-image" :src="g06" alt="Галерея 1" />
      <img class="gallery-image" :src="g05" alt="Галерея 2" />
      <img class="gallery-image" :src="g04" alt="Галерея 3" />
      <img class="gallery-image" :src="g03" alt="Галерея 4" />
      <img class="gallery-image" :src="g02" alt="Галерея 5" />
      <img class="gallery-image" :src="g01" alt="Галерея 6" />
    </div>
  </section>
</template>

<script lang="ts">
/**
 * Секция «Галерея» (GallerySection).
 * Статическая мозаика из шести изображений, расположенных абсолютным
 * позиционированием на десктопе и CSS-grid на мобильных.
 */
export default {
  name: 'GallerySection'
}
</script>

<script lang="ts" setup>
const g06 = new URL('../../assets/randomPhotos/Image 06.png', import.meta.url).href
const g05 = new URL('../../assets/randomPhotos/Image 05.png', import.meta.url).href
const g04 = new URL('../../assets/randomPhotos/Image 04.png', import.meta.url).href
const g03 = new URL('../../assets/randomPhotos/Image 03.png', import.meta.url).href
const g02 = new URL('../../assets/randomPhotos/Image 02.png', import.meta.url).href
const g01 = new URL('../../assets/randomPhotos/Image 01.png', import.meta.url).href
</script>

<style lang="scss" scoped>
.gallery-section {
  width: 100%;
  background: $primary-teal;
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
}

.gallery-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  height: 600px;
  display: none;
}

.gallery-image {
  position: absolute;
  object-fit: cover;
  border-radius: $border-radius-md;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.gallery-image:nth-child(1) {
  width: 300px;
  height: 200px;
  top: 50px;
  left: 50px;
  z-index: 5;
}

.gallery-image:nth-child(2) {
  width: 250px;
  height: 180px;
  top: 100px;
  left: 380px;
  z-index: 4;
}

.gallery-image:nth-child(3) {
  width: 280px;
  height: 200px;
  top: 10px;
  right: 100px;
  z-index: 3;
}

.gallery-image:nth-child(4) {
  width: 220px;
  height: 180px;
  bottom: 80px;
  left: 100px;
  z-index: 2;
}

.gallery-image:nth-child(5) {
  width: 260px;
  height: 190px;
  bottom: 50px;
  left: 400px;
  z-index: 1;
}

.gallery-image:nth-child(6) {
  width: 300px;
  height: 210px;
  bottom: 10px;
  right: 80px;
  z-index: 0;
}

@media (max-width: $breakpoint-lg) {
  .gallery-section {
    padding: 3rem 1rem;
  }

  .gallery-container {
    height: 500px;
  }

  .gallery-image:nth-child(1) {
    width: 200px;
    height: 150px;
    top: 30px;
    left: 20px;
  }

  .gallery-image:nth-child(2) {
    width: 180px;
    height: 140px;
    top: 60px;
    left: 250px;
  }

  .gallery-image:nth-child(3) {
    width: 200px;
    height: 150px;
    top: 0;
    right: 50px;
  }

  .gallery-image:nth-child(4) {
    width: 160px;
    height: 140px;
    bottom: 60px;
    left: 50px;
  }

  .gallery-image:nth-child(5) {
    width: 180px;
    height: 140px;
    bottom: 40px;
    left: 250px;
  }

  .gallery-image:nth-child(6) {
    width: 200px;
    height: 150px;
    bottom: 0;
    right: 40px;
  }
}

@media (max-width: $breakpoint-md) {
  .gallery-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    height: auto;
  }

  .gallery-image {
    position: static !important;
    width: 100% !important;
    height: 160px !important;
    z-index: 0 !important;
  }
}

@media (max-width: $breakpoint-sm) {
  .gallery-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .gallery-image {
    height: 160px;
  }
}
</style>


