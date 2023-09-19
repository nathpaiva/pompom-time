import type { HandlerEvent, HandlerContext } from '@netlify/functions'
import { request } from 'graphql-request'

import { graphQLClientConfig } from '../utils/graphqlClient'
import {
  AddWorkoutByUserDocument,
  Workouts,
} from './__generated__/add-workout-by-user.graphql.generated'

type THandlerEvent = HandlerEvent & {
  body: Stringified<Workouts> | null
}

const addWorkoutByUser = async (
  event: THandlerEvent,
  context: HandlerContext,
) => {
  const config = graphQLClientConfig()

  try {
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
    } = JSON.parse(event.body)

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
      document: AddWorkoutByUserDocument,
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
