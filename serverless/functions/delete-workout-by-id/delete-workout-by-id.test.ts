import {
  createMockContext,
  createMockHandlerEventBody,
} from '../../setup-server-tests'
import { handler as addWorkoutByUser } from '../add-workout-by-user/add-workout-by-user'
import {
  Variety_Enum,
  TAddWorkoutByUserMutationVariables,
} from '../add-workout-by-user/types'
import { DeleteWorkoutByIdMutationVariables } from './__generated__/delete-workout-by-id.graphql.generated'
import { handler as deleteWorkoutById } from './delete-workout-by-id'

describe('delete-workout-by-id', () => {
  it('should delete an workout', async () => {
    const _mockUserContext = {
      user: {
        email: 'test-user@nathpaiva.com',
        exp: Date.now(),
      },
    }

    const _globalMockData = {
      goal_per_day: 5,
      name: 'First Workout',
      repeat: true,
      rest: 40,
      squeeze: 20,
      interval: 10,
      variety: Variety_Enum.Resistance,
    } as unknown as TAddWorkoutByUserMutationVariables
    const requestContext = createMockContext(_mockUserContext)
    const reqCreation = createMockHandlerEventBody<
      TAddWorkoutByUserMutationVariables,
      null
    >(_globalMockData, null)

    const { statusCode, body } = await addWorkoutByUser(
      { ...reqCreation, queryStringParameters: {} },
      requestContext,
    )
    if (statusCode === 500 || statusCode === 400) {
      expect(statusCode).toEqual(200)
    }

    const { id } = JSON.parse(body)

    const reqDelete = createMockHandlerEventBody<
      DeleteWorkoutByIdMutationVariables,
      null
    >(
      {
        id,
      },
      null,
    )

    const { statusCode: deleteStatusCode, body: deleteBody } =
      await deleteWorkoutById(
        { ...reqDelete, queryStringParameters: {} },
        requestContext,
      )

    if (deleteStatusCode === 500 || deleteStatusCode === 400) {
      expect(deleteStatusCode).toEqual(200)
    }

    expect(JSON.parse(deleteBody).id).toEqual(id)
  })

  it('should not delete workout if the use is not authenticated', async () => {
    const reqDelete = createMockHandlerEventBody<
      DeleteWorkoutByIdMutationVariables,
      null
    >(
      {
        id: Date.now(),
      },
      null,
    )
    const requestContext = createMockContext()
    const { statusCode, body } = await deleteWorkoutById(
      { ...reqDelete, queryStringParameters: {} },
      requestContext,
    )
    if (statusCode === 200) {
      expect(statusCode).toEqual(500)
    }

    expect(JSON.parse(body).error).toEqual('You must be authenticated')
  })

  it('should not delete workout if the request body is inconsistent', async () => {
    const _mockUserContext = {
      user: {
        email: 'test-user@nathpaiva.com',
        exp: Date.now(),
      },
    }

    const requestContext = createMockContext(_mockUserContext)

    const { statusCode, body } = await deleteWorkoutById(
      {} as any,
      requestContext,
    )
    if (statusCode === 200) {
      expect(statusCode).toEqual(500)
    }

    expect(JSON.parse(body).error).toEqual('You should provide the workout id.')
  })
})
