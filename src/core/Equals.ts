/**
 * An interface containing operations for equality. All core classes
 * in this packages impliments this interface.
 */

export function canEquals(that: any) {
  return that && typeof that.equals === 'function'
}

export interface Equals {
  /**
   * The universal equality method, should consider deep equals.
   */
  equals(that: any): boolean
}
