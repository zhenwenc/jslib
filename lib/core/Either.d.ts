import { Maybe, NothingWrapper } from './Maybe';
import { Record } from './Record';
export declare abstract class Either<A, B> extends Record {
    a: A;
    b: B;
    constructor(a: A, b: B);
    static Left<X, Y>(value: X): Either<X, Y>;
    static Right<X, Y>(value: Y): Either<X, Y>;
    static isEither(value: any): boolean;
    static isLeft(value: any): any;
    static isRight(value: any): any;
    abstract getIsLeft(): boolean;
    abstract getIsRight(): boolean;
    readonly isLeft: boolean;
    readonly isRight: boolean;
    readonly left: LeftProjection<A, B>;
    readonly right: RightProjection<A, B>;
    readonly swap: Either<B, A>;
    /**
     * Applies `fa` if this is a `Left` or `fb` if this is a `Right`.
     *
     * @param  {Function} fa the function to apply if this is a `Left`
     * @param  {Function} fb the function to apply if this is a `Right`
     * @return {Any}         the results of applying the function
     */
    fold<X, Y>(fa: (a: A) => X, fb: (b: B) => Y): X | Y;
}
export declare class LeftProjection<A, B> extends Record {
    private e;
    constructor(e: Either<A, B>);
    /**
     * Returns the value from this `Either` if this is of a `Left`, otherwise
     * throws an Error.
     *
     * @return {Any}
     */
    readonly get: A;
    /**
     * Returns a `Just` containing the `Either` value if this is of a `Left`
     * or a `Nothing` if this is of a `Right`.
     *
     * {{{
     * 	Left(12).left.toMaybe // Just(12)
     * 	Right(12).left.toMaybe // Nothing
     * }}}
     *
     * @return {Maybe}
     */
    readonly toMaybe: Maybe<A>;
    /**
     * Returns the value from this `Either` if this is of a `Left`, or the given
     * argument if this is of a `Right`.
     *
     * @param  {Any} or The default value
     * @return {Any}
     */
    getOrElse<X>(or: X): A | X;
    /**
     * Maps the function argument through `Left` if this is of a `Left`,
     * otherwise returns the original `Eihter`.
     *
     * @param  {Function} fn The function to map
     * @return {Either}
     */
    map<X>(fn: (a: A) => X): Either<X, B>;
    /**
     * Binds the given function across `Left` if this is of a `Left`, otherwise
     * returns the original `Either`. Slightly different from `map` is that `fn`
     * is expected to return an `Either`.
     *
     * @param  {Function} fn The function to bind accross the `Left`
     * @return {Either}
     */
    flatMap<X>(fn: (a: A) => Either<X, B>): Either<X, B>;
    equals(that: any): boolean;
    toString(): string;
}
export declare class RightProjection<A, B> extends Record {
    private e;
    constructor(e: Either<A, B>);
    /**
     * Returns the value from this `Either` if this is of a `Right`, otherwise
     * throws an Error.
     *
     * @return {Any}
     */
    readonly get: B;
    /**
     * Returns a `Just` containing the `Either` value if this is of a `Right`
     * or a `Nothing` if this is a `Left`.
     *
     * {{{
     * 	Right(21).right.toMaybe // Just(21)
     * 	Left(21).right.toMaybe // Nothing
     * }}}
     *
     * @return {Maybe}
     */
    readonly toMaybe: NothingWrapper;
    /**
     * Returns the value from this `Either` if this is of a `Right`, or the given
     * argument if this is of a `Left`.
     *
     * @param  {Any} or The default value
     * @return {Any}
     */
    getOrElse<X>(or: X): B | X;
    /**
     * Maps the function argument through `Right` if this is of a `Right`,
     * otherwise returns the original `Eihter`.
     *
     * @param  {Function} fn The function to map
     * @return {Either}
     */
    map<X>(fn: (b: B) => X): Either<A, X>;
    /**
     * Binds the given function across `Right` if this is of a `Right`, otherwise
     * returns the original `Either`. Slightly different from `map` is that `fn`
     * is expected to return an `Either`.
     *
     * @param  {Function} fn The function to bind accross the `Right`
     * @return {Either}
     */
    flatMap<X>(fn: (b: B) => Either<A, X>): Either<A, X>;
    equals(that: any): boolean;
    toString(): string;
}
export declare const Left: typeof Either.Left;
export declare const Right: typeof Either.Right;
