import { defineConfig, devices } from '@playwright/test'

const use = devices['iPhone 15']

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'Setup',
      testMatch: /global\.setup\.ts/,
      use,
    },
    {
      dependencies: ['Setup'],
      name: 'Mobile Safari',
      use,
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './',
  use: {
    baseURL: 'https://pizzagram.cc',
    trace: 'on-first-retry',
  },
  workers: process.env.CI ? 1 : undefined,
})
