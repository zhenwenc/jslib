'use strict'

import { expect } from 'chai'
import { Maybe, Just, Nothing } from '../src/Maybe'

describe('maybe', () => {
  describe('Maybe', () => {
    it('#isMaybe: should return true if the given value is a Just or Nothing', () => {
      expect(Maybe.isMaybe(Maybe.Just('SomeValue'))).to.be.true
      expect(Maybe.isMaybe(Maybe.Nothing)).to.be.true
    })

    it('#isJust: should return true only if the given value is a Just', () => {
      expect(Maybe.isJust(Maybe.Just('SomeValue'))).to.be.true
      expect(Maybe.isJust(Maybe.Nothing)).to.be.false
    })

    it('#isNothing: should return true only if the given value is a Nothing', () => {
      expect(Maybe.isNothing(Maybe.Nothing)).to.be.true
      expect(Maybe.isNothing(Maybe.Just('SomeValue'))).to.be.false
    })

    it('#of: should return a Just if given argument is defined', () => {
      expect(Maybe.isJust(Maybe.of('SomeValue'))).to.be.true
      expect(Maybe.isJust(Maybe.of('undefined'))).to.be.true
      expect(Maybe.isJust(Maybe.of(0))).to.be.true
      expect(Maybe.isNothing(Maybe.of('SomeValue'))).to.be.false
    })

    it('#of: should return a Nothing if the given argument is null or undefined', () => {
      expect(Maybe.isNothing(Maybe.of(null))).to.be.true
      expect(Maybe.isNothing(Maybe.of(undefined))).to.be.true
    })

    it('#eval: should return a Just if the given function returns non-null value', () => {
      expect(Maybe.eval(() => '101')).to.be.eql(Just('101'))
      expect(Maybe.eval(() => 0)).to.be.eql(Just(0))
    })

    it('#eval: should return a Nothing if the given function returns null or undefined', () => {
      expect(Maybe.eval(() => null)).to.be.eql(Nothing)
      expect(Maybe.eval(() => undefined)).to.be.eql(Nothing)
    })
  })

  describe('Just', () => {
    it('#isJust: should return true', () => {
      expect(Just('SomeValue').isJust).to.be.true
      expect(Nothing.isJust).to.be.false
    })

    it('#get: should return the defined value', () => {
      const value = 'This is a string!'
      expect(Just(value).get).to.be.eql(value)
    })

    it('#getOrElse: should always return the original value', () => {
      expect(Just('Here').getOrElse('There')).to.be.eql('Here')
      expect(Just(null).getOrElse('Some')).to.be.null
    })

    it('#getOrThrow: should always return itself', () => {
      const value = 'Something'
      expect(Just(value).getOrThrow(new Error('Err'))).to.be.eql(value)
    })

    it('#orElse: should always return itself', () => {
      const maybe = Just('Something')
      expect(maybe.orElse(() => Nothing)).to.be.eql(maybe)
    })

    it('#map: should return a Just with the returned value of the given function', () => {
      const maybe  = Just('Hello ')
      const kitten = 'Kitten!'
      expect(maybe.map(x => x + kitten)).to.be.eql(Just('Hello Kitten!'))
    })

    it('#chain: should return a function that evaluats the given function with the Just\'s value', () => {
      const fn = Just([1, 9, 5]).chain(x => x.map(y => y * 2))
      expect(typeof fn).to.be.eql('function')
      expect(fn()).to.be.eql([2, 18, 10])
    })
  })

  describe('Nothing', () => {
    it('#isNothing: should return true', () => {
      expect(Nothing.isNothing).to.be.true
      expect(Just('SomeValue').isNothing).to.be.false
    })

    it('#get: should throw error of no element', () => {
      expect(() => Nothing.get).to.throw(/Can't get value from Nothing\./)
    })

    it('#getOrElse: should always return the given default value', () => {
      expect(Nothing.getOrElse('DefaultValue')).to.be.eql('DefaultValue')
      expect(Nothing.getOrElse(false)).to.be.false
      expect(Nothing.getOrElse(null)).to.be.null
    })

    it('#getOrElse: should not evaluate the given default value even it is a function', () => {
      expect(Nothing.getOrElse(() => 101)).to.not.be.eql(() => 101)
    })

    it('#getOrThrow: should throw the given Error instance', () => {
      expect(() => Nothing.getOrThrow(new Error('Err'))).to.throw(/Err/)
    })

    it('#orElse: should always return the given alternative value', () => {
      const alternative = Just('Other Value')
      expect(Nothing.orElse(() => alternative)).to.be.eql(alternative)
    })

    it('#map: should always return Nothing', () => {
      expect(Nothing.map(x => true)).to.be.eql(Nothing)
    })

    it('#chain: should return a function that evaluats the given function with the Just\'s value', () => {
      const fn = Nothing.chain(x => x.map(y => y * 2))
      expect(typeof fn).to.be.eql('function')
      expect(fn()).to.be.eql(Nothing)
    })
  })
})
