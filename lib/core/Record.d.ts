import { Equals } from './Equals';
export declare const IS_RECORD_SENTINEL = "@@__JSLIB_RECORD__@@";
export declare abstract class Record implements Equals {
    readonly '@@__JSLIB_RECORD__@@': boolean;
    /**
     * True if this and the other Record have value equality.
     */
    equals(that: any): boolean;
}
