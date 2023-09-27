import { ClientError, request } from 'graphql-request'

import { errorResolver, graphQLClientConfig } from '../../utils'
import {
  DeleteWorkoutByIdDocument,
  DeleteWorkoutByIdMutationVariables,
} from './__generated__/delete-workout-by-id.graphql.generated'
import type { IWorkouts, PromiseResponseDeleteWorkoutById } from './types'

const deleteWorkoutById = async (
  event: HandlerEvent<DeleteWorkoutByIdMutationVariables>,
  context: HandlerContext,
): PromiseResponseDeleteWorkoutById => {
  const config = graphQLClientConfig()
  try {
    if (!event.body) {
      throw new Error('You must provide the workout id')
    }
    const { id } = JSON.parse(event.body)

    if (!context.clientContext) {
      throw new Error('Should be authenticated')
    }
    const { delete_workouts } = await request({
      document: DeleteWorkoutByIdDocument,
      variables: {
        id,
      },
      ...config,
    })

    if (!delete_workouts?.returning) {
      throw new Error('Could not delete the workout')
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
