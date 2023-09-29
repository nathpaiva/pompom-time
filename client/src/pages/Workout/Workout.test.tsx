import {
  FetchApi,
  _hoisted_useIdentityContext,
  act,
  render,
  screen,
  waitFor,
} from '@utils/test'

import { Workout } from './Workout'

const { mockedFetch } = FetchApi()

const mockDataResponse = [
  {
    created_at: '2023-09-15T22:04:05.494429+00:00',
    goal_per_day: 5,
    id: '2e5f8a76-2580-4a64-8a58-efffb037c3f4',
    interval: 0,
    name: 'First Workout',
    repeat: true,
    rest: 40,
    squeeze: 20,
    stop_after: 4,
    type: 'pulse',
    updated_at: '2023-09-15T22:04:05.494429+00:00',
    user_id: 'hello@nathpaiva.com.br',
  },
  {
    created_at: '2023-09-16T01:16:33.008318+00:00',
    goal_per_day: 5,
    id: 'e0a60f0b-0f03-449d-be11-0b8b835c213c',
    interval: 5,
    name: 'Second Workout',
    repeat: true,
    rest: 40,
    squeeze: 6,
    stop_after: 10,
    type: 'pulse',
    updated_at: '2023-09-16T01:16:33.008318+00:00',
    user_id: 'hello@nathpaiva.com.br',
  },
  {
    created_at: '2023-09-16T01:18:28.377767+00:00',
    goal_per_day: 5,
    id: '41d0c54d-a71f-4128-98e6-2b7ea95d0cc7',
    interval: 5,
    name: 'Third Workout',
    repeat: true,
    rest: 40,
    squeeze: 6,
    stop_after: 10,
    type: 'pulse',
    updated_at: '2023-09-16T01:18:28.377767+00:00',
    user_id: 'hello@nathpaiva.com.br',
  },
]

describe('Workout', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render a workout list', async () => {
    mockedFetch(mockDataResponse)

    vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
      user: {
        token: {
          access_token: '123',
        },
      },
      isLoggedIn: true,
    })

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

    vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
      isLoggedIn: false,
    })

    render(<Workout />)

    act(() => expect(global.fetch).not.toHaveBeenCalled())

    // screen.debug()

    expect(true).toBeTruthy()

    await waitFor(() =>
      expect(
        screen.getByText("Oh no! You don't have any workout yet :("),
      ).toBeVisible(),
    )
  })
})
