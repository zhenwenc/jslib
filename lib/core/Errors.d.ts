/**
 * Inheritable Error wrapper.
 */
export declare class NcError extends Error {
    constructor(message: string);
}
export declare class NcSevere extends NcError {
    constructor(message: string);
}
