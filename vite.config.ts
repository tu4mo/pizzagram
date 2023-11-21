import path from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    cssCodeSplit: false,
    sourcemap: true,
  },
  define: {
    __SENTRY_DEBUG__: JSON.stringify(false),
    __SENTRY_TRACING__: JSON.stringify(false),
  },
  esbuild: { legalComments: 'none' },
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
})
