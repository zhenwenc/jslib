'use strict'

import * as $ from './internal/util'
import { check } from './check'

/**
 * Returns a function that can be lazily evaluate the given function with the
 * given arguments.
 *
 * @func
 * @memberof N
 * @category Function
 * @param  {Function} fn      a function
 * @param  {...Any}   ...args arguments to `fn`
 * @return {Function}
 * @example
 *
 * 		const f = N.lazy(Math.pow, 2, 4)
 *
 * 		f() // 2^4 = 16
 */
export function lazy(fn, ...args) {
  check($.isFn(fn), `Expects function fn to lazify, but ${fn}`)
  return () => fn.apply(fn, args)
}
