'use strict'

import N, {
  Either, Just, Nothing,
  Left, Right,
} from '../src/index'

const leftValue = 'Test Left'
const rightValue = 'Test Right'

const testLeft  = Left(leftValue)
const testRight = Right(rightValue)

describe('either', () => {
  describe('Either', () => {
    it('#isEither: should return true if the given value is a Left or Right', () =>{
      Either.isEither(testLeft).should.be.true()
      Either.isEither(testRight).should.be.true()
      Either.isEither(true).should.be.false()
    })

    it('#isLeft: should return true only if the given value is a Left', () => {
      Either.isLeft(testLeft).should.be.true()
      Either.isLeft(testRight).should.be.false()
    })

    it('#isRight: should return true only if the given value is a Right', () => {
      Either.isRight(testRight).should.be.true()
      Either.isRight(testLeft).should.be.false()
    })
  })

  describe('Left Projection', () => {
    it('#get: should return the defined value of a Left', () => {
      testLeft.left.get.should.eql(leftValue)
    })

    it('#get: should throw error of a Right', () => {
      (() => testRight.left.get).should.throw(/Want Either\.left\.value, but on Right/)
    })

    it('#toMaybe: should return a Just containing the Left value', () => {
      testLeft.left.toMaybe.should.be.eql(Just(leftValue))
    })

    it('#toMaybe: should return Nothing of a Right', () => {
      testRight.left.toMaybe.should.be.eql(Nothing)
    })

    it('#getOrElse: should return the defined value of a Left', () => {
      testLeft.left.getOrElse('other').should.eql(leftValue)
    })

    it('#getOrElse: should return the default value of a Right', () => {
      testLeft.right.getOrElse('other').should.eql('other')
    })

    it('#map: should throw error if the given argument is NOT a function', () => {
      const left = testLeft.left
      N.lazy(left.map, 'sth').should.throw(/Expects map function/)
    })

    it('#map: should return a Left with the value of the given function of a Left', () => {
      const either = Left('Err')
      either.left.map(x => new Error(x)).should.be.eql(Left(new Error('Err')))
    })

    it('#map: should return the original either of a Right', () => {
      testRight.left.map(x => x + '.mod').should.be.eql(testRight)
    })
  })

  describe('Right Projection', () => {
    it('#get: should return the defined value of a Right', () => {
      testRight.right.get.should.eql(rightValue)
    })

    it('#get: should throw error of a Left', () => {
      (() => testLeft.right.get).should.throw(/Want Either\.right\.value, but on Left/)
    })

    it('#toMaybe: should return a Just containing the Right value', () => {
      testRight.right.toMaybe.should.be.eql(Just(rightValue))
    })

    it('#toMaybe: should return Nothing of a Left', () => {
      testLeft.right.toMaybe.should.be.eql(Nothing)
    })

    it('#getOrElse: should return the defined value of Right', () => {
      testRight.right.getOrElse('other').should.eql(rightValue)
    })

    it('#getOrElse: should return the default value of a Left', () => {
      testRight.left.getOrElse('other').should.eql('other')
    })

    it('#map: should throw error if the given argument is NOT a function', () => {
      const right = testRight.right
      N.lazy(right.map, 'sth').should.throw(/Expects map function/)
    })

    it('#map: should return a Right with the value of the given function of a Right', () => {
      const either = Right(-10)
      either.right.map(Math.abs).should.be.eql(Right(10))
    })

    it('#map: should return the original either of a Left', () => {
      testLeft.right.map(x => x + '.mod').should.be.eql(testLeft)
    })
  })


})
