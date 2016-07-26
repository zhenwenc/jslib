
export class BaseError extends Error {
  constructor (message?: string) {
    super()
    this.message = message
    this.stack = new Error().stack
  }
}
BaseError.prototype = new Error()

export class ServiceError extends BaseError {
  constructor(message: string) {
    super(message)
  }
}

export class ClientError extends BaseError {
  constructor(message: string) {
    super(message)
  }
}