export interface IErrorHandler {
  message: string
  status: 400 | 500 | 300
}

export function isErrorHandler<T>(
  data: T | IErrorHandler,
): data is IErrorHandler {
  return typeof !(data as IErrorHandler).status === 'number'
}
