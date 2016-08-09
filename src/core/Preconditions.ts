import {
  isUndefined,
  isNull,
  isNumber,
  isString,
  isBoolean,
  isInteger,
  isFunction,
} from 'lodash'
import { NcError } from './Errors'

export type Predicate<T> = (obj: T) => boolean
export type CheckerHandler = (message?: string) => void

function errorHandler(message?: string) {
  throw new NcCheckerError(message || 'Precondition not satisfy.')
}

function consoleHandler(logger: (msg: string) => void) {
  return (message?: string) => {
    logger(message || 'Precondition not satisfy.')
  }
}

function format(cause: string, message?: string) {
  if (isUndefined(message)) cause;
  return `${message}. Caused by ${cause}.`
}

export class NcCheckerError extends NcError {
  constructor(message: string) {
    super(message)
  }
}

export class Checker<T> {

  constructor(
    private obj: T,
    private handler: CheckerHandler = errorHandler
  ) { }

  it(predicate: Predicate<T>, message?: string): Checker<T> {
    let checked: boolean
    try {
      checked = predicate(this.obj)
    } catch (err) {
      throw new NcCheckerError(
        `Got error while checking [${this.obj}] with predicate [${predicate}]: ${err}`)
    }
    if (!!!checked) this.handler(message)
    return this
  }

  not(predicate: Predicate<T>, message?: string): Checker<T> {
    return this.it((o: T) => !predicate(o), message)
  }

  notNull(message?: string): Checker<T> {
    return this
      .not(isUndefined, format(`Object is undefined`, message))
      .not(isNull, message)
  }

  isBoolean(message?: string): Checker<T> {
    return this
      .it(isBoolean, format(`[${this.obj}] is not a boolean`, message))
  }

  isString(message?: string): Checker<T> {
    return this
      .it(isString, format(`[${this.obj}] is not a string`, message))
  }

  isFunction(message?: string): Checker<T> {
    return this
      .it(isFunction, format(`[${this.obj}] is not a function`, message))
  }

  isNumber(message?: string): Checker<T> {
    return this
      .it(isNumber, format(`[${this.obj}] is not a number`, message))
  }

  isInteger(message?: string): Checker<T> {
    return this
      .it(isInteger, format(`[${this.obj}] is not an integer`, message))
  }

  isPositive(message?: string): Checker<T> {
    return this
      .it(isNumber, format(`[${this.obj}] is not a number`, message))
  }

}

export function check<T>(b: T, message?: string): Checker<T> {
  return create(b, errorHandler, message)
}

export function checkWarn<T>(b: T, message?: string): Checker<T> {
  const logger = (msg: string) => {
    console.warn(msg)
  }
  return create(b, consoleHandler(logger), message)
}

function create<T>(b: T, handler: CheckerHandler, message?: string): Checker<T> {
  if (!isUndefined(message)) {
    if(!!!b) handler(message)
  } else {
    return new Checker(b, handler)
  }
}
