import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { request } from 'graphql-request'

import { graphQLClientConfig } from '../utils/graphqlClient'
import { DeleteWorkoutById__Document } from './__generated__/delete-workout-by-id.graphql.generated'

const deleteWorkoutById: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  const config = graphQLClientConfig()
  try {
    if (!config.url || !config.requestHeaders) {
      throw new Error(`should have ${process.env.HASURA_API_URL}`)
    }

    if (!event.body) {
      throw new Error('You should provide the values')
    }
    const { id } = JSON.parse(event.body) as IWorkoutDb

    if (!context.clientContext) {
      throw new Error('Should be authenticated')
    }
    const { delete_workouts } = await request({
      document: DeleteWorkoutById__Document,
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
