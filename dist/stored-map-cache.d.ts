export declare class StoredMapCacher {
    memoryLimit: number;
    cacheStorage: [string, any, number][];
    memoryUsage: number;
    constructor(memoryLimit: number);
    find(storeKey: string): number | undefined;
    free(memorySize: number): void;
    push(storeKey: string, value: any, lastModified: number): void;
    delete(index: number): void;
}
