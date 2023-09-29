import {
  _hoisted_useIdentityContext,
  act,
  render,
  screen,
  waitFor,
} from '@utils/test'

import { Workout } from '../Workout'
import { mockDataResponse, mockUser, mockedFetch } from './mockDataResponse'

describe('Workout', () => {
  const { validUserMocked, invalidUserMocked } = mockUser()
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render a workout list', async () => {
    mockedFetch(mockDataResponse)

    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

    render(<Workout />)

    act(() => expect(global.fetch).toHaveBeenCalled())

    await waitFor(() =>
      mockDataResponse.forEach((workout) =>
        expect(screen.getByText(workout.name)).toBeVisible(),
      ),
    )
  })

  it('should not render a workout list if the user is not authenticated', async () => {
    mockedFetch(mockDataResponse)

    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(invalidUserMocked)

    render(<Workout />)

    act(() => expect(global.fetch).not.toHaveBeenCalled())

    expect(true).toBeTruthy()

    await waitFor(() =>
      expect(
        screen.getByText("Oh no! You don't have any workout yet :("),
      ).toBeVisible(),
    )
  })
})
