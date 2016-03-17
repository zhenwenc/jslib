// Extended type definitions for chai framework

declare module Chai {
  interface Assertion {

    error(
      exp: Error | Function | RegExp | string,
      errMsg?: RegExp | string,
      msg?: string): Assertion

    errorOnLeft(
      exp: Error | Function | RegExp | string,
      errMsg?: RegExp | string,
      msg?: string): Assertion

    sizeOf(exp: number): Assertion

  }
}
