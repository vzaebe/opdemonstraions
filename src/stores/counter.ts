import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * Пример хранилища Pinia «счётчик».
 * Используется как демонстрация возможностей Pinia во Vue-проекте.
 * Содержит:
 *  - `count` — реактивное состояние (ref)
 *  - `doubleCount` — вычисляемое значение (computed), удвоенное значение count
 *  - `increment` — действие (action), увеличивающее счётчик
 */
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0) // Текущее значение счётчика
  const doubleCount = computed(() => count.value * 2) // Удвоенный счётчик
  function increment() {
    // Простое действие для инкремента значения
    count.value++
  }

  return { count, doubleCount, increment }
})
