
export class BaseError {
  constructor () {
    Error.apply(this, arguments)
  }
}
BaseError.prototype = new Error()

export class ServiceError extends BaseError {
  constructor(message: string) {
    super()
  }
}

export class ClientError extends BaseError {
  constructor(message: string) {
    super()
  }
}