/**
 * An interface containing operations for equality. All core classes
 * in this packages impliments this interface.
 */
export declare function canEquals(that: any): boolean;
export interface Equals {
    /**
     * The universal equality method, should consider deep equals.
     */
    equals(that: any): boolean;
}
