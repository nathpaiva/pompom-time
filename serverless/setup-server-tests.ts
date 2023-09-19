import type {
  HandlerEvent as NtlHandlerEvent,
  HandlerContext,
} from '@netlify/functions'

type HandlerEvent<T> = NtlHandlerEvent & {
  body: Stringified<T> | null
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
    invokedFunctionArn:
      'arn:aws:lambda:us-east-1:871031295720:function:handler:1.0',
    memoryLimitInMB: '62',
    awsRequestId: '11dba8bd-577f-8040-0076-1607441e9f1d',
    logGroupName: 'Group name',
    logStreamName: 'Stream name',
    identity: undefined,
    clientContext,
    getRemainingTimeInMillis: () => 0,
    done: () => null,
    fail: () => null,
    succeed: () => null,
  }) satisfies HandlerContext

// export const mockResponseCb = () => new Response()

// const { _hoisted_requestResponse } = vi.hoisted(() => {
//   return { _hoisted_requestResponse: vi.fn() }
// })

// vi.mock('graphql-request', () => ({
//   request: _hoisted_requestResponse,
// }))

// export { _hoisted_requestResponse }
