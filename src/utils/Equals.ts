import { is as immutableEq } from  'immutable'
import { isImmutable } from './Immutable'

export default function deepEqual(a, b): boolean {
  if (a === b) {
    return true
  }

  if (isImmutable(a) && isImmutable(b)) {
    return immutableEq(a, b)
  }

  return Object.is(a, b)
}
