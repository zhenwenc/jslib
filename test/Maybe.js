'use strict'

import N, { Maybe, Just, Nothing } from '../src/index'

const nothing = Nothing

describe('maybe', () => {
  describe('Maybe', () => {
    it('#isMaybe: should return true if the given value is a Just or Nothing', () => {
      Maybe.isMaybe(Maybe.Just('SomeValue')).should.be.true()
      Maybe.isMaybe(Maybe.Nothing).should.be.true()
    })

    it('#isJust: should return true only if the given value is a Just', () => {
      Maybe.isJust(Maybe.Just('SomeValue')).should.be.true()
      Maybe.isJust(Maybe.Nothing).should.be.false()
    })

    it('#isNothing: should return true only if the given value is a Nothing', () => {
      Maybe.isNothing(Maybe.Nothing).should.be.true()
      Maybe.isNothing(Maybe.Just('SomeValue')).should.be.false()
    })

    it('#of: should return a Just if given argument is defined', () => {
      Maybe.isJust(Maybe.of('SomeValue')).should.be.true()
      Maybe.isJust(Maybe.of('undefined')).should.be.true()
      Maybe.isJust(Maybe.of(0)).should.be.true()
      Maybe.isNothing(Maybe.of('SomeValue')).should.be.false()
    })

    it('#of: should return a Nothing if the given argument is null or undefined', () => {
      Maybe.isNothing(Maybe.of(null)).should.be.true()
      Maybe.isNothing(Maybe.of(undefined)).should.be.true()
    })

    it('#eval: should throw error if the argument is not a function', () => {
      N.lazy(Maybe.eval, 'function').should.throw(/Expects function to evaluate/)
    })

    it('#eval: should return a Just if the given function returns non-null value', () => {
      Maybe.eval(() => '101').should.be.eql(Just('101'))
      Maybe.eval(() => 0).should.be.eql(Just(0))
    })

    it('#eval: should return a Nothing if the given function returns null or undefined', () => {
      Maybe.eval(() => null).should.be.eql(Nothing)
      Maybe.eval(() => undefined).should.be.eql(Nothing)
    })
  })

  describe('Just', () => {
    it('#isJust: should return true', () => {
      Just('SomeValue').isJust.should.be.true()
      Nothing.isJust.should.be.false()
    })

    it('#get: should return the defined value', () => {
      const value = 'This is a string!'
      Just(value).get.should.be.eql(value)
    })

    it('#getOrElse: should always return the original value', () => {
      Just('Here').getOrElse('There').should.be.eql('Here')
      should.not.exist(Just(null).getOrElse('Some'))
    })

    it('#getOrThrow: should always return itself', () => {
      const value = 'Something'
      Just(value).getOrThrow(new Error('Err')).should.be.eql(value)
    })

    it('#orElse: should always return itself', () => {
      const maybe = Just('Something')
      maybe.orElse(Nothing).should.be.eql(maybe)
    })

    it('#map: should throw error if the given argument is NOT a function', () => {
      const maybe = Just(100)
      N.lazy(maybe.map, 'function').should.throw(/Expects map function/)
    })

    it('#map: should return a Just with the returned value of the given function', () => {
      const maybe  = Just('Hello ')
      const kitten = 'Kitten!'
      maybe.map(x => x + kitten).should.be.eql(Just('Hello Kitten!'))
    })

    it('#chain: should throw error if the given argument is NOT a function', () => {
      const maybe = Just(true)
      N.lazy(maybe.chain, 'function').should.throw(/Expects chain function/)
    })

    it('#chain: should return a function that evaluats the given function with the Just\'s value', () => {
      const fnActual = Just([1, 9, 5]).chain(x => x.map(y => y * 2))
      fnActual.should.be.Function()
      fnActual.call().should.be.eql([2, 18, 10])
    })
  })

  describe('Nothing', () => {
    it('#isNothing: should return true', () => {
      Nothing.isNothing.should.be.true()
      Just('SomeValue').isNothing.should.be.false()
    })

    it('#get: should throw error of no element', () => {
      (() => Nothing.get).should.throw(/Can't get value from Nothing\./)
    })

    it('#getOrElse: should always return the given default value', () => {
      Nothing.getOrElse('DefaultValue').should.be.eql('DefaultValue')
      Nothing.getOrElse(false).should.be.false()
      should.not.exist(Nothing.getOrElse(null))
    })

    it('#getOrElse: should not evaluate the given default value even it is a function', () => {
      Nothing.getOrElse(() => 101).should.be.eql(() => 101)
    })

    it('#getOrThrow: should throw the given Error instance', () => {
      console.info(N.lazy(nothing.getOrThrow, new Error('Err')).toString())
      N.lazy(nothing.getOrThrow, new Error('Err')).should.throw(/Err/)
    })

    it('#getOrThrow: should throw the given object', () => {
      N.lazy(nothing.getOrThrow, 'string').should.throw(/string/)
    })

    it('#orElse: should always return the given alternative value', () => {
      const alternative = Just('Other Value')
      Nothing.orElse(alternative).should.be.eql(alternative)
      Nothing.orElse(() => alternative).should.be.eql(alternative)
    })

    it('#orElse: should throw error if the given value isn\'t a Maybe', () => {
      N.lazy(nothing.orElse, 'String').should.throw(/Return type of alternative must be Maybe/)
    })

    it('#orElse: should throw error if the given function doesn\'t return a Maybe', () => {
      N.lazy(nothing.orElse, () => 1024).should.throw(/Return type of alternative must be Maybe/)
    })

    it('#map: should throw error if the given argument is NOT a function', () => {
      N.lazy(nothing.map, 'function').should.throw(/Expects map function/)
    })

    it('#map: should always return Nothing', () => {
      Nothing.map(x => true).should.be.eql(Nothing)
    })

    it('#chain: should throw error if the given argument is NOT a function', () => {
      N.lazy(nothing.chain, 'function').should.throw(/Expects chain function/)
    })

    it('#chain: should return a function that evaluats the given function with the Just\'s value', () => {
      const fnActual = Nothing.chain(x => x.map(y => y * 2))
      fnActual.should.be.Function()
      fnActual.call().should.be.eql(Nothing)
    })
  })
})
