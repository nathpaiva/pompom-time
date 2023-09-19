export const graphQLClientConfig = () => {
  if (!process.env.HASURA_API_URL || !process.env.HASURA_GRAPHQL_ADMIN_SECRET) {
    return {
      error: 'please provide env',
    }
  }

  return {
    url: process.env.HASURA_API_URL!,
    requestHeaders: {
      'Content-Type': 'application/json',
      'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
    },
  }
}
