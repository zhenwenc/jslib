'use strict'

import { Iterable } from 'immutable'

export function isImmutable(thing: any) {
  return Boolean(isList(thing) || isMap(thing) ||
    isSet(thing) || isOrderedSet(thing) || isOrderedMap(thing))
}

export function isList(thing: any) {
  return Boolean(
    thing instanceof Iterable
    && thing['@@__IMMUTABLE_LIST__@@'])
}

export function isMap(thing: any) {
  return Boolean(
    thing instanceof Iterable
    && thing['@@__IMMUTABLE_MAP__@@'])
}

export function isSet(thing: any) {
  return Boolean(
    thing instanceof Iterable
    && thing['@@__IMMUTABLE_SET__@@'])
}

export function isStack(thing: any) {
  return Boolean(
    thing instanceof Iterable
    && thing['@@__IMMUTABLE_STACK__@@']
  )
}

export function isOrderedSet(thing: any) {
  return Boolean(
    thing instanceof Iterable
    && thing['@@__IMMUTABLE_ORDERED__@@']
    && thing.hasOwnProperty('__hash'))
}

export function isOrderedMap(thing: any) {
  return Boolean(
    thing instanceof Iterable
    && thing['@@__IMMUTABLE_ORDERED__@@']
    && !thing.hasOwnProperty('__hash'))
}
