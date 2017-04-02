"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-variable */
var Maybe_1 = require("./Maybe");
var Record_1 = require("./Record");
var deepEqual_1 = require("../utils/deepEqual");
/* tslint:enable:no-unused-variable */
// -- Either Class ------------------------------------------------------------

var Either = function (_Record_1$Record) {
    _inherits(Either, _Record_1$Record);

    function Either(a, b) {
        _classCallCheck(this, Either);

        var _this = _possibleConstructorReturn(this, (Either.__proto__ || Object.getPrototypeOf(Either)).call(this));

        _this.a = a;
        _this.b = b;
        return _this;
    }

    _createClass(Either, [{
        key: "fold",

        /**
         * Applies `fa` if this is a `Left` or `fb` if this is a `Right`.
         *
         * @param  {Function} fa the function to apply if this is a `Left`
         * @param  {Function} fb the function to apply if this is a `Right`
         * @return {Any}         the results of applying the function
         */
        value: function fold(fa, fb) {
            return this.isLeft ? fa(this.a) : fb(this.b);
        }
    }, {
        key: "isLeft",
        get: function get() {
            return this.getIsLeft();
        }
    }, {
        key: "isRight",
        get: function get() {
            return this.getIsRight();
        }
    }, {
        key: "left",
        get: function get() {
            return new LeftProjection(this);
        }
    }, {
        key: "right",
        get: function get() {
            return new RightProjection(this);
        }
    }, {
        key: "swap",
        get: function get() {
            return this.isLeft ? Either.Right(this.a) : Either.Left(this.b);
        }
    }], [{
        key: "Left",
        value: function Left(value) {
            return new LeftWrapper(value);
        }
    }, {
        key: "Right",
        value: function Right(value) {
            return new RightWrapper(value);
        }
    }, {
        key: "isEither",
        value: function isEither(value) {
            return value instanceof Either;
        }
    }, {
        key: "isLeft",
        value: function isLeft(value) {
            return Either.isEither(value) && value.isLeft;
        }
    }, {
        key: "isRight",
        value: function isRight(value) {
            return Either.isEither(value) && value.isRight;
        }
    }]);

    return Either;
}(Record_1.Record);

exports.Either = Either;
// -- Left / Right Class ------------------------------------------------------

var LeftWrapper = function (_Either) {
    _inherits(LeftWrapper, _Either);

    function LeftWrapper(value) {
        _classCallCheck(this, LeftWrapper);

        return _possibleConstructorReturn(this, (LeftWrapper.__proto__ || Object.getPrototypeOf(LeftWrapper)).call(this, value, undefined));
    }

    _createClass(LeftWrapper, [{
        key: "getIsLeft",
        value: function getIsLeft() {
            return true;
        }
    }, {
        key: "getIsRight",
        value: function getIsRight() {
            return false;
        }
    }, {
        key: "equals",
        value: function equals(that) {
            return Either.isLeft(that) && deepEqual_1.deepEqual(this.left.get, that.left.get);
        }
    }, {
        key: "toString",
        value: function toString() {
            return "Left(" + this.a + ")";
        }
    }]);

    return LeftWrapper;
}(Either);

var RightWrapper = function (_Either2) {
    _inherits(RightWrapper, _Either2);

    function RightWrapper(value) {
        _classCallCheck(this, RightWrapper);

        return _possibleConstructorReturn(this, (RightWrapper.__proto__ || Object.getPrototypeOf(RightWrapper)).call(this, undefined, value));
    }

    _createClass(RightWrapper, [{
        key: "getIsLeft",
        value: function getIsLeft() {
            return false;
        }
    }, {
        key: "getIsRight",
        value: function getIsRight() {
            return true;
        }
    }, {
        key: "equals",
        value: function equals(that) {
            return Either.isRight(that) && deepEqual_1.deepEqual(this.right.get, that.right.get);
        }
    }, {
        key: "toString",
        value: function toString() {
            return "Right(" + this.b + ")";
        }
    }]);

    return RightWrapper;
}(Either);
// -- Left / Right Projection Class -------------------------------------------


var LeftProjection = function (_Record_1$Record2) {
    _inherits(LeftProjection, _Record_1$Record2);

    function LeftProjection(e) {
        _classCallCheck(this, LeftProjection);

        var _this4 = _possibleConstructorReturn(this, (LeftProjection.__proto__ || Object.getPrototypeOf(LeftProjection)).call(this));

        _this4.e = e;
        return _this4;
    }
    /**
     * Returns the value from this `Either` if this is of a `Left`, otherwise
     * throws an Error.
     *
     * @return {Any}
     */


    _createClass(LeftProjection, [{
        key: "getOrElse",

        /**
         * Returns the value from this `Either` if this is of a `Left`, or the given
         * argument if this is of a `Right`.
         *
         * @param  {Any} or The default value
         * @return {Any}
         */
        value: function getOrElse(or) {
            return this.e.isLeft ? this.get : or;
        }
        /**
         * Maps the function argument through `Left` if this is of a `Left`,
         * otherwise returns the original `Eihter`.
         *
         * @param  {Function} fn The function to map
         * @return {Either}
         */

    }, {
        key: "map",
        value: function map(fn) {
            return this.e.isLeft ? Either.Left(fn(this.get)) : Either.Right(this.e.right.get);
        }
        /**
         * Binds the given function across `Left` if this is of a `Left`, otherwise
         * returns the original `Either`. Slightly different from `map` is that `fn`
         * is expected to return an `Either`.
         *
         * @param  {Function} fn The function to bind accross the `Left`
         * @return {Either}
         */

    }, {
        key: "flatMap",
        value: function flatMap(fn) {
            return this.e.isLeft ? fn(this.get) : Either.Right(this.e.right.get);
        }
    }, {
        key: "equals",
        value: function equals(that) {
            return that instanceof LeftProjection && deepEqual_1.deepEqual(this.get, that.get);
        }
    }, {
        key: "toString",
        value: function toString() {
            return "LeftProjection(" + this.e + ")";
        }
    }, {
        key: "get",
        get: function get() {
            if (this.e.isLeft) {
                return this.e.a;
            }
            throw new Error("Want Either.left.value, but on Right");
        }
        /**
         * Returns a `Just` containing the `Either` value if this is of a `Left`
         * or a `Nothing` if this is of a `Right`.
         *
         * {{{
         * 	Left(12).left.toMaybe // Just(12)
         * 	Right(12).left.toMaybe // Nothing
         * }}}
         *
         * @return {Maybe}
         */

    }, {
        key: "toMaybe",
        get: function get() {
            return this.e.isLeft ? Maybe_1.Just(this.get) : Maybe_1.Nothing;
        }
    }]);

    return LeftProjection;
}(Record_1.Record);

exports.LeftProjection = LeftProjection;

var RightProjection = function (_Record_1$Record3) {
    _inherits(RightProjection, _Record_1$Record3);

    function RightProjection(e) {
        _classCallCheck(this, RightProjection);

        var _this5 = _possibleConstructorReturn(this, (RightProjection.__proto__ || Object.getPrototypeOf(RightProjection)).call(this));

        _this5.e = e;
        return _this5;
    }
    /**
     * Returns the value from this `Either` if this is of a `Right`, otherwise
     * throws an Error.
     *
     * @return {Any}
     */


    _createClass(RightProjection, [{
        key: "getOrElse",

        /**
         * Returns the value from this `Either` if this is of a `Right`, or the given
         * argument if this is of a `Left`.
         *
         * @param  {Any} or The default value
         * @return {Any}
         */
        value: function getOrElse(or) {
            return this.e.isRight ? this.get : or;
        }
        /**
         * Maps the function argument through `Right` if this is of a `Right`,
         * otherwise returns the original `Eihter`.
         *
         * @param  {Function} fn The function to map
         * @return {Either}
         */

    }, {
        key: "map",
        value: function map(fn) {
            return this.e.isRight ? Either.Right(fn(this.get)) : Either.Left(this.e.left.get);
        }
        /**
         * Binds the given function across `Right` if this is of a `Right`, otherwise
         * returns the original `Either`. Slightly different from `map` is that `fn`
         * is expected to return an `Either`.
         *
         * @param  {Function} fn The function to bind accross the `Right`
         * @return {Either}
         */

    }, {
        key: "flatMap",
        value: function flatMap(fn) {
            return this.e.isRight ? fn(this.get) : Either.Left(this.e.left.get);
        }
    }, {
        key: "equals",
        value: function equals(that) {
            return that instanceof RightProjection && deepEqual_1.deepEqual(this.get, that.get);
        }
    }, {
        key: "toString",
        value: function toString() {
            return "RightProjection(" + this.e + ")";
        }
    }, {
        key: "get",
        get: function get() {
            if (this.e.isRight) {
                return this.e.b;
            }
            throw new Error("Want Either.right.value, but on Left");
        }
        /**
         * Returns a `Just` containing the `Either` value if this is of a `Right`
         * or a `Nothing` if this is a `Left`.
         *
         * {{{
         * 	Right(21).right.toMaybe // Just(21)
         * 	Left(21).right.toMaybe // Nothing
         * }}}
         *
         * @return {Maybe}
         */

    }, {
        key: "toMaybe",
        get: function get() {
            return this.e.isRight ? Maybe_1.Just(this.get) : Maybe_1.Nothing;
        }
    }]);

    return RightProjection;
}(Record_1.Record);

exports.RightProjection = RightProjection;
// -- Aliases -----------------------------------------------------------------
/* tslint:disable variable-name */
exports.Left = Either.Left;
exports.Right = Either.Right;
//# sourceMappingURL=Either.js.map
//# sourceMappingURL=Either.js.map