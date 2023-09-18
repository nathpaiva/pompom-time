import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

import { query } from './utils/hasura'

interface IMutationAddWorkoutByUser {
  response: {
    delete_workouts: {
      returning: {
        name: IWorkoutDb['name']
        id: IWorkoutDb['id']
        created_at: IWorkoutDb['created_at']
        updated_at: IWorkoutDb['updated_at']
      }[]
    }
  }
  variables: {
    id: IWorkoutDb['id']
  }
}

const deleteWorkoutById: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  try {
    if (!event.body) {
      throw new Error('You should provide the values')
    }
    const { id } = JSON.parse(event.body) as IWorkoutDb

    if (!context.clientContext) {
      throw new Error('Should be authenticated')
    }

    const {
      response: {
        delete_workouts: { returning },
      },
    } = await query<IMutationAddWorkoutByUser>({
      query: `
      mutation MutationDeleteWorkoutById($id: uuid) {
        delete_workouts(where: {id: {_eq: $id}}) {
          returning {
            name
            id
            created_at
            updated_at
          }
        }
      }
      `,
      variables: {
        id,
      },
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
