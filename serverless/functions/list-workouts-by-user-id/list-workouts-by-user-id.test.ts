import { HandlerEvent } from '@netlify/functions'

import {
  createMockContext,
  createMockHandlerEventBody,
} from '../../setup-server-tests'
import { handler as listWorkoutsByUserId } from './list-workouts-by-user-id'

describe('list-workouts-by-user-id', () => {
  it('should be true', async () => {
    const _mockUserContext = {
      user: {
        email: 'hello@nathpaiva.com.br',
      },
    }
    const _req = createMockHandlerEventBody<HandlerEvent['body']>(null)
    console.log(
      '🚀 ~ file: list-workouts-by-user-id.test.ts:14 ~ it ~ _req:',
      _req,
    )
    const response = await listWorkoutsByUserId(
      _req,
      createMockContext(_mockUserContext),
    )
    console.log(
      '🚀 ~ file: list-workouts-by-user-id.test.ts:12 ~ it ~ response:',
      response,
    )
    expect(true).toBeTruthy()
  })
})
