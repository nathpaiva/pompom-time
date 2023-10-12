import { ClientError, request } from 'graphql-request'

import { ErrorHandler, errorResolver, graphQLClientConfig } from '../../utils'
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
      throw new ErrorHandler({
        message: 'You must be authenticated',
        status: 300,
      })
    }

    const { workouts } = await request({
      variables: {
        user_id: clientContext.user.email,
        workout_id: event.queryStringParameters?.workout_id,
      },
      document: GetWorkoutByIdDocument,
      ...config,
    })

    if (!workouts.length) {
      throw new ErrorHandler({
        message: 'Workout not found.',
        status: 300,
      })
    }

    return {
      statusCode: 200,
      body: JSON.stringify(workouts),
    }
  } catch (error) {
    let statusCode: 400 | 500 | 300 = 500

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

export { getWorkoutsById as handler, type PromiseResponseGetWorkoutById }
