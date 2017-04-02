"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function imul(a, b) {
    a = a | 0; // int
    b = b | 0; // int
    var c = a & 0xffff;
    var d = b & 0xffff;
    // Shift by 0 fixes the sign on the high part.
    return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0; // int
}
exports.imul = imul;
// v8 has an optimization for storing 31-bit signed numbers.
// Values which have either 00 or 11 as the high order bits qualify.
// This function drops the highest order bit in a signed number, maintaining
// the sign bit.
function smi(i32) {
    return i32 >>> 1 & 0x40000000 | i32 & 0xBFFFFFFF;
}
exports.smi = smi;
//# sourceMappingURL=Math.js.map
//# sourceMappingURL=Math.js.map