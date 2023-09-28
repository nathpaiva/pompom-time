import { ClientError, request } from 'graphql-request'

import { errorResolver, graphQLClientConfig } from '../../utils'
import {
  DeleteWorkoutByIdDocument,
  DeleteWorkoutByIdMutationVariables,
} from './__generated__/delete-workout-by-id.graphql.generated'
import type { IWorkouts, PromiseResponseDeleteWorkoutById } from './types'

const deleteWorkoutById = async (
  event: HandlerEvent<DeleteWorkoutByIdMutationVariables>,
  context: Context,
): PromiseResponseDeleteWorkoutById => {
  const config = graphQLClientConfig()
  try {
    if (!context.clientContext?.user) {
      throw new Error('You must be authenticated')
    }

    if (!event.body || !Object.keys(JSON.parse(event.body)).length) {
      throw new Error('You should provide the workout id')
    }

    const { id } = JSON.parse(event.body)

    const { delete_workouts } = await request({
      document: DeleteWorkoutByIdDocument,
      variables: {
        id,
      },
      ...config,
    })

    /* c8 ignore next */
    if (!delete_workouts) {
      /* c8 ignore next */
      throw new Error('Could not delete the workout')
      /* c8 ignore next */
    }

    return {
      statusCode: 200,
      body: JSON.stringify(delete_workouts.returning[0]),
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
  deleteWorkoutById as handler,
  type PromiseResponseDeleteWorkoutById,
  type DeleteWorkoutByIdMutationVariables as DeleteWorkoutByIdVariables,
  type IWorkouts,
}
