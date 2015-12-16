'use strict'

import * as $ from './internal/util'
import { check } from './check'
import { error } from './error'
import { Left, Right } from './Either'

// -- Maybe Class -------------------------------------------------------------

export class Maybe {

  /**
   * Returns a `Just` instance with the given value.
   *
   * @param  {Any}  value The value to wrap.
   * @return {Just}       Returns a `Just`
   */
  static Just(value) {
    return new _Just(value)
  }

  /**
   * Returns the singleton `Nothing` instance.
   *
   * @return {Nothing} Returns the singleton `Nothing`.
   */
  static get Nothing() {
    return nothing
  }

  /**
   * Constructs a new `Maybe` instance.
   *
   * If the value is either `null` or `undefined`, the function returns a
   * `Nothing`, otherwise the value is wrapped in a `Just(val)`
   *
   * @param  {Any}          value the value to wrap
   * @return {Just|Nothing}       Returns `Nothing` if `value` is null or
   *                              undefined, else `Just`
   */
  static of(value) {
    return (value === null || value === undefined)
            ? Maybe.Nothing : Maybe.Just(value)
  }

  /**
   * Constructs a new `Maybe` instance with the evaluated value of the given
   * function.
   *
   * @param  {Function} fn the function to be evaluated
   * @return {Maybe}
   */
  static eval(fn) {
    check($.isFn(fn), `Expects function to evaluate, but ${fn}`)
    return Maybe.of(fn.call())
  }

  /**
   * Check if `value` is subtype of `Maybe`, either `Just` or `Nothing`.
   *
   * @param  {Any}     value the value to check.
   * @return {Boolean}       Returns `true` if `value` is subtype of `Maybe`
   */
  static isMaybe(value) {
    return value instanceof Maybe
  }

  /**
   * Check if `value` is `Just`.
   *
   * @param  {Any}     value The value to check.
   * @return {Boolean}
   */
  static isJust(value) {
    return value instanceof _Just
  }

  /**
   * Check if `value` is `Nothing`.
   *
   * @param  {Any}     value The value to check.
   * @return {Boolean}
   */
  static isNothing(value) {
    return value instanceof _Nothing
  }

  /**
   * Check if `value` is `Just`, and the contained value is defined.
   *
   * @param  {any}     value The value to check.
   * @return {Boolean}
   */
  static isEmpty(value) {
    return Maybe.isNothing(value)
      || value.get === null
      || value.get === undefined
  }

  /**
   * Do notation for working with ES6 generator.
   *
   * Note: the given generator must yield a Maybe at every iteration.
   *
   * @param  {Generator} gen a generator
   * @return {Maybe}
   */
  static run(gen) {
    function next(value) {
      const result = gen.next(value)
      if (result.done) return result.value || Maybe.of(value)
      return result.value.flatMap(next)
    }
    return next()
  }

  /**
   * Return `true` if this is a `Just` instance.
   *
   * @return {Boolean} Returns `true` if this is a `Just` instance
   */
  get isJust() {
    return Maybe.isJust(this)
  }

  /**
   * Return `true` if this is a `Nothing` instance.
   *
   * @return {Boolean} Returns `true` if this is a `Nothing` instance
   */
  get isNothing() {
    return Maybe.isNothing(this)
  }

  /**
   * Return `true` if this is not a `Just` instance, or the contained
   * value is null or undefined. Otherwise, return `false`.
   *
   * @return {Boolean}
   */
  get isEmpty() {
    return Maybe.isEmpty(this)
  }

  /**
   * Return the result of applying `fa` to the value of this `Maybe` if this is
   * a `Just`. Otherwise, evaluates expression `fb`.
   *
   * @param  {Function} fa the function to apply if this is a `Just`
   * @param  {Function} fb the expression to evaluete if this is a `Nothing`
   * @return {Anny}
   */
  fold(fa, fb) {
    return this.isJust ? fa(this.get) : fb()
  }

  toString() {
    return `Maybe(${this.__value})`
  }

  // -- Functions -------------------------------------------------------------

  /**
   * Returns the maybe's value.
   *
   * @return {Any}
   */
  get get() {
    if (this.isNothing) throw Error(`Can't get value from Nothing.`)
    else return this.__value
  }

  /**
   * Returns the maybe's value if the maybe is a `Just`, otherwise return the
   * default value `or`.
   *
   * @param  {Any} or the default expression
   * @return {Any}
   */
  getOrElse(or) {
    return this.isNothing ? or : this.get
  }

  /**
   * Returns the maybe's value if the maybe is a `Just`, otherwise throw the
   * given `err` which can be either custom error or any object.
   *
   * @param  {Any}   err Rubbish to throw :)
   * @return {Any}
   */
  getOrThrow(err) {
    if (this.isJust) return this.get; else throw error(err)
  }

  /**
   * Returns this `Maybe` if it is a `Just`, otherwise return the result of
   * evaluating `alt` or `alt` if it is not a function.
   *
   * @param  {Any} alt the alternative expression
   * @return {Any}
   */
  orElse(alt) {
    const rs = this.isNothing ? $.evals(alt) : this
    if (!Maybe.isMaybe(this)) {
      throw (new TypeError(`Return type of alternative must be Maybe, but ${alt}`))
    }
    return rs
  }

  /**
   * Returns a `Just` containing the result of applying `fn` to this `Maybe` value
   * if this `Maybe` is a `Just`. Otherwise return `Nothing`.
   *
   * @param  {Function} fn the function to apply
   * @return {Maybe}
   */
  map(fn) {
    check($.isFn(fn), `Expects map function, but ${fn}`)
    return this.isJust ? Just(fn(this.get)) : this
  }

  /**
   * Returns the result of applying `fn` to the value of this `Maybe` if this is
   * a `Just`. Returns `Nothing` if this is a `Nothing`. Slightly different from
   * #map is that `fn` is expected to return a `Maybe` (which could be `Nothing`).
   *
   * @param  {Function} fn the function to apply
   * @return {Maybe}
   */
  flatMap(fn) {
    check($.isFn(fn), `Expects flatMap function, but ${fn}`)
    const rs = this.isJust ? fn(this.get) : this
    if (Maybe.isMaybe(rs)) return rs
    else throw error(`Return type of fn must be Maybe, but ${rs}`)
  }

  /**
   * Transforms the value of this `Maybe` using an unary function to monads.
   *
   * - if this is a `Just`, then return a function that applying the given
   * 	 function with the value of this `Maybe`
   *
   * - if this is a `Nothing`, then return an identity function of this Maybe
   *
   * @return {Function}
   */
  chain(fn) {
    check($.isFn(fn), `Expects chain function, but ${fn}`)
    return this.isJust ? (() => fn(this.get)) : (() => this)
  }

  /**
   * Return a {@link Right} containing this maybe's value if this is a
   * {link @Just}, or a {@link Left} containing the given `left` if this
   * is a {@link Nothing}.
   *
   * @param  {Any}     left the value to return if this is a {@link Nothing}
   * @param  {Boolean} ev   evaluate if `left` is a function
   * @return {Maybe}
   */
  toRight(left) {
    return this.isJust ? Right(this.get) : Left($.evals(left))
  }

  /**
   * Return a {@link Left} containing this maybe's value if this is a
   * {@link Nothing}, or a {@link Right} containing the given `right`
   * if this is a {@link Just}.
   *
   * @param  {Any}     right the value to return if this is a {@link Nothing}
   * @param  {Boolean} ev    evaluate if `right` is a function
   * @return {Maybe}
   */
  toLeft(right) {
    return this.isJust ? Left(this.get) : Right($.evals(right))
  }

}

// -- Just Class --------------------------------------------------------------

class _Just extends Maybe {

  constructor(value) {
    super()
    this.__value = value
  }

  toString() {
    return `Just(${this.__value})`
  }

  equals(that) {
    return Maybe.isJust(that) && that.__value === this.__value
  }

}

 // -- Nothing Class ----------------------------------------------------------

class _Nothing extends Maybe {

  constructor() {
    super()
  }

  toString() {
    return 'Nothing'
  }

  equals(that) {
    return Maybe.isNothing(that)
  }

}

const nothing = new _Nothing

// -- Aliases -----------------------------------------------------------------

export const Just = Maybe.Just
export const Nothing = Maybe.Nothing
