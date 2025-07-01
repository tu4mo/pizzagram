import path from 'node:path'

import { test as setup } from '@playwright/test'
import dotenv from 'dotenv'

setup('Global Setup', () => {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') })
})
