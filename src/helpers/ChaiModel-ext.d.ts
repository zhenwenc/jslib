// Extended type definitions for chai framework

declare module Chai {
  interface Assertion {
    sizeOf(exp: number): Assertion
  }
}
