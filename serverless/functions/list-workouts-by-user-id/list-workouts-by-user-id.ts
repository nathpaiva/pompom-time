import { ClientError, request } from 'graphql-request'

import { errorResolver, graphQLClientConfig } from '../../utils'
import { WorkoutsByUserIdDocument } from './__generated__/list-workouts-by-user-id.graphql.generated'
import type { PromiseResponseListWorkoutsByUserId } from './types'

const listWorkoutsByUserId = async (
  _event: HandlerEvent<unknown>,
  { clientContext }: Context,
): PromiseResponseListWorkoutsByUserId => {
  const config = graphQLClientConfig()

  try {
    if (!clientContext?.user) {
      throw new Error('You must be authenticated')
    }

    const { workouts } = await request({
      variables: {
        user_id: clientContext.user.email,
      },
      document: WorkoutsByUserIdDocument,
      ...config,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(workouts),
    }
  } catch (error) {
    // TODO: review this Error type (before ClientError | Error)
    const message = errorResolver(error as ClientError | IError)

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
