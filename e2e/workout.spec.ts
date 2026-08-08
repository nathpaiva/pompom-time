import { expect, test } from './fixtures'

test.describe('Workout list', () => {
  test.beforeEach(async ({ loginAsTestUser }) => {
    await loginAsTestUser()
  })

  test('shows the workout list and add-workout form', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/workout$/)
    await page.screenshot({
      path: 'e2e/screenshots/workout-list.png',
      fullPage: true,
    })
  })
})
