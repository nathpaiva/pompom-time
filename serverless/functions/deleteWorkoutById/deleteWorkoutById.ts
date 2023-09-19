import type { HandlerEvent, HandlerContext } from '@netlify/functions'
import { request } from 'graphql-request'

import { graphQLClientConfig } from '../../utils/graphqlClient'
import {
  DeleteWorkoutByIdDocument,
  Workouts,
} from './__generated__/delete-workout-by-id.graphql.generated'

type THandlerEvent = HandlerEvent & {
  body: Stringified<Workouts> | null
}

const deleteWorkoutById = async (
  event: THandlerEvent,
  context: HandlerContext,
) => {
  const config = graphQLClientConfig()
  try {
    if (!event.body) {
      throw new Error('You should provide the values')
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
    return {
      statusCode: 500,
      body: JSON.stringify((error as Error).message),
    }
  }
}

export { deleteWorkoutById as handler }
