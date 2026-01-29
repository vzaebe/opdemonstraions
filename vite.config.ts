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
export default defineConfig(({ mode }) => ({
  // Абсолютная база для прод-сборки (GitHub Pages: /opdemonstraions/),
  // и обычный корень для разработки.
  base: mode === 'production'
    ? (process.env.VITE_DEPLOY_TARGET === 'ftp' ? './' : '/opdemonstraions/')
    : '/',
  publicDir: 'public',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173,
    strictPort: false, // Allow port fallback if 5173 is busy
    proxy: {
      '/api/v1': {
        target: process.env.VITE_PRINT_API_URL?.replace('/api/v1', '') || 'http://localhost:3100',
        changeOrigin: true,
        secure: false,
      },
      // Proxy API requests to backend server
      '/api': {
        target: process.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;\n`,
        // Silence Dart Sass deprecation spam (until tooling switches to the modern API)
        // https://sass-lang.com/documentation/breaking-changes/legacy-js-api/
        silenceDeprecations: ['legacy-js-api'] as any,
      }
    }
  }
}))
