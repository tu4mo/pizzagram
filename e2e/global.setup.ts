import path from 'node:path'

import { test as setup } from '@playwright/test'
import dotenv from 'dotenv'

setup('Global Setup', async ({ page }) => {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

  await page.addInitScript((token) => {
    ;(window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = token
  }, process.env.PLAYWRIGHT_FIREBASE_APPCHECK_DEBUG_TOKEN)
})
