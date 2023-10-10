import { HandlerEvent } from '@netlify/functions'

import {
  createMockContext,
  createMockHandlerEventBody,
} from '../../setup-server-tests'
import { handler as listWorkoutsByUserId } from './list-workouts-by-user-id'

describe('list-workouts-by-user-id', () => {
  const _req = createMockHandlerEventBody<HandlerEvent['body']>(null)
  it('should return an error if the user is not authenticated', async () => {
    const { statusCode, body } = await listWorkoutsByUserId(
      { ..._req, queryStringParameters: undefined },
      createMockContext(),
    )

    if (statusCode === 200) {
      expect(statusCode).toEqual(500)
      return
    }

    expect(statusCode).toEqual(500)
    expect(JSON.parse(body).error).toEqual('You must be authenticated')
  })

  it('should return a list for active user', async () => {
    const { statusCode, body } = await listWorkoutsByUserId(
      { ..._req, queryStringParameters: undefined },
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
    expect(JSON.parse(body).nodes.length).toEqual(4)
  })

  it('should return an empty list for active user', async () => {
    const { statusCode, body } = await listWorkoutsByUserId(
      { ..._req, queryStringParameters: undefined },
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
