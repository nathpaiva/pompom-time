import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { gql, request } from 'graphql-request'

import { graphQLClientConfig } from './utils/graphqlClient'

interface IWorkoutsByUserId {
  workouts: IWorkout[]
}

const QueryWorkoutsByUserIdDocument = gql`
  query QueryWorkoutsByUserId($user_id: String) {
    workouts(where: { user_id: { _eq: $user_id } }) {
      created_at
      goal_per_day
      id
      interval
      name
      repeat
      rest
      squeeze
      stop_after
      type
      updated_at
      user_id
    }
  }
`

const listUserWorkouts: Handler = async (
  _event: HandlerEvent,
  context: HandlerContext,
) => {
  const config = graphQLClientConfig()

  try {
    if (!config.url || !config.requestHeaders) {
      throw new Error(`should have ${process.env.HASURA_API_URL}`)
    }

    if (!context.clientContext) {
      throw new Error('Should be authenticated')
    }

    const { workouts } = await request<IWorkoutsByUserId>({
      variables: {
        user_id: context.clientContext.user.email,
      },
      document: QueryWorkoutsByUserIdDocument,
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
