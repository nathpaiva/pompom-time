declare type NtlHandlerContext = import('aws-lambda').Context
declare type NtlHandlerEvent = import('aws-lambda').APIGatewayProxyEvent
declare type NtlHandlerResponse = import('@netlify/functions').HandlerResponse
declare type LLambdaContext = import('@middy/core').LambdaContext

interface IUserContext {
  user?: { email: string; exp: number }
}

type Context = Omit<NtlHandlerContext, 'clientContext' | 'identity'> & {
  clientContext?:
    | IUserContext
    | (NtlHandlerContext['clientContext'] & IUserContext)
  identity?: Record<string, any>
}

type LambdaContext = Omit<LLambdaContext, 'clientContext' | 'identity'> & {
  clientContext?: IUserContext & NtlHandlerContext['clientContext']
  identity?: Record<string, any>
}

type HandlerEvent<T, Q> = Omit<
  NtlHandlerEvent,
  'body' | 'queryStringParameters'
> & {
  body: Stringified<T>
  queryStringParameters?: Q
}

type HandlerEventJsonParsed<T, Q> = Omit<
  NtlHandlerEvent,
  'body' | 'queryStringParameters'
> & {
  body: T
  queryStringParameters?: Q
}

interface TErrorBodyResponse {
  body: Stringified<{ error: string }>
}

type HandlerResponse<T> = Omit<NtlHandlerResponse, 'body'> &
  (
    | {
        statusCode: 200
        body: Stringified<T>
      }
    | (TErrorBodyResponse & {
        statusCode: 500
      })
    | (TErrorBodyResponse & {
        statusCode: 400
      })
  )

interface ICause {
  instancePath: string
  schemaPath: string
  keyword: string
  params: {
    missingProperty?: string
    failingKeyword?: string
    errors?: unknown[]
  }
  schema?: string[]
  message?: string
}

interface IError extends Omit<Error, 'cause'> {
  cause?: ICause[] | ICause
  message?: string
  statusCode?: number
}
