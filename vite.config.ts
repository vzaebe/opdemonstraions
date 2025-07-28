import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

/**
 * Vite конфигурация проекта.
 *  - Плагин `@vitejs/plugin-vue` — поддержка .vue файлов.
 *  - `vite-plugin-vue-devtools` — включает Vue Devtools в dev-сборке.
 *  - Опция `base: './'` позволяет корректно работать с относительными путями при деплое на GitHub Pages / статический хостинг.
 *  - В `resolve.alias` используется символ `@` для удобного импорта из `src`.
 *  - В `css.preprocessorOptions.scss.additionalData` мы автоматически подключаем variables.scss во все scss-файлы.
 */
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;`
      }
    }
  }
})
