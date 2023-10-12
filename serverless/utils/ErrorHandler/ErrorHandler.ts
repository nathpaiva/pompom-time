import { type IErrorHandler, isErrorHandler } from './types'

export class ErrorHandler implements IErrorHandler {
  message: IErrorHandler['message']
  status: IErrorHandler['status']

  constructor(params: IErrorHandler) {
    this.message = params.message
    this.status = params.status
  }

  get() {
    return {
      message: this.message,
      status: this.status,
    }
  }
}

export { type IErrorHandler, isErrorHandler }
