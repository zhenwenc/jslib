/**
 * This helper is heavily based on https://github.com/astorije/chai-immutable.
 * The main intention is to enhance the support of TypeScrpt, and integrate
 * with the support the classes in this library, such as Either, and Maybe, etc.
 *
 * Reference: https://github.com/astorije/chai-immutable
 */
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var immutable_1 = require("immutable");
var Either_1 = require("../core/Either");
var Equals_1 = require("../core/Equals");
var deepEqual_1 = require("../utils/deepEqual");
var Immutable_1 = require("../utils/Immutable");
var isIterable = immutable_1.Iterable.isIterable;
var asIterable = function asIterable(o) {
    return o;
};
var isKeyedIterable = immutable_1.Iterable.isKeyed;
var asKeyedIterable = function asKeyedIterable(o) {
    return o;
};
function ChaiModel(chai, utils) {
    /* tslint:disable variable-name no-unused-expression */
    var Assertion = chai.Assertion;
    /**
     * ### .empty
     *
     * Asserts that the immutable collection is empty.
     *
     * ```js
     * expect(List()).to.be.empty
     * expect(List.of(1, 2, 3)).to.not.be.empty
     * ```
     *
     * @name empty
     * @api public
     */
    Assertion.overwriteProperty('empty', function (_super) {
        return function () {
            if (isIterable(this._obj)) {
                var size = asIterable(this._obj).size;
                this.assert(size === 0, 'expected immutable #{this} to be empty but got size #{act}', 'expected immutable #{this} to not be empty', 0, size);
            } else {
                _super.apply(this, arguments);
            }
        };
    });
    /**
     * ### .equal(collection)
     *
     * Asserts that the values of the target are equvalent to the values of
     * `collection`. Aliases of Chai's original `equal` method are also supported.
     *
     * If both expected and actual value are immutable, then the function will
     * convert the given values to JS object, and deep compare them.
     *
     * ```js
     * var a = List.of(1, 2, 3)
     * var b = List.of(1, 2, 3)
     * expect(a).to.eq(b)
     * ```
     *
     * @name deep.equal
     * @alias eq
     * @alias eql
     * @alias eqls
     * @alias equals
     * @param {Collection} value
     * @api public
     */
    function assertCollectionEqual(_super) {
        return function (expected) {
            if (isIterable(expected) && isIterable(this._obj)) {
                var actual = asIterable(this._obj);
                this.assert(_.isEqual(actual.toJS(), expected.toJS()), 'expected immutable #{act} to equal #{exp}', 'expected immutable #{act} to not equal #{exp}', expected, actual, true);
            } else if (Equals_1.canEquals(expected) && Equals_1.canEquals(this._obj)) {
                var _actual = this._obj;
                this.assert(deepEqual_1.deepEqual(_actual, expected), 'expected #{act} to equal #{exp}', 'expected #{act} to not equal #{exp}', expected, _actual, true);
            } else {
                _super.apply(this, arguments);
            }
        };
    }
    ['eq', 'eql', 'eqls', 'equal', 'equals'].forEach(function (keyword) {
        Assertion.overwriteMethod(keyword, assertCollectionEqual);
    });
    /**
     * ### .include(value)
     *
     * The `include` and `contain`Assertions can be used as either property
     * based language chains or as methods to assert the inclusion of a value
     * in an immutable collection. When used as language chains, they toggle the
     * `contains` flag for the `keys` Assertion.
     *
     * ```js
     * expect(new List([1, 2, 3])).to.include(2)
     * expect(new List([1, 2, 3])).to.includes(2)
     * expect(new List([1, 2, 3])).to.contain(2)
     * expect(new List([1, 2, 3])).to.contains(2)
     * ```
     *
     * @name include
     * @alias contain
     * @alias includes
     * @alias contains
     * @param {Mixed} val
     * @api public
     */
    function assertCollectionInclude(_super) {
        return function (expected) {
            if (isIterable(this._obj)) {
                var actual = asIterable(this._obj);
                this.assert(function (v) {
                    return _.isEqual(v, expected);
                }, 'expected immutable #{act} to include #{exp}', 'expected immutable #{act} to not include #{exp}', expected, actual.toJS());
            } else {
                _super.apply(this, arguments);
            }
        };
    }
    function chainCollectionInclude(_super) {
        return function () {
            _super.apply(this, arguments);
        };
    }
    ['include', 'contain', 'contains', 'includes'].forEach(function (keyword) {
        Assertion.overwriteChainableMethod(keyword, assertCollectionInclude, chainCollectionInclude);
    });
    /**
     * ### .keys(key1[, key2, ...[, keyN]])
     *
     * Asserts that the keyed collection contains any or all of the passed-in
     * keys. Use in combination with `any`, `all`, `contains`, or `have` will
     * affect what will pass.
     *
     * When used in conjunction with `any`, at least one key that is passed in
     * must exist in the target object. This is regardless whether or not
     * the `have` or `contain` qualifiers are used. Note, either `any` or `all`
     * should be used in theAssertion. If neither are used, theAssertion is
     * defaulted to `all`.
     *
     * When both `all` and `contain` are used, the target object must have at
     * least all of the passed-in keys but may have more keys not listed.
     *
     * When both `all` and `have` are used, the target object must both contain
     * all of the passed-in keys AND the number of keys in the target object must
     * match the number of keys passed in (in other words, a target object must
     * have all and only all of the passed-in keys).
     *
     * `key` is an alias to `keys`.
     *
     * ```js
     * expect(new Map({ foo: 1 })).to.have.key('foo')
     * expect(new Map({ foo: 1, bar: 2 })).to.have.keys('foo', 'bar')
     * expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new List(['bar', 'foo']))
     * expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new Set(['bar', 'foo']))
     * expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new Stack(['bar', 'foo']))
     * expect(new Map({ foo: 1, bar: 2 })).to.have.keys(['bar', 'foo'])
     * expect(new Map({ foo: 1, bar: 2 })).to.have.keys({ 'bar': 6, 'foo': 7 })
     * expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new Map({ 'bar': 6, 'foo': 7 }))
     * expect(new Map({ foo: 1, bar: 2 })).to.have.any.keys('foo', 'not-foo')
     * expect(new Map({ foo: 1, bar: 2 })).to.have.all.keys('foo', 'bar')
     * expect(new Map({ foo: 1, bar: 2 })).to.contain.key('foo')
     * ```
     *
     * @name keys
     * @param {String...|Array|Object|Collection} keyN
     * @alias key
     * @api public
     */
    function assertKeyedCollectionKeys(_super) {
        return function (expected) {
            var _arguments = arguments;

            if (isKeyedIterable(this._obj)) {
                var actual = asKeyedIterable(this._obj);
                var actualKeys = immutable_1.List(actual.keys());
                var expectedKeys = function () {
                    switch (utils.type(expected)) {
                        case 'object':
                            if (!Immutable_1.isSet(expected) && !Immutable_1.isList(expected) && !Immutable_1.isStack(expected)) throw new TypeError("Invalid expected keys, must be either List, Set, Stack, array, " + ("or primitive datatype. But got " + expected));
                            return immutable_1.List(expected);
                        case 'array':
                            return immutable_1.List(expected);
                        default:
                            return immutable_1.List(Array.prototype.slice.call(_arguments));
                    }
                }();
                if (expectedKeys.isEmpty()) throw new Error("expected keys required, but got " + expected);
                var checkAny = utils.flag(this, 'any');
                var checkContains = utils.flag(this, 'contains');
                var checkNegate = utils.flag(this, 'negate');
                var strPredicate = checkContains ? 'contain' : 'have';
                var predicate = function predicate(value) {
                    return actualKeys.includes(value);
                };
                var result = function () {
                    if (checkAny || checkContains) {
                        return actualKeys.some(predicate, expectedKeys) && !checkNegate;
                    } else {
                        return actualKeys.every(predicate, expectedKeys) && actualKeys.size === expectedKeys.size && !checkNegate;
                    }
                }();
                this.assert(result, "expected immutable #{this} to " + strPredicate + " keys #{exp} but got #{act}", "expected immutable #{this} to not " + strPredicate + " keys #{exp} but got #{act}", expectedKeys, actualKeys);
            } else _super.apply(this, arguments);
        };
    }
    Assertion.overwriteMethod('keys', assertKeyedCollectionKeys);
    Assertion.overwriteMethod('key', assertKeyedCollectionKeys);
    var Comparator = {
        eq: {
            fn: function fn(act, exp) {
                return act == exp;
            },
            name: 'equals'
        },
        gte: {
            fn: function fn(act, exp) {
                return act >= exp;
            },
            name: 'greater than or equals to'
        },
        lte: {
            fn: function fn(act, exp) {
                return act <= exp;
            },
            name: 'less than or equals to'
        },
        gt: {
            fn: function fn(act, exp) {
                return act > exp;
            },
            name: 'greater than'
        },
        lt: {
            fn: function fn(act, exp) {
                return act < exp;
            },
            name: 'less than'
        }
    };
    function getCollectionSize(o) {
        return isIterable(o) ? asIterable(o).size : _.size(o);
    }
    function assertCollectionSize(that, expected, comparator) {
        var actual = getCollectionSize(that._obj);
        that.assert(comparator.fn(actual, expected), "expected immutable #{this} to have size " + comparator.name + " #{exp} but got #{act}", "expected immutable #{this} to not have size " + comparator.name + " #{exp}", expected, actual, true);
    }
    function assertCollectionSizeEq(_super) {
        return function (expected) {
            assertCollectionSize(this, expected, Comparator.eq);
        };
    }
    function assertCollectionSizeGte(_super) {
        return function (expected) {
            assertCollectionSize(this, expected, Comparator.gte);
        };
    }
    function assertCollectionSizeLte(_super) {
        return function (expected) {
            assertCollectionSize(this, expected, Comparator.lte);
        };
    }
    function assertCollectionSizeGt(_super) {
        return function (expected) {
            assertCollectionSize(this, expected, Comparator.gt);
        };
    }
    function assertCollectionSizeLt(_super) {
        return function (expected) {
            assertCollectionSize(this, expected, Comparator.lt);
        };
    }
    function assertCollectionSizeWithin(_super) {
        return function (min, max) {
            var size = getCollectionSize(this._obj);
            this.assert(min <= size && size <= max, 'expected immutable #{this} to have a size within #{exp} but got #{act}', 'expected immutable #{this} to not have a size within #{exp} but got #{act}', min + '..' + max, size);
        };
    }
    function chainCollectionSize() {
        utils.flag(this, 'immutable.collection.size', true);
    }
    Assertion.overwriteMethod('sizeOf', assertCollectionSizeEq);
    Assertion.overwriteMethod('lengthOf', assertCollectionSizeEq);
    Assertion.overwriteMethod('gte', assertCollectionSizeGte);
    Assertion.overwriteMethod('least', assertCollectionSizeGte);
    Assertion.overwriteMethod('lte', assertCollectionSizeLte);
    Assertion.overwriteMethod('most', assertCollectionSizeLte);
    Assertion.overwriteMethod('gt', assertCollectionSizeGt);
    Assertion.overwriteMethod('above', assertCollectionSizeGt);
    Assertion.overwriteMethod('greaterThan', assertCollectionSizeGt);
    Assertion.overwriteMethod('lt', assertCollectionSizeLt);
    Assertion.overwriteMethod('below', assertCollectionSizeLt);
    Assertion.overwriteMethod('lessThan', assertCollectionSizeLt);
    Assertion.overwriteMethod('within', assertCollectionSizeWithin);
    /**
     * ### .error(constructor)
     *
     * Asserts that the values of the target is equals to a specific error, or specific type
     * of error (as determined using `instanceof`), optionally with a RegExp or string inclusion
     * test for the error's message.
     *
     *     var err = new ReferenceError('This is a bad function.')
     *     expect(err).to.be.error(ReferenceError)
     *     expect(err).to.be.error(Error)
     *     expect(err).to.be.error(/bad function/)
     *     expect(err).to.not.be.error('good function')
     *     expect(err).to.be.error(ReferenceError, /bad function/)
     *     expect(err).to.be.error(err)
     *
     * @name error
     * @param {ErrorConstructor} constructor
     * @param {String|RegExp} expected error message
     * @param {String} message _optional_
     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
     * @returns error for chaining (null if no error)
     * @namespace BDD
     * @api public
     */
    function assertErrorEquals(expected, actual, errMsg, msg) {
        // CASE: Expected to be a desired error
        if (expected && expected instanceof Error) {
            var expError = expected;
            this.assert(_.eq(expError.name, actual.name) && _.eq(expError.message, actual.message), 'expected error to equal #{exp} but got #{act}', 'expected error to not equal #{exp} but got #{act}', expError, actual);
            return this;
        }
        // CASE: Expected to be of a desired error type
        if (typeof expected === 'function') {
            var name = expected.prototype.name;
            if (!name || name == 'Error' && expected !== Error) {
                name = expected.name || new expected().name;
            }
            this.assert(_.eq(name, actual.name), 'expected #{this} with type #{exp} but got #{act}', 'expected #{this} not with type #{exp} but got #{act}', name, actual.name);
            if (!errMsg) return this;
        }
        var expMsg = _.isFunction(expected) ? errMsg : expected;
        var actMsg = 'message' in actual ? actual.message : '' + actual;
        // CASE: Expected to have error message matches regex
        if (!_.isNil(actMsg) && !!expMsg && expMsg instanceof RegExp) {
            this.assert(expMsg.exec(actMsg), 'expected #{this} to have error message matching #{exp} but got #{act}', 'expected #{this} to have error message not matching #{exp}', expMsg, actMsg);
            return this;
        } else if (!_.isNil(actMsg) && !!expMsg && _.isString(expMsg)) {
            this.assert(~expMsg.indexOf(actMsg), 'expected #{this} to have error message including #{exp} but got #{act}', 'expected #{this} to have error message not including #{act}', expMsg, actMsg);
            return this;
        } else {
            throw new Error('Must specify expected message or regex.' + errMsg);
        }
    }
    function assertError(expected, errMsg, msg) {
        if (arguments.length === 0) {
            throw new Error('Must have expected error.');
        }
        if (!!msg) utils.flag(this, 'message', msg);
        var actual = utils.flag(this, 'object');
        new Assertion(actual, msg).is.a('error');
        return assertErrorEquals.bind(this)(expected, actual, errMsg, msg);
    }
    function assertErrorOnLeft(expected, errMsg, msg) {
        if (arguments.length === 0) {
            throw new Error('Must have expected error.');
        }
        if (!!msg) utils.flag(this, 'message', msg);
        var actual = utils.flag(this, 'object');
        new Assertion(Either_1.Either.isLeft(actual), "expected an Either.Left instance, but got " + this).to.be.true;
        return assertErrorEquals.bind(this)(expected, actual.left.get, errMsg, msg);
    }
    Assertion.addMethod('error', assertError);
    Assertion.addMethod('errorOnLeft', assertErrorOnLeft);
    /**
     * ## TDD API Reference
     */
    var assert = chai.assert;
    var originalEqual = assert.equal;
    var originalNotEqual = assert.notEqual;
    /**
     * ### .equal(actual, expected)
     *
     * Asserts that the values of `actual` are equivalent to the values of
     * `expected`. Note that `.strictEqual()` and `.deepEqual()` assert
     * exactly like `.equal()` in the context of Immutable data structures.
     *
     * ```js
     * var a = List.of(1, 2, 3)
     * var b = List.of(1, 2, 3)
     * assert.equal(a, b)
     * ```
     *
     * Immutable data structures should only contain other immutable data
     * structures (unlike `Array`s and `Object`s) to be considered immutable and
     * properly work against `.equal()`, `.strictEqual()` or `.deepEqual()`. See
     * [this issue](https://github.com/astorije/chai-immutable/issues/24) for
     * more information.
     *
     * @name equal
     * @param {Collection} actual
     * @param {Collection} expected
     * @api public
     */
    assert.equal = function (actual, expected) {
        if (isIterable(actual)) {
            return new Assertion(actual).equal(expected);
        } else return originalEqual(actual, expected);
    };
    /**
     * ### .notEqual(actual, expected)
     *
     * Asserts that the values of `actual` are not equivalent to the values of
     * `expected`. Note that `.notStrictEqual()` and `.notDeepEqual()` assert
     * exactly like `.notEqual()` in the context of Immutable data structures.
     *
     * ```js
     * var a = List.of(1, 2, 3)
     * var b = List.of(4, 5, 6)
     * assert.notEqual(a, b)
     * ```
     *
     * @name notEqual
     * @param {Collection} actual
     * @param {Collection} expected
     * @api public
     */
    assert.notEqual = function (actual, expected) {
        if (isIterable(actual)) {
            return new Assertion(actual).not.equal(expected);
        } else return originalNotEqual(actual, expected);
    };
    /**
     * ### .sizeOf(collection, length)
     *
     * Asserts that the immutable collection has the expected size.
     *
     * ```js
     * assert.sizeOf(List.of(1, 2, 3), 3)
     * assert.sizeOf(new List(), 0)
     * ```
     *
     * @name sizeOf
     * @param {Collection} collection
     * @param {Number} size
     * @api public
     */
    assert.sizeOf = function (collection, expected) {
        new Assertion(collection).size(expected);
    };
}
exports.ChaiModel = ChaiModel;
//# sourceMappingURL=ChaiModel.js.map
//# sourceMappingURL=ChaiModel.js.map