"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var immutable_1 = require("immutable");
var Equals_1 = require("../core/Equals");
var Record_1 = require("../core/Record");
var keys = Object.keys;
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a instanceof Record_1.Record && b instanceof Record_1.Record) {
        var keySet = immutable_1.Set(keys(a).concat(keys(b))).toList();
        return keySet.reduce(function (rs, key) {
            return rs && deepEqual(a[key], b[key]);
        }, true);
    }
    if (Equals_1.canEquals(a) && Equals_1.canEquals(b)) {
        return a.equals(b);
    }
    return lodash_1.isEqual(a, b);
}
exports.deepEqual = deepEqual;
//# sourceMappingURL=deepEqual.js.map
//# sourceMappingURL=deepEqual.js.map