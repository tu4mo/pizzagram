import path from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    cssCodeSplit: false,
    sourcemap: true,
    target: 'esnext',
  },
  define: {
    // https://docs.sentry.io/platforms/javascript/configuration/tree-shaking/
    __SENTRY_DEBUG__: JSON.stringify(false),
  },
  esbuild: { legalComments: 'none' },
  plugins: [
    vue({
      features: {
        optionsAPI: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
  test: {
    dir: './src',
    environment: 'jsdom',
    globals: true,
  },
})
