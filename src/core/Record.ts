/**
 * Note: This class is experimental at the moment.
 */

import { Map } from 'immutable'
import { deepEqual } from '../utils/deepEqual'
import { Equals } from './Equals'

export const IS_RECORD_SENTINEL = '@@__TSFP_RECORD__@@'

export abstract class Record extends Equals {

  // IS_RECORD_SENTINEL
  get '@@__TSFP_RECORD__@@'() { return true }

  /**
   * True if this and the other Record have value equality.
   */
  equals(that: any): boolean {
    return deepEqual(this, that)
  }

}
