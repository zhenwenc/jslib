import { isEqual } from 'lodash';
import { Set } from 'immutable';

import { canEquals } from '../core/Equals';
import { Record } from '../core/Record';

const keys = Object.keys;

export function deepEqual(a, b): boolean {
  if (a === b) {
    return true;
  }

  if (a instanceof Record && b instanceof Record) {
    const keySet = Set(keys(a).concat(keys(b))).toList();
    return keySet.reduce((rs: boolean, key: string) => {
      return rs && deepEqual(a[key], b[key]);
    }, true);
  }

  if (canEquals(a) && canEquals(b)) {
    return a.equals(b);
  }

  return isEqual(a, b);
}
