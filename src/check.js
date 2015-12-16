'use strict'

import * as $ from './internal/util'
import { error } from './error'

export function check(p, err) {
  if (!p && !$.isNil(err)) throw error(err)
  return !p
}

export function checkFn(p, x, err) {
  if (!isFn(p)) throw new Error(`Expects predicate function, but ${p}`)
  return check(p(x), err)
}
