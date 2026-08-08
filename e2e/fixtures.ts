import { test as base } from '@playwright/test'

type Fixtures = {
  loginAsTestUser: () => Promise<void>
}

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  loginAsTestUser: async ({ page }, use) => {
    await use(async () => {
      const email = process.env.E2E_USER_EMAIL
      const password = process.env.E2E_USER_PASSWORD

      if (!email || !password) {
        throw new Error(
          'Missing E2E_USER_EMAIL / E2E_USER_PASSWORD. Copy e2e/env.e2e.example to .env.e2e.local and fill in a real test user.',
        )
      }

      await page.goto('/login')
      await page.getByTestId('login-email').fill(email)
      await page.getByTestId('login-password').fill(password)
      await page.getByRole('button', { name: 'Login' }).click()
      await page.waitForURL('**/admin/workout')
    })
  },
})

export { expect } from '@playwright/test'
