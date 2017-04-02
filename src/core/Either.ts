/* tslint:disable:no-unused-variable */
import { Maybe, Just, Nothing, NothingWrapper } from './Maybe';
import { Record } from './Record';
import { deepEqual } from '../utils/deepEqual';
/* tslint:enable:no-unused-variable */

// -- Either Class ------------------------------------------------------------

export abstract class Either<A, B> extends Record {

  constructor(public a: A, public b: B) {
    super();
  }

  static Left<X, Y>(value: X): Either<X, Y> {
    return new LeftWrapper<X, Y>(value);
  }

  static Right<X, Y>(value: Y): Either<X, Y> {
    return new RightWrapper<X, Y>(value);
  }

  static isEither(value) {
    return value instanceof Either;
  }

  static isLeft(value) {
    return Either.isEither(value) && value.isLeft;
  }

  static isRight(value) {
    return Either.isEither(value) && value.isRight;
  }

  abstract getIsLeft(): boolean;
  abstract getIsRight(): boolean;

  get isLeft(): boolean {
    return this.getIsLeft();
  }

  get isRight(): boolean {
    return this.getIsRight();
  }

  get left(): LeftProjection<A, B> {
    return new LeftProjection(this);
  }

  get right(): RightProjection<A, B> {
    return new RightProjection(this);
  }

  get swap(): Either<B, A> {
    return this.isLeft
      ? Either.Right<B, A>(this.a)
      : Either.Left<B, A>(this.b);
  }

  /**
   * Applies `fa` if this is a `Left` or `fb` if this is a `Right`.
   *
   * @param  {Function} fa the function to apply if this is a `Left`
   * @param  {Function} fb the function to apply if this is a `Right`
   * @return {Any}         the results of applying the function
   */
  fold<X, Y>(fa: (a: A) => X, fb: (b: B) => Y) {
    return this.isLeft ? fa(this.a) : fb(this.b);
  }
}

// -- Left / Right Class ------------------------------------------------------

class LeftWrapper<A, B> extends Either<A, B> {
  constructor(value: A) { super(value, undefined); }
  getIsLeft() { return true; }
  getIsRight() { return false; }

  equals(that: any) {
    return Either.isLeft(that)
      && deepEqual(this.left.get, that.left.get);
  }

  toString() {
    return `Left(${this.a})`;
  }
}

class RightWrapper<A, B> extends Either<A, B> {
  constructor(value: B) { super(undefined, value); }
  getIsLeft() { return false; }
  getIsRight() { return true; }

  equals(that: any) {
    return Either.isRight(that)
      && deepEqual(this.right.get, that.right.get);
  }

  toString() {
    return `Right(${this.b})`;
  }
}

// -- Left / Right Projection Class -------------------------------------------

export class LeftProjection<A, B> extends Record {
  constructor(private e: Either<A, B>) { super(); }

  /**
   * Returns the value from this `Either` if this is of a `Left`, otherwise
   * throws an Error.
   *
   * @return {Any}
   */
  get get(): A {
    if (this.e.isLeft) { return this.e.a; }
    throw new Error(`Want Either.left.value, but on Right`);
  }

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
  get toMaybe(): Maybe<A> {
    return this.e.isLeft ? Just(this.get) : Nothing;
  }

  /**
   * Returns the value from this `Either` if this is of a `Left`, or the given
   * argument if this is of a `Right`.
   *
   * @param  {Any} or The default value
   * @return {Any}
   */
  getOrElse<X>(or: X): A | X {
    return this.e.isLeft ? this.get : or;
  }

  /**
   * Maps the function argument through `Left` if this is of a `Left`,
   * otherwise returns the original `Eihter`.
   *
   * @param  {Function} fn The function to map
   * @return {Either}
   */
  map<X>(fn: (a: A) => X): Either<X, B> {
    return this.e.isLeft
      ? Either.Left<X, B>(fn(this.get))
      : Either.Right<X, B>(this.e.right.get);
  }

  /**
   * Binds the given function across `Left` if this is of a `Left`, otherwise
   * returns the original `Either`. Slightly different from `map` is that `fn`
   * is expected to return an `Either`.
   *
   * @param  {Function} fn The function to bind accross the `Left`
   * @return {Either}
   */
  flatMap<X>(fn: (a: A) => Either<X, B>): Either<X, B> {
    return this.e.isLeft ? fn(this.get) : Either.Right<X, B>(this.e.right.get);
  }

  equals(that: any) {
    return that instanceof LeftProjection
      && deepEqual(this.get, that.get);
  }

  toString() { return `LeftProjection(${this.e})`; }
}

export class RightProjection<A, B> extends Record {
  constructor(private e: Either<A, B>) { super(); }

  /**
   * Returns the value from this `Either` if this is of a `Right`, otherwise
   * throws an Error.
   *
   * @return {Any}
   */
  get get(): B {
    if (this.e.isRight) { return this.e.b; }
    throw new Error(`Want Either.right.value, but on Left`);
  }

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
  get toMaybe() {
    return this.e.isRight ? Just(this.get) : Nothing;
  }

  /**
   * Returns the value from this `Either` if this is of a `Right`, or the given
   * argument if this is of a `Left`.
   *
   * @param  {Any} or The default value
   * @return {Any}
   */
  getOrElse<X>(or: X): B | X {
    return this.e.isRight ? this.get : or;
  }

  /**
   * Maps the function argument through `Right` if this is of a `Right`,
   * otherwise returns the original `Eihter`.
   *
   * @param  {Function} fn The function to map
   * @return {Either}
   */
  map<X>(fn: (b: B) => X): Either<A, X> {
    return this.e.isRight
      ? Either.Right<A, X>(fn(this.get))
      : Either.Left<A, X>(this.e.left.get);
  }

  /**
   * Binds the given function across `Right` if this is of a `Right`, otherwise
   * returns the original `Either`. Slightly different from `map` is that `fn`
   * is expected to return an `Either`.
   *
   * @param  {Function} fn The function to bind accross the `Right`
   * @return {Either}
   */
  flatMap<X>(fn: (b: B) => Either<A, X>): Either<A, X> {
    return this.e.isRight ? fn(this.get) : Either.Left<A, X>(this.e.left.get);
  }

  equals(that: any) {
    return that instanceof RightProjection
      && deepEqual(this.get, that.get);
  }

  toString() { return `RightProjection(${this.e})`; }
}

// -- Aliases -----------------------------------------------------------------

/* tslint:disable variable-name */
export const Left = Either.Left;
export const Right = Either.Right;
