import { getObjectSize } from "./object-size.js";
export class StoredMapCacher {
    constructor(memoryLimit) {
        this.cacheStorage = [];
        this.memoryUsage = 0;
        this.memoryLimit = memoryLimit;
    }
    find(storeKey) {
        // MEM: Save the length of the cache storage.
        let cacheStorageLength = this.cacheStorage.length;
        // Iterate through the every index of the cache storage and search for the triple with the store key.
        for (let index = 0; index < cacheStorageLength; index++) {
            if (this.cacheStorage[index][0] == storeKey)
                return index;
        }
    }
    free(memorySize) {
        // Get the sum of the memory usage and the memory size.
        let sumTotalMemoryUsage = this.memoryUsage + memorySize;
        // Handle it while the sum exceeds the memory limit.
        while (sumTotalMemoryUsage > this.memoryLimit) {
            // Remove a triple from the cache storage.
            let removedTriple = this.cacheStorage.shift();
            // If the cache storage is empty, break the loop.
            if (!removedTriple)
                break;
            // Get the size of the removed triple.
            let removedTripleSize = getObjectSize(removedTriple);
            // Deduct the size from the memory usage.
            this.memoryUsage -= removedTripleSize;
        }
    }
    push(storeKey, value, lastModified) {
        // Put the store key, value, and last modified time in a triple.
        let triple = [storeKey, value, lastModified];
        // Get the size of the triple.
        let tripleSize = getObjectSize(triple);
        // Free memory for the triple.
        this.free(tripleSize);
        // Push them into the cache storage.
        this.cacheStorage.push(triple);
        // Count them to the memory usage.
        this.memoryUsage += tripleSize;
    }
    delete(index) {
        // Delete the cache triple associated with the index and deduct it from the memory usage.
        this.cacheStorage.splice(index, 1);
        this.memoryUsage -= getObjectSize(this.cacheStorage[index]);
    }
}
