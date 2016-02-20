'use strict'

import * as $ from './internal/util'
import { error } from './error'

export function check(p, err) {
  if (!p && !$.isNil(err)) throw error(err)
  return !p
}
