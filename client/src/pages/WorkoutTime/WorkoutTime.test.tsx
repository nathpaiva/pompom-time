import {
  _hoisted_useIdentityContext,
  render,
  screen,
  waitFor,
} from '@utils/test'
import { Route, Routes } from 'react-router-dom'

import {
  mockDataResponse,
  mockUser,
} from '../Workout/__tests__/mockDataResponse'
import { WorkoutTime } from './WorkoutTime'

describe('Page::WorkoutTime', () => {
  const { validUserMocked } = mockUser()

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render the workout name, set count and variety pills once loaded', async () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)
    const workout = mockDataResponse[0]
    validUserMocked.authedFetch.get.mockResolvedValue(workout)

    render(
      <Routes>
        <Route
          path="/admin/workout/start/:workout_id"
          element={<WorkoutTime />}
        />
      </Routes>,
      { initialEntries: `/admin/workout/start/${workout.id}` },
    )

    await waitFor(() => {
      expect(screen.getByText(workout.name)).toBeVisible()
    })

    expect(screen.getByText(`Set 1 of ${workout.goal_per_day}`)).toBeVisible()
    expect(screen.getByText(workout.variety)).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByLabelText('Back')).toHaveAttribute(
      'href',
      '/admin/workout',
    )

    // idle state: reset is disabled, primary button is enabled and shows 0/squeeze
    expect(screen.getByText(`0/${workout.squeeze}`)).toBeVisible()
    expect(screen.getByText('Start workout')).toBeEnabled()
    expect(screen.getByText('Reset')).toBeDisabled()
  })
})
