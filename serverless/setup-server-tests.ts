export function createMockHandlerEventBody<T>(body: T) {
  return {
    body: JSON.stringify(body) as HandlerEvent<T>['body'],
  } as HandlerEvent<T>
}

export function createMockContext(
  clientContext?: HandlerContext['clientContext'],
) {
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
    clientContext,
    getRemainingTimeInMillis: () => 0,
    done: () => null,
    fail: () => null,
    succeed: () => null,
  } satisfies HandlerContext
}
