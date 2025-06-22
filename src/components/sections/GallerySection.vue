<template>
  <section class="gallery-section">
    <div class="gallery-container">
      <img class="gallery-image" src="@/assets/randomPhotos/Image 06.png" alt="Галерея 1" />
      <img class="gallery-image" src="@/assets/randomPhotos/Image 05.png" alt="Галерея 2" />
      <img class="gallery-image" src="@/assets/randomPhotos/Image 04.png" alt="Галерея 3" />
      <img class="gallery-image" src="@/assets/randomPhotos/Image 03.png" alt="Галерея 4" />
      <img class="gallery-image" src="@/assets/randomPhotos/Image 02.png" alt="Галерея 5" />
      <img class="gallery-image" src="@/assets/randomPhotos/Image 01.png" alt="Галерея 6" />
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
  width: 1400px;
  height: 970px;
  padding-left: 115px;
  padding-right: 115px;
  padding-top: 68px;
  padding-bottom: 100px;
  background-color: $white;
  display: inline-flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}

.gallery-container {
  width: 1170px;
  height: 802px;
  position: relative;
}

.gallery-image {
  position: absolute;
  border-radius: 10px;
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  // img1 - 370x461, left: 0px, top: 101px
  &:nth-child(1) {
    width: 370px;
    height: 461px;
    left: 0px;
    top: 101px;
  }
  
  // img2 - 370x238, left: 400px, top: 0px
  &:nth-child(2) {
    width: 370px;
    height: 238px;
    left: 400px;
    top: 0px;
  }
  
  // img3 - 370x193, left: 0px, top: 609px
  &:nth-child(3) {
    width: 370px;
    height: 193px;
    left: 0px;
    top: 609px;
  }
  
  // img4 - 370x498, left: 400px, top: 304px
  &:nth-child(4) {
    width: 370px;
    height: 498px;
    left: 400px;
    top: 304px;
  }
  
  // img5 - 331x370, left: 820px, top: 47px
  &:nth-child(5) {
    width: 331px;
    height: 370px;
    left: 820px;
    top: 47px;
  }
  
  // img6 - 370x370, left: 800px, top: 432px
  &:nth-child(6) {
    width: 370px;
    height: 370px;
    left: 800px;
    top: 432px;
  }
}

@media (max-width: $breakpoint-lg) {
  .gallery-section {
    width: 100%;
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