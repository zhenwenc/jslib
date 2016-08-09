/**
 * Inheritable Error wrapper.
 */

export class NcError extends Error {
  constructor (message?: string) {
    super()
    this.message = message
  }
}
NcError.prototype = new Error()

export class NcSevere extends NcError {
  constructor(message: string) {
    super(message)
  }
}
