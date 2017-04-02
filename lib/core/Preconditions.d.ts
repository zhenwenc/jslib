import { NcError } from './Errors';
export declare type Predicate<T> = (obj: T) => boolean;
export declare type CheckerHandler = (message?: string) => void;
export declare class NcCheckerError extends NcError {
    constructor(message: string);
}
export declare class Checker<T> {
    private obj;
    private handler;
    constructor(obj: T, handler?: CheckerHandler);
    it(predicate: Predicate<T>, message?: string): Checker<T>;
    not(predicate: Predicate<T>, message?: string): Checker<T>;
    notNull(message?: string): Checker<T>;
    isBoolean(message?: string): Checker<T>;
    isString(message?: string): Checker<T>;
    isFunction(message?: string): Checker<T>;
    isNumber(message?: string): Checker<T>;
    isInteger(message?: string): Checker<T>;
    isPositive(message?: string): Checker<T>;
}
export declare function check<T>(b: T, message?: string): Checker<T>;
export declare function checkWarn<T>(b: T, message?: string): Checker<T>;
