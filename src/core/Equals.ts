/**
 * An interface containing operations for equality. All core classes
 * in this packages impliments this interface.
 */

export const IS_EQUALS_SENTINEL = '@@__TSFP_EQUALS__@@'

export function canEquals(that: any) {
  return !!(that && that[IS_EQUALS_SENTINEL])
}

export abstract class Equals {
  public '@@__TSFP_EQUALS__@@' = true // IS_EQUALS_SENTINEL

  /**
   * The universal equality method, should consider deep equals.
   */
  abstract equals(that: any): boolean
}
