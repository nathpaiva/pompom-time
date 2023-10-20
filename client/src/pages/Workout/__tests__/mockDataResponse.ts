import { Variety_Enum } from '../../../../../serverless/functions/add-workout-by-user/types'
import { Workouts } from '../../../../../serverless/generated/graphql/GraphQLSchema'

export const mockDataResponse = [
  {
    created_at: new Date('2023-09-15T22:04:05.494429+00:00'),
    goal_per_day: 5,
    id: '2e5f8a76-2580-4a64-8a58-efffb037c3f4',
    interval: 0,
    name: 'First Workout',
    repeat: true,
    rest: 40,
    squeeze: 20,
    variety: Variety_Enum.Pulse,
    updated_at: new Date('2023-09-15T22:04:05.494429+00:00'),
    user_id: 'hello@nathpaiva.com.br',
  },
  {
    created_at: new Date('2023-09-16T01:16:33.008318+00:00'),
    goal_per_day: 5,
    id: 'e0a60f0b-0f03-449d-be11-0b8b835c213c',
    interval: 5,
    name: 'Second Workout',
    repeat: true,
    rest: 3,
    squeeze: 6,
    variety: Variety_Enum.Pulse,
    updated_at: new Date('2023-09-16T01:16:33.008318+00:00'),
    user_id: 'hello@nathpaiva.com.br',
  },
  {
    created_at: new Date('2023-09-16T01:18:28.377767+00:00'),
    goal_per_day: 5,
    id: '41d0c54d-a71f-4128-98e6-2b7ea95d0cc7',
    interval: 5,
    name: 'Third Workout',
    repeat: true,
    rest: 40,
    squeeze: 6,
    variety: Variety_Enum.Pulse,
    updated_at: new Date('2023-09-16T01:18:28.377767+00:00'),
    user_id: 'hello@nathpaiva.com.br',
  },
] satisfies Workouts[]

export const newMockDataResponse = {
  nodes: mockDataResponse,
}

const mockUser = () => {
  return {
    validUserMocked: {
      user: {
        token: {
          token_type: 'bearer',
          access_token: Date.now(),
          expires_at: Date.now() * 60,
        },
      },
      isLoggedIn: true,
      authedFetch: {
        get: vi.fn(),
        delete: vi.fn(),
        post: vi.fn(),
      },
    },
    invalidUserMocked: {
      isLoggedIn: false,
    },
  }
}

export { mockUser }
