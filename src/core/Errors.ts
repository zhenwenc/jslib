/**
 * Inheritable Error wrapper.
 */

export class NcError extends Error {
  constructor (message: string) {
    super()
    this.message = message
  }
}

export class NcSevere extends NcError {
  constructor(message: string) {
    super(message)
  }
}
