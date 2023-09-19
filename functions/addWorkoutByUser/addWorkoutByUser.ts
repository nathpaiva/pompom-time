import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { request } from 'graphql-request'

import { graphQLClientConfig } from '../utils/graphqlClient'
import { AddWorkoutByUser__Document } from './__generated__/add-workout-by-user.graphql.generated'

const addWorkoutByUser: Handler = async (
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
    const {
      name,
      type,
      repeat,
      goal_per_day,
      interval,
      rest,
      squeeze,
      stop_after,
    } = JSON.parse(event.body) as IWorkout

    if (!context.clientContext) {
      throw new Error('Should be authenticated')
    }

    const variables = {
      user_id: context.clientContext.user.email,
      name,
      type,
      repeat,
      goal_per_day: +goal_per_day,
      interval: +interval,
      rest: +rest,
      squeeze: +squeeze,
      stop_after: +stop_after,
    }

    const { insert_workouts } = await request({
      document: AddWorkoutByUser__Document,
      variables,
      ...config,
    })

    if (!insert_workouts) {
      throw new Error('Could not load data')
    }

    return {
      statusCode: 200,
      body: JSON.stringify(insert_workouts.returning[0]),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify((error as Error).message),
    }
  }
}

export { addWorkoutByUser as handler }
