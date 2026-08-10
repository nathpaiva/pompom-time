import { expect, test } from './fixtures'

test.describe('Login page', () => {
  test('shows the sign in form', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByTestId('login-email')).toBeVisible()
    await expect(page.getByTestId('login-password')).toBeVisible()
    await page.screenshot({
      path: 'e2e/screenshots/login-form.png',
      fullPage: true,
    })
  })

  test('shows the sign up form', async ({ page }) => {
    await page.goto('/login')

    await page.getByTestId('register-tab').click()

    await expect(page.getByTestId('register-email')).toBeVisible()
    await expect(page.getByTestId('register-password')).toBeVisible()
    await expect(page.getByTestId('register-fullName')).toBeVisible()
    await page.screenshot({
      path: 'e2e/screenshots/register-form.png',
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
