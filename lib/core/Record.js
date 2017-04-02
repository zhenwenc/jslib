/**
 * Note: This class is experimental at the moment.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var deepEqual_1 = require("../utils/deepEqual");
exports.IS_RECORD_SENTINEL = '@@__JSLIB_RECORD__@@';

var Record = function () {
  function Record() {
    _classCallCheck(this, Record);
  }

  _createClass(Record, [{
    key: "equals",

    /**
     * True if this and the other Record have value equality.
     */
    value: function equals(that) {
      return deepEqual_1.deepEqual(this, that);
    }
  }, {
    key: '@@__JSLIB_RECORD__@@',

    // IS_RECORD_SENTINEL
    get: function get() {
      return true;
    }
  }]);

  return Record;
}();

exports.Record = Record;
//# sourceMappingURL=Record.js.map
//# sourceMappingURL=Record.js.map