declare type NtlHandlerContext = import('@netlify/functions').HandlerContext
declare type NtlHandlerEvent = import('@netlify/functions').HandlerEvent
declare type NtlHandlerResponse =
  import('@netlify/functions').NtlHandlerResponse

interface IUserContext {
  user?: { email: string }
}

type HandlerContext = Omit<NtlHandlerContext, 'clientContext'> & {
  clientContext?: IUserContext & NtlHandlerContext['clientContext']
}

type HandlerEvent<T> = Omit<NtlHandlerEvent, 'body'> & {
  body: Stringified<T>
}

type HandlerEventJsonParsed<T> = Omit<NtlHandlerEvent, 'body'> & {
  body: T
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
