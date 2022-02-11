export interface Serializer {
    serialize: (value: any) => any | undefined;
    deserialize: (args: any) => any;
}
/**
 * A class that provides the functions for StoredMap objects to convert values to and from the Javascript Object Notation format.
 */
export declare class StoredMapConverter {
    serializers: {
        [serializerName: string]: Serializer;
    };
    constructor();
    parse<V>(json: string): V;
    stringify(value: any): string;
    convertKeyToStoreKey(key: any): string;
    convertStoreKeyToKey(storeKey: string): any;
}
