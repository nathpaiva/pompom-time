import { ClientError, request } from 'graphql-request'

import { errorResolver, graphQLClientConfig } from '../../utils'
import {
  WorkoutsByUserIdDocument,
  WorkoutsByUserIdQueryVariables,
} from './__generated__/list-workouts-by-user-id.graphql.generated'
import type { PromiseResponseListWorkoutsByUserId } from './types'

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
      throw new Error('You must be authenticated')
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
      throw new Error('Request is wrong')
    }

    return {
      statusCode: 200,
      body: JSON.stringify(workouts_aggregate),
    }
  } catch (error) {
    // TODO: review this Error type (before ClientError | Error)
    const message = errorResolver(error as ClientError | Error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    }
  }
}

export {
  listWorkoutsByUserId as handler,
  type PromiseResponseListWorkoutsByUserId,
}
