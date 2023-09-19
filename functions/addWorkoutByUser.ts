import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { gql, request } from 'graphql-request'

import { graphQLClientConfig } from './utils/graphqlClient'

interface IMutationAddWorkoutByUser {
  insert_workouts: {
    returning: IWorkout[]
  }
}

const MutationAddWorkoutByUserDocument = gql`
  mutation MutationAddWorkoutByUser(
    $user_id: String
    $name: String
    $type: String
    $interval: numeric
    $repeat: Boolean
    $goal_per_day: numeric
    $stop_after: numeric
    $rest: numeric
    $squeeze: numeric
  ) {
    insert_workouts(
      objects: {
        user_id: $user_id
        name: $name
        type: $type
        interval: $interval
        repeat: $repeat
        goal_per_day: $goal_per_day
        stop_after: $stop_after
        rest: $rest
        squeeze: $squeeze
      }
    ) {
      returning {
        user_id
        created_at
        updated_at
        id
        name
        type
        interval
        repeat
        goal_per_day
        stop_after
        rest
        squeeze
      }
    }
  }
`

const listUserWorkouts: Handler = async (
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

    const {
      insert_workouts: { returning },
    } = await request<IMutationAddWorkoutByUser>({
      document: MutationAddWorkoutByUserDocument,
      variables,
      ...config,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(returning[0]),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify((error as Error).message),
    }
  }
}

export { listUserWorkouts as handler }
