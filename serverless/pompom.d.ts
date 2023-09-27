declare type NtlHandlerContext = import('@netlify/functions').HandlerContext
declare type NtlHandlerEvent = import('@netlify/functions').HandlerEvent
declare type NtlHandlerResponse =
  import('@netlify/functions').NtlHandlerResponse

type HandlerContext = Omit<NtlHandlerContext, 'clientContext'> & {
  clientContext?: { user: { email: string } }
}

type HandlerEvent<T> = Omit<NtlHandlerEvent, 'body'> & {
  body: Stringified<T>
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
