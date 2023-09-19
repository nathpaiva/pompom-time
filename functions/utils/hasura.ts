import fetch from 'node-fetch'

interface IModelExtends {
  variables: any
  response: any
}

interface IPromiseResponse<T extends ['response']> {
  data: T
}

interface IQueryParams<T extends IModelExtends> {
  query: string
  variables: T['variables']
}

interface IResponse<T extends IModelExtends> {
  response: T['response']
}

export async function query<T extends IModelExtends>({
  query,
  variables = {},
}: IQueryParams<T>): Promise<IResponse<T>> {
  try {
    if (!process.env.HASURA_API_URL || !process.env.HASURA_GRAPHQL_ADMIN_SECRET)
      throw new Error('defined env')

    const result = await fetch(process.env.HASURA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: JSON.stringify({ query, variables }),
    })

    // TODO: change this type
    const { data } = (await result.json()) as IPromiseResponse<T['response']>

    return {
      response: data,
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
