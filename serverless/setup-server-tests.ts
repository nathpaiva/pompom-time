import type {
  HandlerEvent as NtlHandlerEvent,
  HandlerContext,
} from '@netlify/functions'

type HandlerEvent<T> = Omit<NtlHandlerEvent, 'body'> & {
  body: Stringified<T>
}

export function toRequestFromBody<T>(body: T) {
  return {
    body: JSON.stringify(body) as HandlerEvent<T>['body'],
  } as HandlerEvent<T>
}

export const mockContext = (clientContext?: HandlerContext['clientContext']) =>
  ({
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
  }) satisfies HandlerContext
