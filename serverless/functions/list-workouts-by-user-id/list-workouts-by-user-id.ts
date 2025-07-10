import { ClientError, request } from 'graphql-request'

import { ErrorHandler, errorResolver, graphQLClientConfig } from '../../utils'
import {
  WorkoutsByUserIdDocument,
  WorkoutsByUserIdQueryVariables,
} from './__generated__/list-workouts-by-user-id.graphql.generated'
import type { PromiseResponseListWorkoutsByUserId } from './types'

type StatusCode = 400 | 500 | 300

const listWorkoutsByUserId = async (
  {
    queryStringParameters,
  }: HandlerEvent<
    unknown,
    Pick<WorkoutsByUserIdQueryVariables, 'workout_name'>
  >,
  { clientContext }: Context,
): PromiseResponseListWorkoutsByUserId => {
  const config = graphQLClientConfig()
  try {
    if (!clientContext?.user || clientContext.user.exp * 1000 < Date.now()) {
      throw new ErrorHandler({
        message: 'You must be authenticated',
        status: 300,
      })
    }

    const { workouts_aggregate } = await request({
      variables: {
        user_id: clientContext.user.email,
        workout_name: `%${queryStringParameters?.workout_name ?? ''}%`,
        limit: 5,
      },
      document: WorkoutsByUserIdDocument,
      ...config,
    })

    if (workouts_aggregate.aggregate === null) {
      throw new ErrorHandler({
        message: 'Request is wrong',
        status: 400,
      })
    }

    return {
      statusCode: 200,
      body: JSON.stringify(workouts_aggregate),
    }
  } catch (error) {
    let statusCode: StatusCode = 500

    const message = errorResolver(error as ClientError | ErrorHandler)

    if (error instanceof ErrorHandler) {
      statusCode = error.status
    }

    return {
      statusCode,
      body: JSON.stringify({ error: message }),
    }
  }
}

export {
  listWorkoutsByUserId as handler,
  type PromiseResponseListWorkoutsByUserId,
}
