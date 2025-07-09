// @ts-check

import path from 'node:path'
import process from 'node:process'

import { livestoreDevtoolsPlugin } from '@livestore/devtools-vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

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
