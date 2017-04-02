import { Either } from './Either';
import { Record } from './Record';
export declare abstract class Maybe<T> extends Record {
    protected value: T;
    constructor(value: T);
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
    static of<F>(value: F): Maybe<F>;
    /**
     * Constructs a new `Maybe` instance with the evaluated value of the given
     * function.
     *
     * @param  {Function} fn the function to be evaluated
     * @return {Maybe}
     */
    static eval<F>(fn: () => F): Maybe<F>;
    /**
     * Check if `value` is subtype of `Maybe`, either `Just` or `Nothing`.
     *
     * @param  {Any}     value the value to check.
     * @return {Boolean}       Returns `true` if `value` is subtype of `Maybe`
     */
    static isMaybe(value: any): boolean;
    /**
     * Check if `value` is `Just`.
     *
     * @param  {Any}     value The value to check.
     * @return {Boolean}
     */
    static isJust(value: any): boolean;
    /**
     * Check if `value` is `Just`.
     *
     * Alias to Maybe#isJust
     */
    static isDefined(value: any): boolean;
    /**
     * Check if `value` is `Nothing`.
     *
     * @param  {Any}     value The value to check.
     * @return {Boolean}
     */
    static isNothing(value: any): boolean;
    /**
     * Check if `value` is `Just`, and the contained value is defined.
     *
     * @param  {Maybe}   value The value to check.
     * @return {Boolean}
     */
    static isEmpty(value: Maybe<any>): boolean;
    /**
     * Do notation for working with ES6 generator.
     *
     * Note: the given generator must yield a Maybe at every iteration.
     *
     * @param  {Generator} gen a generator
     * @return {Maybe}
     */
    static run<F>(gen: IterableIterator<Maybe<F>>): Maybe<F>;
    /**
     * Apply given function to values wrapped in `Maybe`, and wrap the result in another
     * `Maybe`. If any of the argument is a `Nothing`, return `Nothing`.
     *
     * @param {Function} function to apply
     * @param {Maybe} a
     * @param {Maybe} b
     * @return {Maybe}
     */
    static lift2<A, B, C>(f: (A, B) => C, a: Maybe<A>, b: Maybe<B>): Maybe<C>;
    /**
     * Apply given function to values wrapped in `Maybe`, and wrap the result in another
     * `Maybe`. If any of the argument is a `Nothing`, return `Nothing`.
     *
     * @param {Function} function to apply
     * @param {Maybe} a
     * @param {Maybe} b
     * @param {Maybe} c
     * @return {Maybe}
     */
    static lift3<A, B, C, D>(f: (A, B, C) => D, a: Maybe<A>, b: Maybe<B>, c: Maybe<C>): Maybe<D>;
    /**
     * Return `true` if this is a `Just` instance.
     *
     * @return {Boolean} Returns `true` if this is a `Just` instance
     */
    readonly isJust: boolean;
    /**
     * Return `true` if this is a `Nothing` instance.
     *
     * @return {Boolean} Returns `true` if this is a `Nothing` instance
     */
    readonly isNothing: boolean;
    /**
     * Return `true` if this is not a `Just` instance, or the contained
     * value is null or undefined. Otherwise, return `false`.
     *
     * @return {Boolean}
     */
    readonly isEmpty: boolean;
    /**
     * Return `true` if this is a `Just` instance. Otherwise, return `false`.
     *
     * @return {Boolean}
     */
    readonly isDefined: boolean;
    /**
     * Returns the maybe's value.
     *
     * @return {Any}
     */
    readonly get: T;
    toString(): string;
    /**
     * Returns the maybe's value if the maybe is a `Just`, otherwise return the
     * default value `or`.
     *
     * @param  {Any} or the default expression
     * @return {Any}
     */
    getOrElse(or: T): T;
    /**
     * Returns the maybe's value if the maybe is a `Just`, otherwise throw the
     * given `err` which can be either custom error or any object.
     *
     * @param  {Error} err Rubbish to throw :)
     * @return {Any}
     */
    getOrThrow(err: Error): T;
    /**
     * Returns this `Maybe` if it is a `Just`, otherwise return the result of
     * evaluating `alt`.
     *
     * @param  {Function} alt the alternative expression
     * @return {Maybe}
     */
    orElse<F extends T>(alt: () => Maybe<F>): Maybe<T>;
    /**
     * Returns a `Just` containing the result of applying `fn` to this `Maybe` value
     * if this `Maybe` is a `Just`. Otherwise return `Nothing`.
     *
     * @param  {Function} fn the function to apply
     * @return {Maybe}
     */
    map<F>(fn: (t: T) => F): Maybe<F>;
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
    flatMap<F>(fn: (t: T) => Maybe<F>): Maybe<F>;
    /**
     * Return the result of applying `f` to the value of this `Maybe` if this is
     * a `Just`. Otherwise, evaluates expression `ifEmpty`.
     *
     * @param  {Function} ifEmpty the expression to evaluete if this is a `Nothing`
     * @param  {Function} f       the function to apply if this is a `Just`
     * @return {Any}
     */
    fold<F>(ifEmpty: () => F, f: (t: T) => F): F;
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
    chain<F>(fn: (T) => Maybe<F>): () => Maybe<F>;
    /**
     * Return a `Right` containing this maybe's value if this is a `Just`, or
     * a `Left` containing the given `left` if this is a `Nothing`.
     *
     * @param  {Any}     left the value to return if this is a Nothing
     * @param  {Boolean} ev   evaluate if `left` is a function
     * @return {Maybe}
     */
    toRight<G>(left: G): Either<G, T>;
    /**
     * Return a `Left` containing this maybe's value if this is a `Nothing`,
     * or a `Right` containing the given `right` if this is a `Just`.
     *
     * @param  {Any}     right the value to return if this is a `Nothing`
     * @param  {Boolean} ev    evaluate if `right` is a function
     * @return {Maybe}
     */
    toLeft<G>(right: G): Either<T, G>;
}
export declare class JustWrapper<T> extends Maybe<T> {
    constructor(value: T);
    toString(): string;
    equals(that: any): boolean;
}
export declare class NothingWrapper extends Maybe<any> {
    constructor();
    toString(): string;
    equals(that: any): boolean;
}
/**
 * Returns a `Just` instance with the given value.
 *
 * @param  {Any}  value The value to wrap.
 * @return {Just}       Returns a `Just`
 */
export declare function Just<F>(value: F): JustWrapper<F>;
/**
 * Returns the singleton `Nothing` instance.
 *
 * @return {Nothing} Returns the singleton `Nothing`.
 */
export declare const Nothing: NothingWrapper;
