import { HandlerEvent } from '@netlify/functions'

import {
  createMockContext,
  createMockHandlerEventBody,
} from '../../setup-server-tests'
import { handler as getWorkoutsById } from './get-workouts-by-id'

describe('get-workouts-by-id', () => {
  const _req = createMockHandlerEventBody<HandlerEvent['body']>(null)
  it('should return an error if the user is not authenticated', async () => {
    const { statusCode, body } = await getWorkoutsById(
      { ..._req, queryStringParameters: { workout_id: undefined } },
      createMockContext(),
    )

    if (statusCode === 200) {
      expect(statusCode).toEqual(500)
      return
    }

    expect(statusCode).toEqual(500)
    expect(JSON.parse(body).error).toEqual('You must be authenticated')
  })

  it('should return a workout with workout id and user id', async () => {
    const { statusCode, body } = await getWorkoutsById(
      {
        ..._req,
        queryStringParameters: {
          workout_id: '620dd7e6-eb9f-49be-8a9a-5e9f15b58e3c',
        },
      },
      createMockContext({
        user: {
          email: 'test-user-do-not-delete@nathpaiva.com',
          exp: Date.now(),
        },
      }),
    )

    if (statusCode === 500 || statusCode === 400) {
      expect(statusCode).toEqual(200)
      return
    }

    expect(statusCode).toEqual(200)
    expect(JSON.parse(body).length).toEqual(1)
  })

  it('should not return an workout if workout id is undefined ', async () => {
    const { statusCode, body } = await getWorkoutsById(
      { ..._req, queryStringParameters: { workout_id: undefined } },
      createMockContext({
        user: {
          email: 'test-user-do-not-delete@nathpaiva.com',
          exp: Date.now(),
        },
      }),
    )

    if (statusCode === 200) {
      expect(statusCode).toEqual(500)
      return
    }

    expect(statusCode).toEqual(500)
    expect(JSON.parse(body).error).toEqual(
      'expecting a value for non-nullable variable: "workout_id"',
    )
  })
})
