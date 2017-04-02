/**
 * Inheritable Error wrapper.
 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });

var NcError = function (_Error) {
    _inherits(NcError, _Error);

    function NcError(message) {
        _classCallCheck(this, NcError);

        var _this = _possibleConstructorReturn(this, (NcError.__proto__ || Object.getPrototypeOf(NcError)).call(this));

        _this.message = message;
        return _this;
    }

    return NcError;
}(Error);

exports.NcError = NcError;

var NcSevere = function (_NcError) {
    _inherits(NcSevere, _NcError);

    function NcSevere(message) {
        _classCallCheck(this, NcSevere);

        return _possibleConstructorReturn(this, (NcSevere.__proto__ || Object.getPrototypeOf(NcSevere)).call(this, message));
    }

    return NcSevere;
}(NcError);

exports.NcSevere = NcSevere;
//# sourceMappingURL=Errors.js.map
//# sourceMappingURL=Errors.js.map