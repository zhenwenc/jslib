'use strict'

import { Either, Left, Right } from './Either'
import { Equals } from './Equals'
import { deepEqual } from '../utils/deepEqual'

// -- Maybe Class -------------------------------------------------------------

export abstract class Maybe<T> extends Equals {

  protected value: T

  constructor(value: T) {
    super()
    this.value = value
  }

  /**
   * Returns a `Just` instance with the given value.
   *
   * @param  {Any}  value The value to wrap.
   * @return {Just}       Returns a `Just`
   */
  static Just<F>(value: F): JustWrapper<F> {
    return new JustWrapper(value)
  }

  /**
   * Returns the singleton `Nothing` instance.
   *
   * @return {Nothing} Returns the singleton `Nothing`.
   */
  static get Nothing(): NothingWrapper {
    return new NothingWrapper
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
  static of<F>(value: F): Maybe<F> {
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
  static eval<F>(fn: () => F): Maybe<F> {
    return Maybe.of(fn.apply(undefined))
  }

  /**
   * Check if `value` is subtype of `Maybe`, either `Just` or `Nothing`.
   *
   * @param  {Any}     value the value to check.
   * @return {Boolean}       Returns `true` if `value` is subtype of `Maybe`
   */
  static isMaybe(value: any): boolean {
    return value instanceof Maybe
  }

  /**
   * Check if `value` is `Just`.
   *
   * @param  {Any}     value The value to check.
   * @return {Boolean}
   */
  static isJust(value: any): boolean {
    return value instanceof JustWrapper
  }

  /**
   * Check if `value` is `Nothing`.
   *
   * @param  {Any}     value The value to check.
   * @return {Boolean}
   */
  static isNothing(value: any): boolean {
    return value instanceof NothingWrapper
  }

  /**
   * Check if `value` is `Just`, and the contained value is defined.
   *
   * @param  {Maybe}   value The value to check.
   * @return {Boolean}
   */
  static isEmpty(value: Maybe<any>): boolean {
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
  static run<F>(gen: IterableIterator<Maybe<F>>): Maybe<F> {
    function next(value) {
      const result = gen.next(value)
      if (result.done) return result.value || Maybe.of(value)
      return result.value.flatMap(next)
    }
    return next(null)
  }

  /**
   * Return `true` if this is a `Just` instance.
   *
   * @return {Boolean} Returns `true` if this is a `Just` instance
   */
  get isJust(): boolean {
    return Maybe.isJust(this)
  }

  /**
   * Return `true` if this is a `Nothing` instance.
   *
   * @return {Boolean} Returns `true` if this is a `Nothing` instance
   */
  get isNothing(): boolean {
    return Maybe.isNothing(this)
  }

  /**
   * Return `true` if this is not a `Just` instance, or the contained
   * value is null or undefined. Otherwise, return `false`.
   *
   * @return {Boolean}
   */
  get isEmpty(): boolean {
    return Maybe.isEmpty(this)
  }

  /**
   * Returns the maybe's value.
   *
   * @return {Any}
   */
  get get() {
    if (this.isNothing)
      throw Error(`Can't get value from Nothing.`)
    else
      return this.value
  }

  toString() {
    return `Maybe(${this.value})`
  }

  // -- Functions -------------------------------------------------------------

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
   * @param  {Error} err Rubbish to throw :)
   * @return {Any}
   */
  getOrThrow(err: Error) {
    if (this.isJust) return this.get
    else throw err
  }

  /**
   * Returns this `Maybe` if it is a `Just`, otherwise return the result of
   * evaluating `alt`.
   *
   * @param  {Function} alt the alternative expression
   * @return {Maybe}
   */
  orElse<F extends T>(alt: () => Maybe<F>): Maybe<T> {
    return this.isNothing ? alt.apply(undefined) : this
  }

  /**
   * Returns a `Just` containing the result of applying `fn` to this `Maybe` value
   * if this `Maybe` is a `Just`. Otherwise return `Nothing`.
   *
   * @param  {Function} fn the function to apply
   * @return {Maybe}
   */
  map<F>(fn: (T) => F): Maybe<F> {
    return this.isJust ? Maybe.Just(fn(this.get)) : new NothingWrapper
  }

  /**
   * Returns the result of applying `fn` to the value of this `Maybe` if this is
   * a `Just`. Returns `Nothing` if this is a `Nothing`.
   *
   * Slightly different from `map` is that `fn` is expected to return a `Maybe`
   * (which could be `Nothing`).
   *
   * @param  {Function} fn the function to apply
   * @return {Maybe}
   */
  flatMap<F>(fn: (T) => Maybe<F>): Maybe<F> {
    return this.isJust ? fn(this.get) : new NothingWrapper
  }

  /**
   * Return the result of applying `f` to the value of this `Maybe` if this is
   * a `Just`. Otherwise, evaluates expression `ifEmpty`.
   *
   * @param  {Function} ifEmpty the expression to evaluete if this is a `Nothing`
   * @param  {Function} f       the function to apply if this is a `Just`
   * @return {Any}
   */
  fold<F>(ifEmpty: () => F, f: (T) => F): F {
    return this.isJust ? f(this.get) : ifEmpty()
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
  chain<F>(fn: (T) => Maybe<F>): () => Maybe<F> {
    return this.isJust ? (() => fn(this.get)) : (() => new NothingWrapper)
  }

  /**
   * Return a `Right` containing this maybe's value if this is a `Just`, or
   * a `Left` containing the given `left` if this is a `Nothing`.
   *
   * @param  {Any}     left the value to return if this is a Nothing
   * @param  {Boolean} ev   evaluate if `left` is a function
   * @return {Maybe}
   */
  toRight<G>(left: G): Either<G, T> {
    return this.isJust ? Right<G, T>(this.get) : Left<G, T>(left)
  }

  /**
   * Return a `Left` containing this maybe's value if this is a `Nothing`,
   * or a `Right` containing the given `right` if this is a `Just`.
   *
   * @param  {Any}     right the value to return if this is a `Nothing`
   * @param  {Boolean} ev    evaluate if `right` is a function
   * @return {Maybe}
   */
  toLeft<G>(right: G): Either<T, G> {
    return this.isJust ? Left<T, G>(this.get) : Right<T, G>(right)
  }

}

// -- Just Class --------------------------------------------------------------

export class JustWrapper<T> extends Maybe<T> {

  constructor(value: T) {
    super(value)
  }

  toString() {
    return `Just(${this.value})`
  }

  equals(that: any) {
    return Maybe.isJust(that)
      && deepEqual(that.value, this.value)
  }

}

 // -- Nothing Class ----------------------------------------------------------

export class NothingWrapper extends Maybe<any> {

  constructor() {
    super(undefined)
  }

  toString() {
    return 'Nothing'
  }

  equals(that: any) {
    return Maybe.isNothing(that)
  }

}

// -- Aliases -----------------------------------------------------------------

/* tslint:disable variable-name */
export const Just = Maybe.Just
export const Nothing = Maybe.Nothing
