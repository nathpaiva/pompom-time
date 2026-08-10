import { expect, test } from './fixtures'

test.describe('Welcome page', () => {
  test('shows the onboarding screen', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('pompom', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible()
    await page.screenshot({
      path: 'e2e/screenshots/welcome.png',
      fullPage: true,
    })
  })

  test('links to sign in', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Get started' }).click()

    await expect(page).toHaveURL(/\/login$/)
  })
})
