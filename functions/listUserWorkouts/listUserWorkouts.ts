import type { HandlerEvent, HandlerContext } from '@netlify/functions'
import { request } from 'graphql-request'

import { graphQLClientConfig } from '../utils/graphqlClient'
import { WorkoutsByUserIdDocument } from './__generated__/get-workouts-by-user.graphql.generated'

const listUserWorkouts = async (
  _event: HandlerEvent,
  context: HandlerContext,
) => {
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
      body: JSON.stringify((error as Error).message),
    }
  }
}

export { listUserWorkouts as handler }
