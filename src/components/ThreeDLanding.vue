<template>
  <div class="three-d-landing">
    <div ref="sceneContainer" class="scene-container"></div>
    <div class="landing-content">
      <h1 ref="titleRef" class="landing-title">3D Печать</h1>
      <p class="landing-subtitle">Быстро. Качественно. Доступно.</p>
      <button class="cta-button" @click="scrollToCalculator">
        Рассчитать стоимость
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { Text } from 'troika-three-text'

const sceneContainer = ref<HTMLDivElement>()
const titleRef = ref<HTMLHeadingElement>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number
let text3D: Text
let cubes: THREE.Mesh[] = []

onMounted(() => {
  initScene()
  createFloatingCubes()
  create3DText()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
  renderer?.dispose()
  text3D?.dispose()
})

function initScene() {
  if (!sceneContainer.value) return

  // Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0a0e27, 1, 100)

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 30

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  sceneContainer.value.appendChild(renderer.domElement)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0x17a2b8, 1, 100)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  const pointLight2 = new THREE.PointLight(0xff6b6b, 0.8, 100)
  pointLight2.position.set(-10, -10, 10)
  scene.add(pointLight2)
}

function createFloatingCubes() {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  
  for (let i = 0; i < 20; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: Math.random() > 0.5 ? 0x17a2b8 : 0xff6b6b,
      transparent: true,
      opacity: 0.6,
    })
    
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50
    )
    cube.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )
    
    // Store rotation speed for animation
    cube.userData.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02,
    }
    
    cubes.push(cube)
    scene.add(cube)
  }
}

function create3DText() {
  // Create 3D text using Troika
  text3D = new Text()
  text3D.text = '3D ПЕЧАТЬ'
  text3D.fontSize = 4
  text3D.position.set(-15, 8, 0)
  text3D.color = 0x17a2b8
  text3D.anchorX = 'left'
  text3D.anchorY = 'middle'
  text3D.outlineWidth = 0.1
  text3D.outlineColor = 0xffffff
  
  scene.add(text3D)
  text3D.sync()
}

function animate() {
  animationId = requestAnimationFrame(animate)

  // Rotate cubes
  cubes.forEach((cube) => {
    cube.rotation.x += cube.userData.rotationSpeed.x
    cube.rotation.y += cube.userData.rotationSpeed.y
    cube.rotation.z += cube.userData.rotationSpeed.z
    
    // Floating animation
    cube.position.y += Math.sin(Date.now() * 0.001 + cube.position.x) * 0.01
  })

  // Animate 3D text
  if (text3D) {
    text3D.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1
    text3D.position.z = Math.sin(Date.now() * 0.001) * 2
  }

  // Camera movement based on mouse (simplified)
  camera.position.x = Math.sin(Date.now() * 0.0003) * 5
  camera.position.y = Math.cos(Date.now() * 0.0002) * 3
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}

function handleResize() {
  if (!renderer || !camera) return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function scrollToCalculator() {
  // Emit event or navigate
  window.location.href = '/print/calculator'
}
</script>

<style scoped lang="scss">
.three-d-landing {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
}

.scene-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.landing-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--spacing-6);
  color: white;
}

.landing-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: var(--spacing-4);
  text-shadow: 0 0 20px rgba(23, 162, 184, 0.5);
  animation: fadeInUp 1s ease-out;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

.landing-subtitle {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-8);
  opacity: 0.9;
  animation: fadeInUp 1s ease-out 0.2s backwards;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
}

.cta-button {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: 1.25rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(23, 162, 184, 0.3);
  transition: var(--transition-fast);
  animation: fadeInUp 1s ease-out 0.4s backwards;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(23, 162, 184, 0.5);
  }

  &:active {
    transform: translateY(-2px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
