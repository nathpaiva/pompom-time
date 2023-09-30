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
  const { validUserMocked } = mockUser()
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
