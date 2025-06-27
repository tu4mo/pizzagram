import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'Setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      dependencies: ['Setup'],
      name: 'Mobile Safari',
      use: { ...devices['iPhone 15'] },
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
