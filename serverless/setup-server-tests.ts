export function createMockHandlerEventBody<T, Q>(
  body: T,
  queryStringParameters?: Q,
) {
  return {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    } as any,
    queryStringParameters: queryStringParameters ?? null,
  } as HandlerEvent<T, Q>
}

export function createMockContext(clientContext?: IUserContext) {
  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'handler',
    functionVersion: '1.0',
    invokedFunctionArn: '',
    memoryLimitInMB: '62',
    awsRequestId: '',
    logGroupName: 'Group name',
    logStreamName: 'Stream name',
    identity: undefined,
    clientContext: {
      ...clientContext,
      // TODO: change this to remove the any
      env: {} as any,
      client: {} as any,
    },
    getRemainingTimeInMillis: () => 0,
    done: () => null,
    fail: () => null,
    succeed: () => null,
  } satisfies Context
}
