export function createMockHandlerEventBody<T>(body: T) {
  return {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    } as any,
  } as HandlerEvent<T>
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
