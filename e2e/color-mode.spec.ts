import { expect, test } from './fixtures'

test.describe('color mode', () => {
  test.beforeEach(async ({ page }) => {
    // Simulate a browser that used the old dark-mode build: Chakra stores the
    // mode in localStorage, and that value used to win over the app's own
    // light-mode config. See issue #113.
    await page.addInitScript(() => {
      window.localStorage.setItem('chakra-ui-color-mode', 'dark')
    })
  })

  test('renders /login on the cream background even with dark stored', async ({
    page,
  }) => {
    await page.goto('/login')

    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(243, 236, 231)',
    )
    await expect(page.getByText('Welcome back')).toBeVisible()

    await page.screenshot({
      path: 'e2e/screenshots/color-mode-login.png',
      fullPage: true,
    })
  })

  test('renders the workout list on the cream background even with dark stored', async ({
    page,
    loginAsTestUser,
  }) => {
    await loginAsTestUser()

    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(243, 236, 231)',
    )
    await expect(
      page.getByRole('heading', { name: /select workout|don't have any workout/i }),
    ).toBeVisible()

    await page.screenshot({
      path: 'e2e/screenshots/color-mode-workout-list.png',
      fullPage: true,
    })
  })
})
