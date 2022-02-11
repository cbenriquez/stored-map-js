/**
 * A class that provides the functions for StoredMap objects to convert values to and from the Javascript Object Notation format.
 */
export declare class StoredMapConverter {
    deserializer: {
        [deserializerName: string]: (args: any) => any;
    };
    serializer: {
        [serializerName: string]: (value: any) => any | undefined;
    };
    constructor();
    parse<V>(json: string): V;
    stringify(value: any): string;
    convertKeyToStoreKey(key: any): string;
    convertStoreKeyToKey(storeKey: string): any;
}
