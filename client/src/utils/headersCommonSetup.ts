export const headersCommonSetup = (access_token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  }
}
