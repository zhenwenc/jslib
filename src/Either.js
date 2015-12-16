'use strict'

import * as $ from './internal/util'
import { check } from './check'
import { Just, Nothing } from './Maybe'

// -- Either Class ------------------------------------------------------------

export class Either {

  constructor(value) {
    this.value = value
  }

  static Left(value) {
    return new _Left(value)
  }

  static Right(value) {
    return new _Right(value)
  }

  static isEither(value) {
    return value instanceof Either
  }

  static isLeft(value) {
    if (!Either.isEither(value)) {
      throw new Error(`Expects 'Either', but ${value}`)
    } else return value.isLeft
  }

  static isRight(value) {
    if (!Either.isEither(value)) {
      throw new Error(`Expects 'Either', but ${value}`)
    } else return value.isRight
  }

  get left() {
    return new LeftProjection(this)
  }

  get right() {
    return new RightProjection(this)
  }

  get swap() {
    return this.isLeft ? Right(this.value) : Left(this.value)
  }

  /**
   * Applies `fa` if this is a `Left` or `fb` if this is a `Right`.
   *
   * @param  {Function} fa the function to apply if this is a `Left`
   * @param  {Function} fb the function to apply if this is a `Right`
   * @return {Any}         the results of applying the function
   */
  fold(fa, fb) {
    return this.isLeft ? fa(this.value) : fb(this.value)
  }

  toString() {
    return `Either(${this.__value})`
  }

}

// -- Left / Right Class ------------------------------------------------------

class _Left extends Either {
  get isLeft()  { return true  } // eslint-disable-line
  get isRight() { return false } // eslint-disable-line
}

class _Right extends Either {
  get isLeft()  { return false } // eslint-disable-line
  get isRight() { return true  } // eslint-disable-line
}

// -- Left / Right Projection Class -------------------------------------------

const isLeftP    = (x) => x instanceof LeftProjection
const onSameSide = (x) => !(isLeftP(x) ^ x.e.isLeft)

class Projection {

  /**
   * Returns the value from this `Either` if this is a `Left projection` for a
   * `Left`, or if this is a `Right projection` for a `Right`, otherwise throws
   * an Error.
   *
   * @return {Any}
   */
  get get() {
    const side = this.e.isLeft
      ? { us: 'right', them: 'Left'  } // eslint-disable-line
      : { us: 'left',  them: 'Right' } // eslint-disable-line
    if (onSameSide(this)) return this.e.value
    else throw new Error(`Want Either.${side.us}.value, but on ${side.them}`)
  }

  /**
   * Returns a `Just` containing the `Left` value if this is a `Left` or a
   * `Nothing` if this is a `Right`, vise versa.
   *
   * {{{
   * 	Left(12).left.toMaybe // Just(12)
   * 	Right(12).left.toMaybe // Nothing
   *
   * 	Right(21).right.toMaybe // Just(21)
   * 	Left(21).right.toMaybe // Nothing
   * }}}
   *
   * @return {Maybe}
   */
  get toMaybe() {
    return onSameSide(this) ? Just(this.get) : Nothing
  }

  /**
   * Returns the value from this `Either` if this is a `Left projection` for a
   * `Left`, or if this is a `Right projection` for a `Right`, or the given
   * argument if this is a `Right`.
   *
   * @param  {Any} or The default value
   * @return {Any}
   */
  getOrElse(or) {
    return (onSameSide(this)) ? this.get : or
  }

  /**
   * Maps the function argument through `Left` if this is a `Left projection`,
   * or through `Right` if this is a `Right projection`, otherwise returns the
   * original `Eihter`.
   *
   * @param  {Function} fn The function to map
   * @return {Either}
   */
  map(fn) {
    check($.isFn(fn), `Expects map function, but ${fn}`)
    if (isLeftP(this)) return this.e.isLeft ? new Left(fn(this.get)) : this.e
    else return this.e.isRight ? new Right(fn(this.get)) : this.e
  }

  /**
   * Binds the given function across `Left` if this is a `Left projection`, or
   * across `Right` if this is a `Right projection`, otherwise returns the
   * original `Either`. Slightly different from #map is that `fn` is expected to
   * return an `Either`.
   *
   * @param  {Function} fn The function to bind accross the `Either`
   * @return {Either}
   */
  flatMap(fn) {
    check($.isFn(fn), `Expects flatMap function, but ${fn}`)
    const rs = isLeftP(this) ? fn(this.get) : this.e
    if (Either.isEither(rs)) return rs
    else throw error(`Return type of fn must be Either`)
  }

}

class LeftProjection extends Projection {
  constructor(either) { super(); this.e = either } // eslint-disable-line
  toString() { return `LeftProjection(${this.e})` } // eslint-disable-line
}

class RightProjection extends Projection {
  constructor(either) { super(); this.e = either } // eslint-disable-line
  toString() { return `RightProjection(${this.e})` } // eslint-disable-line
}

// -- Aliases -----------------------------------------------------------------

export const Left = Either.Left
export const Right = Either.Right
