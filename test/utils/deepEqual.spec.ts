import { expect } from 'chai'
import { List, Map, Set, Stack } from 'immutable'
import { Maybe, Just, Nothing } from '../../src/core/Maybe'
import { Left, Right } from '../../src/core/Either'
import { Record } from '../../src/core/Record'
import { deepEqual } from '../../src/utils/deepEqual'

describe('deepEqual', () => {

  describe('JS object', () => {
    it('should compare primitive datatype correctly (number)', () => {
      expect(deepEqual(1, 1)).to.be.true
      expect(deepEqual(1, 0)).to.be.false
    })
    it('should compare primitive datatype correctly (string)', () => {
      expect(deepEqual('foo', 'foo')).to.be.true
      expect(deepEqual('foo', 'bar')).to.be.false
    })
    it('should compare primitive datatype correctly (boolean)', () => {
      expect(deepEqual(false, false)).to.be.true
      expect(deepEqual(true, false)).to.false
    })
    it('should compare native JS object correctly', () => {
      const newJS = () => { return { a: 1, b: 'foo' } }
      expect(deepEqual(newJS(), newJS())).to.be.true
    })
  })

  describe('immutable iterable', () => {
    it('should compare collections correctly', () => {
      expect(deepEqual(List([1, 2]), List([1, 2]))).to.be.true
      expect(deepEqual(Set([1, 2]), Set([1, 2]))).to.be.true
      expect(deepEqual(Stack([1, 2]), Stack([1, 2]))).to.be.true
      expect(deepEqual(Map({ x: 'foo' }), Map({ x: 'foo' }))).to.be.true
    })
  })

  describe('Record', () => {

    class Foo extends Record {
      constructor(public x: any, public y?: any) { super() }
    }

    class Bar extends Record {
      constructor(public m: any, public n?: any) { super() }
    }

    it('should compare Record with primitive datatype correctly (number)', () => {
      expect(deepEqual(new Foo(0, 1), new Foo(0, 1))).to.be.true
      expect(deepEqual(new Foo(0, 0), new Foo(0, 1))).to.be.false
    })
    it('should compare Record with primitive datatype correctly (string)', () => {
      expect(deepEqual(new Foo('foo', 'bar'), new Foo('foo', 'bar'))).to.be.true
      expect(deepEqual(new Foo('foo', 'baz'), new Foo('foo', 'bar'))).to.be.false
    })
    it('should compare Record with primitive datatype correctly (boolean)', () => {
      expect(deepEqual(new Foo(true, false), new Foo(true, false))).to.be.true
      expect(deepEqual(new Foo(true, true), new Foo(true, false))).to.be.false
    })
    it('should compare Record with native JS object correctly', () => {
      expect(deepEqual(
        new Foo({ x: 'foo' }, { y: 'bar' }),
        new Foo({ x: 'foo' }, { y: 'bar' })
      )).to.be.true
      expect(deepEqual(
        new Foo({ x: 'foo' }, { y: 'bar' }),
        new Foo({ x: 'foo' }, { y: 'baz' })
      )).to.be.false
    })
    it('should compare Record with immutable object correctly', () => {
      expect(deepEqual(
        new Foo(List([1, 2]), Stack(['foo', 'bar'])),
        new Foo(List([1, 2]), Stack(['foo', 'bar']))
      )).to.be.true
      expect(deepEqual(
        new Foo(List([1, 2]), Stack(['foo', 'bar'])),
        new Foo(List([1, 3]), Stack(['foo', 'baz']))
      )).to.be.false
    })
    it('should compare nested Record correctly', () => {
      expect(deepEqual(new Foo(new Bar('baz')), new Foo(new Bar('baz')))).to.be.true
      expect(deepEqual(new Foo(new Bar('baz')), new Foo(new Bar('qux')))).to.be.false
    })
    // Note: this is a guard for compatibility with ImmutableJS, if this
    //       test case failed then you should check if the comparison
    //       logic for Iterable in ImmutableJS is changed.
    it('should compare nested immutable collection of Records', () => {
      expect(deepEqual(List([new Foo(1)]), List([new Foo(1)]))).to.be.true
      expect(deepEqual(List([new Foo(1)]), List([new Foo(0)]))).to.be.false
    })
    it('should compare nested Record and immutable object (2 layer)', () => {
      expect(deepEqual(new Foo(List([1, 2])), new Foo(List([1, 2])))).to.be.true
      expect(deepEqual(new Foo(List([1, 2])), new Foo(List([1, 3])))).to.be.false
    })
    it('should compare nested Record and immutable object (3 layer)', () => {
      expect(deepEqual(
        new Foo(List([new Bar(1, 'foo')])),
        new Foo(List([new Bar(1, 'foo')]))
      )).to.be.true
      expect(deepEqual(
        new Foo(List([new Bar(1, 'foo')])),
        new Foo(List([new Bar(1, 'bar')]))
      )).to.be.false
    })
    it('should compare nested Record and immutable object (4 layer)', () => {
      expect(deepEqual(
        new Foo(List([new Bar(Math.PI, Set([1, 2]))])),
        new Foo(List([new Bar(Math.PI, Set([1, 2]))]))
      )).to.be.true
      expect(deepEqual(
        new Foo(List([new Bar(Math.PI, Set([1, 2]))])),
        new Foo(List([new Bar(Math.PI, Set([1, 0]))]))
      )).to.be.false
    })
  })

  describe('Maybe', () => {
    it('should compare Just with primitive datatype correctly (number)', () => {
      expect(deepEqual(Just(0), Just(0))).to.be.true
      expect(deepEqual(Just(1), Just(0))).to.be.false
    })
    it('should compare Just with primitive datatype correctly (string)', () => {
      expect(deepEqual(Just('foo'), Just('foo'))).to.be.true
      expect(deepEqual(Just('foo'), Just('bar'))).to.be.false
    })
    it('should compare Just with primitive datatype correctly (boolean)', () => {
      expect(deepEqual(Just(false), Just(false))).to.be.true
      expect(deepEqual(Just(true), Just(false))).to.be.false
    })
    it('should compare Just with native JS object correctly', () => {
      expect(deepEqual(Just({ x: 'foo' }), Just({ x: 'foo' }))).to.be.true
      expect(deepEqual(Just({ x: 'foo' }), Just({ x: 'bar' }))).to.be.false
    })
    it('should compare Just with immutable object correctly', () => {
      expect(deepEqual(Just(List([1, 2])), Just(List([1, 2])))).to.be.true
      expect(deepEqual(Just(Set([1, 2])), Just(Set([1, 2])))).to.be.true
      expect(deepEqual(Just(Stack([1, 2])), Just(Stack([1, 2])))).to.be.true
      expect(deepEqual(Just(Map({ x: 1.0 })), Just(Map({ x: 1.0 })))).to.be.true
    })
    it('should compare Nothing and always return true', () => {
      expect(deepEqual(Nothing, Nothing)).to.be.true
    })
  })

  describe('Either', () => {
    it('should compare Right with primitive datatype correctly (number)', () => {
      const newRight = (o: number) => Right<Error, number>(o)
      expect(deepEqual(newRight(1), newRight(1))).to.be.true
      expect(deepEqual(newRight(1), newRight(0))).to.be.false
      expect(deepEqual(newRight(1).right, newRight(1).right)).to.be.true
      expect(deepEqual(newRight(1).right, newRight(0).right)).to.be.false
    })
    it('should compare Right with primitive datatype correctly (string)', () => {
      const newRight = (o: string) => Right<Error, string>(o)
      expect(deepEqual(newRight('foo'), newRight('foo'))).to.be.true
      expect(deepEqual(newRight('foo'), newRight('bar'))).to.be.false
      expect(deepEqual(newRight('foo').right, newRight('foo').right)).to.be.true
      expect(deepEqual(newRight('foo').right, newRight('bar').right)).to.be.false
    })
    it('should compare Right with primitive datatype correctly (boolean)', () => {
      const newRight = (o: boolean) => Right<Error, boolean>(o)
      expect(deepEqual(newRight(false), newRight(false))).to.be.true
      expect(deepEqual(newRight(true), newRight(false))).to.be.false
      expect(deepEqual(newRight(false).right, newRight(false).right)).to.be.true
      expect(deepEqual(newRight(true).right, newRight(false).right)).to.be.false
    })
    it('should compare Right with native JS object correctly', () => {
      const newRight = (o: { x: number }) => Right<Error, { x: number }>(o)
      expect(deepEqual(newRight({ x: 5 }), newRight({ x: 5 }))).to.be.true
      expect(deepEqual(newRight({ x: 5 }), newRight({ x: 9 }))).to.be.false
      expect(deepEqual(newRight({ x: 5 }).right, newRight({ x: 5 }).right)).to.be.true
      expect(deepEqual(newRight({ x: 5 }).right, newRight({ x: 9 }).right)).to.be.false
    })
    it('should compare Right with immutable object correctly', () => {
      const newList = (o: number[]) => Right<Error, List<number>>(List(o))
      const newSet = (o: number[]) => Right<Error, Set<number>>(Set(o))
      const newStack = (o: number[]) => Right<Error, Stack<number>>(Stack(o))
      const newMap = (o: { [idx: string]: number }) => {
        return Right<Error, Map<string, number>>(Map(o))
      }

      expect(deepEqual(newList([1, 2]), newList([1, 2]))).to.be.true
      expect(deepEqual(newList([1, 2]), newList([1, 3]))).to.be.false
      expect(deepEqual(newList([1, 2]).right, newList([1, 2]).right)).to.be.true
      expect(deepEqual(newList([1, 2]).right, newList([1, 3]).right)).to.be.false

      expect(deepEqual(newSet([1, 2]), newSet([1, 2]))).to.be.true
      expect(deepEqual(newSet([1, 2]), newSet([1, 3]))).to.be.false
      expect(deepEqual(newSet([1, 2]).right, newSet([1, 2]).right)).to.be.true
      expect(deepEqual(newSet([1, 2]).right, newSet([1, 3]).right)).to.be.false

      expect(deepEqual(newStack([1, 2]), newStack([1, 2]))).to.be.true
      expect(deepEqual(newStack([1, 2]), newStack([1, 3]))).to.be.false
      expect(deepEqual(newStack([1, 2]).right, newStack([1, 2]).right)).to.be.true
      expect(deepEqual(newStack([1, 2]).right, newStack([1, 3]).right)).to.be.false

      expect(deepEqual(newMap({ x: 5 }), newMap({ x: 5 }))).to.be.true
      expect(deepEqual(newMap({ x: 5 }), newMap({ x: 9 }))).to.be.false
      expect(deepEqual(newMap({ x: 5 }).right, newMap({ x: 5 }).right)).to.be.true
      expect(deepEqual(newMap({ x: 5 }).right, newMap({ x: 9 }).right)).to.be.false
    })
    it('should compare Left with Error correctly', () => {
      const newLeft = (o: Error) => Left<Error, number>(o)
      expect(deepEqual(
        newLeft(new Error('foo')),
        newLeft(new Error('foo'))
      )).to.be.true
      expect(deepEqual(
        newLeft(new Error('foo')).left,
        newLeft(new Error('foo')).left
      )).to.be.true
      expect(deepEqual(
        newLeft(new Error('foo')),
        newLeft(new Error('bar'))
      )).to.be.false
      expect(deepEqual(
        newLeft(new Error('foo')).left,
        newLeft(new Error('bar')).left
      )).to.be.false
    })
    it('should compare Left with TypeError correctly', () => {
      const newLeft = (o: TypeError) => Left<TypeError, number>(o)
      expect(deepEqual(
        newLeft(new TypeError('bar')),
        newLeft(new TypeError('bar'))
      )).to.be.true
      expect(deepEqual(
        newLeft(new TypeError('bar')),
        newLeft(new TypeError('bar'))
      )).to.be.true
      expect(deepEqual(
        newLeft(new TypeError('bar')).left,
        newLeft(new TypeError('foo')).left
      )).to.be.false
      expect(deepEqual(
        newLeft(new TypeError('bar')).left,
        newLeft(new TypeError('foo')).left
      )).to.be.false
    })
  })

})
