// @ts-check

import path from 'node:path'

import { livestoreDevtoolsPlugin } from '@livestore/devtools-vite'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
    livestoreDevtoolsPlugin({ schemaPath: './src/livestore/schema.ts' }),
  ],
  optimizeDeps: {
    // TODO remove once fixed https://github.com/vitejs/vite/issues/8427
    exclude: ['@livestore/wa-sqlite'],
  },
  server: {
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  worker: { format: 'es' },
})
