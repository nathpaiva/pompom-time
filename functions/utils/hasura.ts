import fetch from 'node-fetch'

// TODO: change this type
interface PromiseResponse {
  data: any
}

// TODO: change this type
interface TQueryParams {
  query: string
  variables?: any
}

export async function query({ query, variables = {} }: TQueryParams) {
  try {
    if (!process.env.HASURA_API_URL || !process.env.HASURA_GRAPHQL_ADMIN_SECRET)
      return

    const result = await fetch(process.env.HASURA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
      },
      body: JSON.stringify({ query, variables }),
    })

    // TODO: change this type
    const { data } = (await result.json()) as PromiseResponse

    return data
  } catch (error) {
    return error
  }
}
