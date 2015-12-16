'use strict'

import * as $ from './internal/util'

export function error(err) {
  return $.isErr(err) ? err : new Error(err)
}

export function fnThrow(err) {
  return function() {
    throw error(err)
  }
}
