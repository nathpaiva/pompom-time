import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { gql, request } from 'graphql-request'

import { graphQLClientConfig } from './utils/graphqlClient'

interface IMutationAddWorkoutByUser {
  delete_workouts: {
    returning: IWorkout[]
  }
}

const MutationDeleteWorkoutByIdDocument = gql`
  mutation MutationDeleteWorkoutById($id: uuid) {
    delete_workouts(where: { id: { _eq: $id } }) {
      returning {
        name
        id
        created_at
        updated_at
      }
    }
  }
`

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
    const {
      delete_workouts: { returning },
    } = await request<IMutationAddWorkoutByUser>({
      document: MutationDeleteWorkoutByIdDocument,
      variables: {
        id,
      },
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

export { deleteWorkoutById as handler }
