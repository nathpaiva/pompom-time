import type {
  HandlerEvent,
  HandlerContext as NtlHandlerContext,
  HandlerResponse as NtlHandlerResponse,
} from '@netlify/functions'
import { request } from 'graphql-request'

import { graphQLClientConfig } from '../../utils/graphqlClient'
import {
  Workouts,
  WorkoutsByUserIdDocument,
} from './__generated__/list-workouts-by-user-id.graphql.generated'

type HandlerContext = Omit<NtlHandlerContext, 'clientContext'> & {
  clientContext?: Stringified<{ user: { email: string } }>
}

type THandlerResponse = Omit<NtlHandlerResponse, 'body'> &
  (
    | {
        statusCode: 200
        body: Stringified<Workouts[]>
      }
    | {
        statusCode: 500
        body: Stringified<{ error: string }>
      }
  )

const listWorkoutsByUserId = async (
  _event: HandlerEvent,
  context: HandlerContext,
): Promise<THandlerResponse> => {
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    }
  }
}

export { listWorkoutsByUserId as handler }
