"use strict";
function lazy(fn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function () { return fn.apply(fn, args); };
}
exports.lazy = lazy;
