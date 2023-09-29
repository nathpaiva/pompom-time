import {
  _hoisted_useIdentityContext,
  act,
  fetchMocker,
  render,
  screen,
  waitFor,
} from '@utils/test'

import { Workout } from '../Workout'
import { mockDataResponse, mockUser } from './mockDataResponse'

describe('Workout', () => {
  const { validUserMocked, invalidUserMocked } = mockUser()
  beforeEach(() => {
    fetchMocker.resetMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render a workout list', async () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

    fetchMocker.mockResponseOnce(JSON.stringify(mockDataResponse))

    render(<Workout />)

    act(() => expect(global.fetch).toHaveBeenCalled())

    await waitFor(() =>
      mockDataResponse.forEach((workout) =>
        expect(screen.getByText(workout.name)).toBeVisible(),
      ),
    )
  })

  it('should not render a workout list if the user is not authenticated', async () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(invalidUserMocked)

    render(<Workout />)

    // will never call the fetch API because the user token is invalid
    act(() => expect(global.fetch).not.toHaveBeenCalled())

    expect(true).toBeTruthy()

    await waitFor(() =>
      expect(
        screen.getByText("Oh no! You don't have any workout yet :("),
      ).toBeVisible(),
    )
  })

  it('should test the component if the request return status !== 200', async () => {
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue(validUserMocked)

    fetchMocker.mockRejectedValueOnce('invalid content type')

    render(<Workout />)

    act(() => expect(global.fetch).toHaveBeenCalled())

    await waitFor(() =>
      expect(
        screen.getByText("Sorry we could't load your workouts"),
      ).toBeVisible(),
    )
  })
})
