import { StoredMapConverter } from "./stored-map-converter.js";
export interface StoredMapOptions {
    /** Indicate the maximum amount of RAM in bytes that the object can use at one time. */
    memoryLimit?: number;
    /** Contain the conversion functions. */
    converter?: StoredMapConverter;
}
/** An asynchronously iterable map object that holds key-value pairs stored as JSON files on the disk. */
export declare class StoredMap {
    /** Indicate the working directory.*/
    path: string;
    /** Contain the conversion functions. */
    converter: StoredMapConverter;
    /** Indicate the maximum amount of RAM in bytes that the cache storage can use at a time. */
    memoryLimit: number;
    /** Indicate the amount of RAM in bytes occupying the cache storage. */
    memoryUsage: number;
    /** Contain cached items. */
    cacheStorage: {
        [filename: string]: [any, number];
    };
    /** Indicate the filename of the UUID dictionary. */
    uuidDictionary: string;
    /** Return an iterator for key-value pairs. */
    [Symbol.asyncIterator]: () => AsyncGenerator<[any, any]>;
    /** Construct `StoredMap` object.
     * @param path Indicate the working directory.
     * @param options Contain the options.
    */
    constructor(path: string, options?: StoredMapOptions);
    /** Get the value of the key. If failed, return `undefined`. */
    get<V>(key: any): Promise<V | undefined>;
    /** Assign a value to a key. If failed, throw `Error`. */
    set(key: any, value: any): Promise<void>;
    /** Delete a key-value pair. Return `true` if successful, otherwise return `false`. */
    delete(key: any): Promise<boolean>;
    /** Return how many key-value pairs exist. */
    size(): Promise<number>;
    /** Return an iterator for every key. */
    keys(): AsyncGenerator<any, void, unknown>;
    /** Return `true` if the key exists, otherwise return `false`. */
    has(key: any): Promise<boolean>;
    /** Delete every key-value pair. */
    clear(): Promise<void>;
    /** Return an iterator for every value. */
    values(): AsyncGenerator<any>;
    /** Return an iterator for every key-value pair. */
    entries(): AsyncGenerator<[any, any]>;
    /** Return a promise to retrieve statistics for a file in the path. */
    private getFileStatistics;
    /** Delete an item from the cache storage. */
    private deleteCache;
    /** Insert an item into cache storage. Return `true` if successful, otherwise return `false`. */
    private cache;
    /** Return an array of files and folders in the path. */
    private getFiles;
    /** Return an iterator for every key value files */
    private keyValueFiles;
}
