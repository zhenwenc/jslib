"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var Errors_1 = require("./Errors");
function errorHandler(message) {
    throw new NcCheckerError(message || 'Precondition not satisfy.');
}
function consoleHandler(logger) {
    return function (message) {
        logger(message || 'Precondition not satisfy.');
    };
}
function format(cause, message) {
    if (lodash_1.isUndefined(message)) {
        return cause;
    }
    return message + ". Caused by " + cause + ".";
}

var NcCheckerError = function (_Errors_1$NcError) {
    _inherits(NcCheckerError, _Errors_1$NcError);

    function NcCheckerError(message) {
        _classCallCheck(this, NcCheckerError);

        return _possibleConstructorReturn(this, (NcCheckerError.__proto__ || Object.getPrototypeOf(NcCheckerError)).call(this, message));
    }

    return NcCheckerError;
}(Errors_1.NcError);

exports.NcCheckerError = NcCheckerError;

var Checker = function () {
    function Checker(obj) {
        var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : errorHandler;

        _classCallCheck(this, Checker);

        this.obj = obj;
        this.handler = handler;
    }

    _createClass(Checker, [{
        key: "it",
        value: function it(predicate, message) {
            var checked = void 0;
            try {
                checked = predicate(this.obj);
            } catch (err) {
                throw new NcCheckerError("Got error while checking [" + this.obj + "] with predicate [" + predicate + "]: " + err);
            }
            if (!!!checked) {
                this.handler(message);
            }
            return this;
        }
    }, {
        key: "not",
        value: function not(predicate, message) {
            return this.it(function (o) {
                return !predicate(o);
            }, message);
        }
    }, {
        key: "notNull",
        value: function notNull(message) {
            return this.not(lodash_1.isUndefined, format("Object is undefined", message)).not(lodash_1.isNull, message);
        }
    }, {
        key: "isBoolean",
        value: function isBoolean(message) {
            return this.it(lodash_1.isBoolean, format("[" + this.obj + "] is not a boolean", message));
        }
    }, {
        key: "isString",
        value: function isString(message) {
            return this.it(lodash_1.isString, format("[" + this.obj + "] is not a string", message));
        }
    }, {
        key: "isFunction",
        value: function isFunction(message) {
            return this.it(lodash_1.isFunction, format("[" + this.obj + "] is not a function", message));
        }
    }, {
        key: "isNumber",
        value: function isNumber(message) {
            return this.it(lodash_1.isNumber, format("[" + this.obj + "] is not a number", message));
        }
    }, {
        key: "isInteger",
        value: function isInteger(message) {
            return this.it(lodash_1.isInteger, format("[" + this.obj + "] is not an integer", message));
        }
    }, {
        key: "isPositive",
        value: function isPositive(message) {
            return this.it(lodash_1.isNumber, format("[" + this.obj + "] is not a number", message));
        }
    }]);

    return Checker;
}();

exports.Checker = Checker;
function check(b, message) {
    return create(b, errorHandler, message);
}
exports.check = check;
function checkWarn(b, message) {
    var logger = function logger(msg) {
        console.warn(msg);
    };
    return create(b, consoleHandler(logger), message);
}
exports.checkWarn = checkWarn;
function create(b, handler, message) {
    if (!lodash_1.isUndefined(message)) {
        if (!!!b) {
            handler(message);
        }
    } else {
        return new Checker(b, handler);
    }
}
//# sourceMappingURL=Preconditions.js.map
//# sourceMappingURL=Preconditions.js.map