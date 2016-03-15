/**
 * An interface containing operations for equality. All core classes
 * in this packages impliments this interface.
 */

export const IS_EQUALS_SENTINEL = '@@__TSFP_EQUALS__@@'

export function canEquals(that: any) {
  // return !!(that && that[IS_EQUALS_SENTINEL])
  return that && typeof that.equals === 'function'
}

export abstract class Equals {
  // IS_EQUALS_SENTINEL
  get '@@__TSFP_EQUALS__@@'() { return true }

  /**
   * The universal equality method, should consider deep equals.
   */
  abstract equals(that: any): boolean
}
