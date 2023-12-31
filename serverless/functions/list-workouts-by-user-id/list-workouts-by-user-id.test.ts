import { HandlerEvent } from '@netlify/functions'

import {
  createMockContext,
  createMockHandlerEventBody,
} from '../../setup-server-tests'
import { WorkoutsByUserIdQueryVariables } from './__generated__/list-workouts-by-user-id.graphql.generated'
import { handler as listWorkoutsByUserId } from './list-workouts-by-user-id'

describe('list-workouts-by-user-id', () => {
  const _req = createMockHandlerEventBody<
    HandlerEvent['body'],
    Pick<WorkoutsByUserIdQueryVariables, 'workout_name'>
  >(null, {
    workout_name: undefined,
  })
  it('should return an error if the user is not authenticated', async () => {
    const { statusCode, body } = await listWorkoutsByUserId(
      _req,
      createMockContext(),
    )

    if (statusCode === 200) {
      expect(statusCode).toEqual(500)
      return
    }

    expect(statusCode).toEqual(300)
    expect(JSON.parse(body).error).toEqual('You must be authenticated')
  })

  it('should return an workout list for an active user', async () => {
    const { statusCode, body } = await listWorkoutsByUserId(
      _req,
      createMockContext({
        user: {
          email: 'hello+no-remove@nathpaiva.com.br',
          exp: Date.now(),
        },
      }),
    )

    if (statusCode === 500 || statusCode === 400) {
      expect(statusCode).toEqual(200)
      return
    }

    expect(statusCode).toEqual(200)
    expect(JSON.parse(body).nodes.length).toEqual(4)
  })

  it('should return an empty list for active user', async () => {
    const { statusCode, body } = await listWorkoutsByUserId(
      _req,
      createMockContext({
        user: {
          email: 'test-empty@nathpaiva.com',
          exp: Date.now(),
        },
      }),
    )

    if (statusCode === 500 || statusCode === 400) {
      expect(statusCode).toEqual(200)
      return
    }

    expect(statusCode).toEqual(200)
    expect(JSON.parse(body).nodes.length).toEqual(0)
  })
})
