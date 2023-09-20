import type {
  HandlerEvent as NtlHandlerEvent,
  HandlerContext,
  HandlerResponse as NtlHandlerResponse,
} from '@netlify/functions'
import { request } from 'graphql-request'

import { graphQLClientConfig } from '../../utils/graphqlClient'
import {
  DeleteWorkoutByIdDocument,
  DeleteWorkoutByIdMutationVariables,
  Workouts,
} from './__generated__/delete-workout-by-id.graphql.generated'

type HandlerEvent = Omit<NtlHandlerEvent, 'body'> & {
  body: Stringified<DeleteWorkoutByIdMutationVariables>
}

type HandlerResponse = Omit<NtlHandlerResponse, 'body'> &
  (
    | {
        statusCode: 200
        body: Stringified<
          Pick<
            Workouts,
            '__typename' | 'created_at' | 'updated_at' | 'id' | 'name'
          >
        >
      }
    | {
        statusCode: 500
        body: Stringified<{ error: string }>
      }
  )

const deleteWorkoutById = async (
  event: HandlerEvent,
  context: HandlerContext,
): Promise<HandlerResponse> => {
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
      body: JSON.stringify({ error: (error as Error).message }),
    }
  }
}

export { deleteWorkoutById as handler }
