/**
 * A class that provides the functions for StoredMap objects to convert values to and from the Javascript Object Notation format.
 */
export declare class StoredMapConverter {
    parsers: Map<string, (args: any[]) => any>;
    stringifiers: Map<string, (value: any) => string[] | false>;
    constructor();
    parse<V>(json: string): V;
    stringify(value: any): string;
    convertKeyToStoreKey(key: any): string;
    convertStoreKeyToKey(storeKey: string): any;
}
