import crypto from 'node:crypto'

import { expect, test } from '@playwright/test'

const username = crypto.randomBytes(6).toString('hex')
const email = `${username}@pizzagram.cc`
const password = 'password'

test('Sign Up', async ({ page }) => {
  await page.addInitScript((token) => {
    ;(window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = token
  }, process.env.PLAYWRIGHT_FIREBASE_APPCHECK_DEBUG_TOKEN)

  await page.goto('/')

  await page.getByRole('button', { name: 'Menu' }).click()
  await page.getByRole('button', { name: 'Log In' }).click()
  await page.getByRole('link', { name: 'Sign Up' }).click()

  await page.getByPlaceholder('Username').fill(username)
  await page.getByPlaceholder('E-mail').fill(email)
  await page.getByPlaceholder('Password').fill(password)
  await page.getByRole('button', { name: 'Sign Up' }).click()

  await page.waitForURL('/')

  await page.getByRole('link', { name: 'Profile' }).click()

  await expect(page).toHaveURL(`/profile/${username}`)
  await expect(page).toHaveTitle(`${username} - Pizzagram`)

  await page.goto('/account')

  page.on('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Delete Account' }).click()

  await page.waitForURL('/')
})
