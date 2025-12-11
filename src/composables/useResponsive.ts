/**
 * Composable для работы с адаптивным дизайном
 * 
 * Предоставляет реактивные значения для определения текущего размера экрана
 * и утилиты для условного рендеринга на основе брейкпоинтов
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BREAKPOINTS } from '@/config/constants'

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Определяет текущий брейкпоинт на основе ширины окна
 */
function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.XXL) return '2xl'
  if (width >= BREAKPOINTS.XL) return 'xl'
  if (width >= BREAKPOINTS.LG) return 'lg'
  if (width >= BREAKPOINTS.MD) return 'md'
  return 'sm'
}

/**
 * Composable для отслеживания размера экрана и текущего брейкпоинта
 * 
 * @example
 * ```vue
 * <script setup>
 * const { width, height, breakpoint, isMobile, isTablet, isDesktop } = useResponsive()
 * </script>
 * ```
 */
export function useResponsive() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)
  const height = ref(typeof window !== 'undefined' ? window.innerHeight : 1080)
  const breakpoint = ref<Breakpoint>(getBreakpoint(width.value))

  const updateSize = () => {
    if (typeof window === 'undefined') return
    width.value = window.innerWidth
    height.value = window.innerHeight
    breakpoint.value = getBreakpoint(width.value)
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('resize', updateSize)
    updateSize()
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', updateSize)
  })

  // Вычисляемые свойства для удобства
  const isMobile = computed(() => breakpoint.value === 'sm')
  const isTablet = computed(() => breakpoint.value === 'md')
  const isDesktop = computed(() => ['lg', 'xl', '2xl'].includes(breakpoint.value))
  const isLargeDesktop = computed(() => ['xl', '2xl'].includes(breakpoint.value))

  return {
    width,
    height,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop
  }
}

/**
 * Проверяет, соответствует ли текущий размер экрана указанному брейкпоинту или больше
 */
export function useBreakpoint(minBreakpoint: Breakpoint) {
  const { breakpoint } = useResponsive()
  
  const breakpointOrder: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl']
  const minIndex = breakpointOrder.indexOf(minBreakpoint)
  const currentIndex = breakpointOrder.indexOf(breakpoint.value)
  
  return computed(() => currentIndex >= minIndex)
}

