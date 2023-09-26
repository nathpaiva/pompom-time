import { ClientError, request } from 'graphql-request'

import { errorResolver, graphQLClientConfig } from '../../utils'
import { WorkoutsByUserIdDocument } from './__generated__/list-workouts-by-user-id.graphql.generated'
import type { PromiseResponseListWorkoutsByUserId } from './types'

const listWorkoutsByUserId = async (
  _event: HandlerEvent<unknown>,
  context: HandlerContext,
): PromiseResponseListWorkoutsByUserId => {
  const config = graphQLClientConfig()

  try {
    if (!context.clientContext) {
      throw new Error('Should be authenticated')
    }

    const { workouts } = await request({
      variables: {
        user_id: context.clientContext.user.email,
      },
      document: WorkoutsByUserIdDocument,
      ...config,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(workouts),
    }
  } catch (error) {
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
