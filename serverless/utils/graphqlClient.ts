interface IGraphQLClientConfig {
  url: string
  requestHeaders: {
    'Content-Type': string
    'X-Hasura-Admin-Secret': string
  }
}

export const graphQLClientConfig = (): IGraphQLClientConfig => {
  if (!process.env.HASURA_API_URL || !process.env.HASURA_GRAPHQL_ADMIN_SECRET) {
    throw new Error('Error, you must provide ENV.')
  }

  return {
    url: process.env.HASURA_API_URL!,
    requestHeaders: {
      'Content-Type': 'application/json',
      'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
    },
  }
}
