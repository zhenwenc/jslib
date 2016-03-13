import { isEqual } from 'lodash'
import { is as immutableEq } from  'immutable'
import { canEquals } from '../core/Equals'
import { isImmutable } from './Immutable'

export function deepEqual(a, b): boolean {
  if (a === b) {
    return true
  }

  if (canEquals(a) && canEquals(b)) {
    return a.equals(b)
  }

  if (isImmutable(a) && isImmutable(b)) {
    return immutableEq(a, b)
  }

  return isEqual(a, b)
}
