// https://typescript.codeplex.com/discussions/401501
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
function isImmutable(thing) {
    return Boolean(isList(thing) || isMap(thing) || isSet(thing) || isOrderedSet(thing) || isOrderedMap(thing));
}
exports.isImmutable = isImmutable;
function isList(thing) {
    return Boolean(thing instanceof immutable_1.Iterable && thing['@@__IMMUTABLE_LIST__@@']);
}
exports.isList = isList;
function isMap(thing) {
    return Boolean(thing instanceof immutable_1.Iterable && thing['@@__IMMUTABLE_MAP__@@']);
}
exports.isMap = isMap;
function isSet(thing) {
    return Boolean(thing instanceof immutable_1.Iterable && thing['@@__IMMUTABLE_SET__@@']);
}
exports.isSet = isSet;
function isStack(thing) {
    return Boolean(thing instanceof immutable_1.Iterable && thing['@@__IMMUTABLE_STACK__@@']);
}
exports.isStack = isStack;
function isKeyed(thing) {
    return Boolean(thing instanceof immutable_1.Iterable && thing['@@__IMMUTABLE_KEYED__@@']);
}
exports.isKeyed = isKeyed;
function isIndexed(thing) {
    return Boolean(thing instanceof immutable_1.Iterable && thing['@@__IMMUTABLE_INDEXED__@@']);
}
exports.isIndexed = isIndexed;
function isOrdered(thing) {
    return Boolean(thing instanceof immutable_1.Iterable && thing['@@__IMMUTABLE_ORDERED__@@']);
}
exports.isOrdered = isOrdered;
function isOrderedSet(thing) {
    return Boolean(isOrdered(thing) && thing.hasOwnProperty('__hash'));
}
exports.isOrderedSet = isOrderedSet;
function isOrderedMap(thing) {
    return Boolean(isOrdered(thing) && !thing.hasOwnProperty('__hash'));
}
exports.isOrderedMap = isOrderedMap;
//# sourceMappingURL=Immutable.js.map
//# sourceMappingURL=Immutable.js.map