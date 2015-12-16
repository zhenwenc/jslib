'use strict'

export function unimplemented() {
  throw new Error('Not implemented.')
}

export function isNil(x) {
  return typeof x === 'undefined'
}

export function isFn(x) {
  return typeof x === 'function'
}

export function isStr(x) {
  return typeof x === 'string'
}

export function isErr(x) {
  return x instanceof Error
}

export function evals(x) {
  return isFn(x) ? x.call() : x
}
