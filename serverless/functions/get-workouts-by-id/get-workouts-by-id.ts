import { ClientError, request } from 'graphql-request'

import { errorResolver, graphQLClientConfig } from '../../utils'
import {
  GetWorkoutByIdDocument,
  GetWorkoutByIdQueryVariables,
} from './__generated__/get-workouts-by-id.graphql.generated'
import type { PromiseResponseGetWorkoutById } from './types'

const getWorkoutsById = async (
  event: HandlerEvent<
    unknown,
    Pick<GetWorkoutByIdQueryVariables, 'workout_id'>
  >,
  { clientContext }: Context,
): PromiseResponseGetWorkoutById => {
  const config = graphQLClientConfig()
  try {
    if (!clientContext?.user || clientContext.user.exp * 1000 < Date.now()) {
      throw new Error('You must be authenticated')
    }

    const { workouts } = await request({
      variables: {
        user_id: clientContext.user.email,
        workout_id: event.queryStringParameters?.workout_id,
      },
      document: GetWorkoutByIdDocument,
      ...config,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(workouts),
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

export { getWorkoutsById as handler, type PromiseResponseGetWorkoutById }
