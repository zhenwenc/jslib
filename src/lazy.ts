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
 *
 * @deprecated
 */
export function lazy(fn: (...args: any[]) => any, ...args: any[]) {
  return () => fn.apply(fn, args)
}
