import { StoredMapCacher } from "./stored-map-cache.js";
import { StoredMapConverter } from "./stored-map-converter.js";
/**
 * An asynchronously iterable map object that stores key-value pairs on the disk.
 */
export declare class StoredMap {
    /**
     * The working directory of the object.
     */
    path: string;
    /**
     * The object containing the conversion functions of the object.
     */
    converter: StoredMapConverter;
    /**
     * The object containing the caching functions of the object.
     */
    cacher: StoredMapCacher;
    /**
     * An asynchronously iterable map object that stores key-value pairs on the disk.
     * @param path The working directory of the object.
     * @param memoryLimit The amount of memory in bytes budgeted to the object for caching.
     * @param converter The object containing the conversion functions of the object.
     */
    constructor(path: string, memoryLimit?: number, converter?: StoredMapConverter);
    /**
     * Joins the working directory of the object and the JSON file.
     */
    getFilePath(storeKey: string): string;
    /**
     * Retrieves the value of the store key in the object.
     */
    getValueFromStoreKey<V>(storeKey: string): Promise<V | undefined>;
    /**
     * Retrieves the value of the key in the object.
     * If failed, returns undefined.
     */
    get<V>(key: any): Promise<V | undefined>;
    /**
     * Assigns a value to a key in the object.
     * If failed, throws an Error.
     */
    set(key: any, value: any): Promise<void>;
    /**
     * Deletes the key-value pair associated with the given key from the object.
     * If successful, returns true, false if otherwise.
     */
    delete(key: any): Promise<boolean>;
    /**
     * Returns every entity in the current working directory.
     */
    entities(): Promise<string[]>;
    /**
     * An asynchronous generator for iterating through every store keys in the object.
     */
    storeKeys(): AsyncGenerator<string, void, unknown>;
    /**
     * Counts the amount of keys in the object.
     */
    size(): Promise<number>;
    /**
     * An asynchronous generator for iterating through every keys in the object.
     */
    keys(): AsyncGenerator<any, void, unknown>;
    /**
     * Checks whether or not the key exists in the object.
     */
    has(key: any): Promise<boolean>;
    /**
     * Deletes every key-value pair in the object.
     */
    clear(): Promise<void>;
    /**
     * An asynchronous generator for iterating through every value in the object.
     */
    values(): AsyncGenerator<any>;
    /**
     * An asynchronous generator for iterating through every key-value pair in the object.
     */
    entries(): AsyncGenerator<[any, any]>;
    [Symbol.asyncIterator]: () => AsyncGenerator<[any, any]>;
    /**
     * Dumps as many small files as possible into the cache.
     */
    initializeCache(): Promise<void>;
}
