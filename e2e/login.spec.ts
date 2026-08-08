import { expect, test } from './fixtures'

test.describe('Login page', () => {
  test('shows the login form', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByTestId('login-email')).toBeVisible()
    await expect(page.getByTestId('login-password')).toBeVisible()
    await page.screenshot({
      path: 'e2e/screenshots/login-form.png',
      fullPage: true,
    })
  })

  test('logs in and lands on the workout list', async ({
    page,
    loginAsTestUser,
  }) => {
    await loginAsTestUser()

    await expect(page).toHaveURL(/\/admin\/workout$/)
    await page.screenshot({
      path: 'e2e/screenshots/workout-list-after-login.png',
      fullPage: true,
    })
  })
})
