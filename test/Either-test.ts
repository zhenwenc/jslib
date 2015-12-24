'use strict'

import { expect } from 'chai'
import { Just, Nothing } from '../src/Maybe'
import { Either, Left, Right } from '../src/Either'

describe('either', () => {
  describe('Either', () => {
    it('#isEither: should return true if the given value is a Left or Right', () => {
      expect(Either.isEither(Left(true))).to.be.true
      expect(Either.isEither(Right(true))).to.be.true
      expect(Either.isEither(true)).to.be.false
    })

    it('#isLeft: should return true only if the given value is a Left', () => {
      expect(Either.isLeft(Left(0))).to.be.true
      expect(Either.isLeft(Right(0))).to.be.false
    })

    it('#isRight: should return true only if the given value is a Right', () => {
      expect(Either.isRight(Right('right'))).to.be.true
      expect(Either.isRight(Left('left'))).to.be.false
    })
  })

  describe('Left Projection', () => {
    it('#get: should return the defined value of a Left', () => {
      expect(Left('left').left.get).to.eql('left')
    })

    it('#get: should throw error of a Right', () => {
      expect(() => Right('right').left.get).to.throw(/Want Either\.left\.value, but on Right/)
    })

    it('#toMaybe: should return a Just containing the Left value', () => {
      expect(Left('left').left.toMaybe).to.be.eql(Just('left'))
    })

    it('#toMaybe: should return Nothing of a Right', () => {
      expect(Right('right').left.toMaybe).to.be.eql(Nothing)
    })

    it('#getOrElse: should return the defined value of a Left', () => {
      expect(Left('left').left.getOrElse('other')).to.eql('left')
    })

    it('#getOrElse: should return the default value of a Right', () => {
      expect(Left('left').right.getOrElse('other')).to.eql('other')
    })

    it('#map: should return a Left with the value of the given function of a Left', () => {
      expect(Left('Err').left.map(x => new Error(x))).to.be.eql(Left(new Error('Err')))
    })

    it('#map: should return the original either of a Right', () => {
      expect(Right('right').left.map(x => x + '.mod')).to.be.eql(Right('right'))
    })
  })

  describe('Right Projection', () => {
    it('#get: should return the defined value of a Right', () => {
      expect(Right(101).right.get).to.eql(101)
    })

    it('#get: should throw error of a Left', () => {
      expect(() => Left('left').right.get).to.throw(/Want Either\.right\.value, but on Left/)
    })

    it('#toMaybe: should return a Just containing the Right value', () => {
      expect(Right(202).right.toMaybe).to.be.eql(Just(202))
    })

    it('#toMaybe: should return Nothing of a Left', () => {
      expect(Left('left').right.toMaybe).to.be.eql(Nothing)
    })

    it('#getOrElse: should return the defined value of Right', () => {
      expect(Right(false).right.getOrElse('other')).to.eql(false)
    })

    it('#getOrElse: should return the default value of a Left', () => {
      expect(Right('right').left.getOrElse('other')).to.eql('other')
    })

    it('#map: should return a Right with the value of the given function of a Right', () => {
      expect(Right(-10).right.map(Math.abs)).to.be.eql(Right(10))
    })

    it('#map: should return the original either of a Left', () => {
      expect(Left('left').right.map(x => x + '.mod')).to.be.eql(Left('left'))
    })
  })

})
