<template>
  <div class="model-viewer-3d">
    <div ref="containerRef" class="viewer-container"></div>
    
    <div class="viewer-controls">
      <button @click="resetCamera" class="control-btn" title="Сброс камеры">🔄</button>
      <button @click="toggleWireframe" class="control-btn" title="Каркас">
        {{ wireframe ? '🔲' : '⬜' }}
      </button>
      <button @click="toggleGrid" class="control-btn" title="Сетка">
        {{ showGrid ? '📐' : '📏' }}
      </button>
    </div>

    <div v-if="loading" class="viewer-loading">Загрузка модели...</div>
    <div v-if="error" class="viewer-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface Props {
  modelUrl?: string
  modelData?: ArrayBuffer
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
})

const containerRef = ref<HTMLDivElement>()
const loading = ref(false)
const error = ref<string | null>(null)
const wireframe = ref(false)
const showGrid = ref(true)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let mesh: THREE.Mesh | null = null
let grid: THREE.GridHelper
let bbox: THREE.Box3
let animationId: number

onMounted(() => {
  initScene()
  animate()
  if (props.modelUrl || props.modelData) {
    loadModel()
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  renderer?.dispose()
  controls?.dispose()
})

watch(() => [props.modelUrl, props.modelData], () => {
  if (props.modelUrl || props.modelData) {
    loadModel()
  }
})

function initScene() {
  if (!containerRef.value) return

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf8f9fa)

  // Camera
  camera = new THREE.PerspectiveCamera(
    45,
    props.width / props.height,
    0.1,
    10000
  )
  camera.position.set(100, 100, 100)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(props.width, props.height)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  // Grid
  grid = new THREE.GridHelper(200, 20, 0x888888, 0xcccccc)
  scene.add(grid)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  controls?.update()
  renderer?.render(scene, camera)
}

async function loadModel() {
  loading.value = true
  error.value = null

  try {
    // Remove old mesh
    if (mesh) {
      scene.remove(mesh)
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    }

    // TODO: Implement STL/3MF parser
    // For now, just show a placeholder cube
    const geometry = new THREE.BoxGeometry(50, 50, 50)
    const material = new THREE.MeshPhongMaterial({
      color: 0x17a2b8,
      wireframe: wireframe.value,
    })
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Calculate bounding box
    bbox = new THREE.Box3().setFromObject(mesh)
    const center = bbox.getCenter(new THREE.Vector3())
    const size = bbox.getSize(new THREE.Vector3())

    // Center model
    mesh.position.sub(center)

    // Adjust camera
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.fov * (Math.PI / 180)
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
    cameraZ *= 2 // Zoom out a bit
    camera.position.set(cameraZ, cameraZ, cameraZ)
    camera.lookAt(0, 0, 0)
    controls.target.set(0, 0, 0)
    controls.update()

    loading.value = false
  } catch (err: any) {
    error.value = 'Ошибка загрузки модели: ' + err.message
    loading.value = false
  }
}

function resetCamera() {
  if (bbox) {
    const size = bbox.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.fov * (Math.PI / 180)
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
    cameraZ *= 2
    camera.position.set(cameraZ, cameraZ, cameraZ)
    camera.lookAt(0, 0, 0)
    controls.target.set(0, 0, 0)
    controls.update()
  }
}

function toggleWireframe() {
  wireframe.value = !wireframe.value
  if (mesh && mesh.material) {
    ;(mesh.material as THREE.MeshPhongMaterial).wireframe = wireframe.value
  }
}

function toggleGrid() {
  showGrid.value = !showGrid.value
  grid.visible = showGrid.value
}
</script>

<style scoped lang="scss">
.model-viewer-3d {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.viewer-container {
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background: #f8f9fa;
}

.viewer-controls {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  display: flex;
  gap: var(--spacing-2);
}

.control-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--border-radius-md);
  background: white;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  font-size: 1.25rem;
  transition: var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

.viewer-loading,
.viewer-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: var(--spacing-4);
  background: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}

.viewer-error {
  color: #c33;
}
</style>
