import { expect, test } from './fixtures'

test.describe('Workout time (pulse screen)', () => {
  test.beforeEach(async ({ loginAsTestUser }) => {
    await loginAsTestUser()
  })

  test('opens a workout and shows the pulse screen', async ({ page }) => {
    const startLink = page.getByRole('link', { name: 'Start' }).first()

    const hasWorkout = await startLink
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false)

    test.skip(
      !hasWorkout,
      'No workout in the test user account. Create one first.',
    )

    await startLink.click()
    await page.waitForURL('**/admin/workout/start/*')

    await expect(
      page.getByRole('button', { name: 'Start workout' }),
    ).toBeVisible()
    await page.screenshot({
      path: 'e2e/screenshots/workout-time.png',
      fullPage: true,
    })
  })
})
