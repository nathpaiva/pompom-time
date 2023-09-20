import {
  _hoisted_useIdentityContext,
  act,
  render,
  screen,
  waitFor,
} from '@utils/test'

import { Workout } from './Workout'

describe('Workout', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render the app with two buttons', async () => {
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
    const mockFunc = {
      get: vi.fn().mockResolvedValue(act(() => mockDataResponse)),
    }
    vi.mocked(_hoisted_useIdentityContext).mockReturnValue({
      isLoggedIn: true,
      authedFetch: {
        get: mockFunc.get,
        delete: vi.fn(),
      },
    })
    render(<Workout />)

    expect(mockFunc.get).toHaveBeenCalled()

    await waitFor(() =>
      mockDataResponse.forEach((workout) =>
        expect(screen.getByText(workout.name)).toBeVisible(),
      ),
    )
  })
})