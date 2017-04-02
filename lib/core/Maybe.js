"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("./Either");
var Record_1 = require("./Record");
var deepEqual_1 = require("../utils/deepEqual");
// -- Maybe Class -------------------------------------------------------------

var Maybe = function (_Record_1$Record) {
    _inherits(Maybe, _Record_1$Record);

    function Maybe(value) {
        _classCallCheck(this, Maybe);

        var _this = _possibleConstructorReturn(this, (Maybe.__proto__ || Object.getPrototypeOf(Maybe)).call(this));

        _this.value = value;
        return _this;
    }
    /**
     * Constructs a new `Maybe` instance.
     *
     * If the value is either `null` or `undefined`, the function returns a
     * `Nothing`, otherwise the value is wrapped in a `Just(val)`
     *
     * @param  {Any}          value the value to wrap
     * @return {Just|Nothing}       Returns `Nothing` if `value` is null or
     *                              undefined, else `Just`
     */


    _createClass(Maybe, [{
        key: "toString",
        value: function toString() {
            return "Maybe(" + this.value + ")";
        }
        // -- Functions -------------------------------------------------------------
        /**
         * Returns the maybe's value if the maybe is a `Just`, otherwise return the
         * default value `or`.
         *
         * @param  {Any} or the default expression
         * @return {Any}
         */

    }, {
        key: "getOrElse",
        value: function getOrElse(or) {
            return this.isNothing ? or : this.get;
        }
        /**
         * Returns the maybe's value if the maybe is a `Just`, otherwise throw the
         * given `err` which can be either custom error or any object.
         *
         * @param  {Error} err Rubbish to throw :)
         * @return {Any}
         */

    }, {
        key: "getOrThrow",
        value: function getOrThrow(err) {
            if (this.isJust) {
                return this.get;
            }
            throw err;
        }
        /**
         * Returns this `Maybe` if it is a `Just`, otherwise return the result of
         * evaluating `alt`.
         *
         * @param  {Function} alt the alternative expression
         * @return {Maybe}
         */

    }, {
        key: "orElse",
        value: function orElse(alt) {
            return this.isNothing ? alt.apply(undefined) : this;
        }
        /**
         * Returns a `Just` containing the result of applying `fn` to this `Maybe` value
         * if this `Maybe` is a `Just`. Otherwise return `Nothing`.
         *
         * @param  {Function} fn the function to apply
         * @return {Maybe}
         */

    }, {
        key: "map",
        value: function map(fn) {
            return this.isJust ? Just(fn(this.get)) : new NothingWrapper();
        }
        /**
         * Returns the result of applying `fn` to the value of this `Maybe` if this is
         * a `Just`. Returns `Nothing` if this is a `Nothing`.
         *
         * Slightly different from `map` is that `fn` is expected to return a `Maybe`
         * (which could be `Nothing`).
         *
         * @param  {Function} fn the function to apply
         * @return {Maybe}
         */

    }, {
        key: "flatMap",
        value: function flatMap(fn) {
            return this.isJust ? fn(this.get) : new NothingWrapper();
        }
        /**
         * Return the result of applying `f` to the value of this `Maybe` if this is
         * a `Just`. Otherwise, evaluates expression `ifEmpty`.
         *
         * @param  {Function} ifEmpty the expression to evaluete if this is a `Nothing`
         * @param  {Function} f       the function to apply if this is a `Just`
         * @return {Any}
         */

    }, {
        key: "fold",
        value: function fold(ifEmpty, f) {
            return this.isJust ? f(this.get) : ifEmpty();
        }
        /**
         * Transforms the value of this `Maybe` using an unary function to monads.
         *
         * - if this is a `Just`, then return a function that applying the given
         * 	 function with the value of this `Maybe`
         *
         * - if this is a `Nothing`, then return an identity function of this Maybe
         *
         * @return {Function}
         */

    }, {
        key: "chain",
        value: function chain(fn) {
            var _this2 = this;

            return this.isJust ? function () {
                return fn(_this2.get);
            } : function () {
                return new NothingWrapper();
            };
        }
        /**
         * Return a `Right` containing this maybe's value if this is a `Just`, or
         * a `Left` containing the given `left` if this is a `Nothing`.
         *
         * @param  {Any}     left the value to return if this is a Nothing
         * @param  {Boolean} ev   evaluate if `left` is a function
         * @return {Maybe}
         */

    }, {
        key: "toRight",
        value: function toRight(left) {
            return this.isJust ? Either_1.Right(this.get) : Either_1.Left(left);
        }
        /**
         * Return a `Left` containing this maybe's value if this is a `Nothing`,
         * or a `Right` containing the given `right` if this is a `Just`.
         *
         * @param  {Any}     right the value to return if this is a `Nothing`
         * @param  {Boolean} ev    evaluate if `right` is a function
         * @return {Maybe}
         */

    }, {
        key: "toLeft",
        value: function toLeft(right) {
            return this.isJust ? Either_1.Left(this.get) : Either_1.Right(right);
        }
    }, {
        key: "isJust",

        /**
         * Return `true` if this is a `Just` instance.
         *
         * @return {Boolean} Returns `true` if this is a `Just` instance
         */
        get: function get() {
            return Maybe.isJust(this);
        }
        /**
         * Return `true` if this is a `Nothing` instance.
         *
         * @return {Boolean} Returns `true` if this is a `Nothing` instance
         */

    }, {
        key: "isNothing",
        get: function get() {
            return Maybe.isNothing(this);
        }
        /**
         * Return `true` if this is not a `Just` instance, or the contained
         * value is null or undefined. Otherwise, return `false`.
         *
         * @return {Boolean}
         */

    }, {
        key: "isEmpty",
        get: function get() {
            return Maybe.isEmpty(this);
        }
        /**
         * Return `true` if this is a `Just` instance. Otherwise, return `false`.
         *
         * @return {Boolean}
         */

    }, {
        key: "isDefined",
        get: function get() {
            return Maybe.isDefined(this);
        }
        /**
         * Returns the maybe's value.
         *
         * @return {Any}
         */

    }, {
        key: "get",
        get: function get() {
            if (this.isNothing) {
                throw Error("Can't get value from Nothing.");
            }
            return this.value;
        }
    }], [{
        key: "of",
        value: function of(value) {
            return value === null || value === undefined ? exports.Nothing : Just(value);
        }
        /**
         * Constructs a new `Maybe` instance with the evaluated value of the given
         * function.
         *
         * @param  {Function} fn the function to be evaluated
         * @return {Maybe}
         */

    }, {
        key: "eval",
        value: function _eval(fn) {
            return Maybe.of(fn.apply(undefined));
        }
        /**
         * Check if `value` is subtype of `Maybe`, either `Just` or `Nothing`.
         *
         * @param  {Any}     value the value to check.
         * @return {Boolean}       Returns `true` if `value` is subtype of `Maybe`
         */

    }, {
        key: "isMaybe",
        value: function isMaybe(value) {
            return value instanceof Maybe;
        }
        /**
         * Check if `value` is `Just`.
         *
         * @param  {Any}     value The value to check.
         * @return {Boolean}
         */

    }, {
        key: "isJust",
        value: function isJust(value) {
            return value instanceof JustWrapper;
        }
        /**
         * Check if `value` is `Just`.
         *
         * Alias to Maybe#isJust
         */

    }, {
        key: "isDefined",
        value: function isDefined(value) {
            return Maybe.isJust(value);
        }
        /**
         * Check if `value` is `Nothing`.
         *
         * @param  {Any}     value The value to check.
         * @return {Boolean}
         */

    }, {
        key: "isNothing",
        value: function isNothing(value) {
            return value instanceof NothingWrapper;
        }
        /**
         * Check if `value` is `Just`, and the contained value is defined.
         *
         * @param  {Maybe}   value The value to check.
         * @return {Boolean}
         */

    }, {
        key: "isEmpty",
        value: function isEmpty(value) {
            return Maybe.isNothing(value) || value.get === null || value.get === undefined;
        }
        /**
         * Do notation for working with ES6 generator.
         *
         * Note: the given generator must yield a Maybe at every iteration.
         *
         * @param  {Generator} gen a generator
         * @return {Maybe}
         */

    }, {
        key: "run",
        value: function run(gen) {
            function next(value) {
                var result = gen.next(value);
                if (result.done) {
                    return result.value || Maybe.of(value);
                }
                return result.value.flatMap(next);
            }
            return next(null);
        }
        /**
         * Apply given function to values wrapped in `Maybe`, and wrap the result in another
         * `Maybe`. If any of the argument is a `Nothing`, return `Nothing`.
         *
         * @param {Function} function to apply
         * @param {Maybe} a
         * @param {Maybe} b
         * @return {Maybe}
         */

    }, {
        key: "lift2",
        value: function lift2(f, a, b) {
            if (a.isJust && b.isJust) {
                return Just(f(a.get, b.get));
            } else {
                return exports.Nothing;
            }
        }
        /**
         * Apply given function to values wrapped in `Maybe`, and wrap the result in another
         * `Maybe`. If any of the argument is a `Nothing`, return `Nothing`.
         *
         * @param {Function} function to apply
         * @param {Maybe} a
         * @param {Maybe} b
         * @param {Maybe} c
         * @return {Maybe}
         */

    }, {
        key: "lift3",
        value: function lift3(f, a, b, c) {
            if (a.isJust && b.isJust && c.isJust) {
                return Just(f(a.get, b.get, c.get));
            } else {
                return exports.Nothing;
            }
        }
    }]);

    return Maybe;
}(Record_1.Record);

exports.Maybe = Maybe;
// -- Just Class --------------------------------------------------------------

var JustWrapper = function (_Maybe) {
    _inherits(JustWrapper, _Maybe);

    function JustWrapper(value) {
        _classCallCheck(this, JustWrapper);

        return _possibleConstructorReturn(this, (JustWrapper.__proto__ || Object.getPrototypeOf(JustWrapper)).call(this, value));
    }

    _createClass(JustWrapper, [{
        key: "toString",
        value: function toString() {
            return "Just(" + this.value + ")";
        }
    }, {
        key: "equals",
        value: function equals(that) {
            return Maybe.isJust(that) && deepEqual_1.deepEqual(that.value, this.value);
        }
    }]);

    return JustWrapper;
}(Maybe);

exports.JustWrapper = JustWrapper;
// -- Nothing Class ----------------------------------------------------------

var NothingWrapper = function (_Maybe2) {
    _inherits(NothingWrapper, _Maybe2);

    function NothingWrapper() {
        _classCallCheck(this, NothingWrapper);

        return _possibleConstructorReturn(this, (NothingWrapper.__proto__ || Object.getPrototypeOf(NothingWrapper)).call(this, undefined));
    }

    _createClass(NothingWrapper, [{
        key: "toString",
        value: function toString() {
            return 'Nothing';
        }
    }, {
        key: "equals",
        value: function equals(that) {
            return Maybe.isNothing(that);
        }
    }]);

    return NothingWrapper;
}(Maybe);

exports.NothingWrapper = NothingWrapper;
// -- Aliases -----------------------------------------------------------------
/**
 * Returns a `Just` instance with the given value.
 *
 * @param  {Any}  value The value to wrap.
 * @return {Just}       Returns a `Just`
 */
function Just(value) {
    return new JustWrapper(value);
}
exports.Just = Just;
/**
 * Returns the singleton `Nothing` instance.
 *
 * @return {Nothing} Returns the singleton `Nothing`.
 */
exports.Nothing = new NothingWrapper();
//# sourceMappingURL=Maybe.js.map
//# sourceMappingURL=Maybe.js.map