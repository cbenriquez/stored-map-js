import { getObjectSize } from "./object-size.js";
export class StoredMapCacher {
    constructor(memoryLimit) {
        this.cacheStorage = [];
        this.memoryUsage = 0;
        this.memoryLimit = memoryLimit;
    }
    find(storeKey) {
        let cacheStorageLength = this.cacheStorage.length;
        for (let index = 0; index < cacheStorageLength; index++) {
            if (this.cacheStorage[index][0] == storeKey)
                return index;
        }
    }
    free(memorySize) {
        let sumTotalMemoryUsage = this.memoryUsage + memorySize;
        while (sumTotalMemoryUsage > this.memoryLimit) {
            let removedTriple = this.cacheStorage.shift();
            if (!removedTriple)
                break;
            let removedTripleSize = getObjectSize(removedTriple);
            this.memoryUsage -= removedTripleSize;
        }
    }
    push(storeKey, value, lastModified) {
        let triple = [storeKey, value, lastModified];
        let tripleSize = getObjectSize(triple);
        this.free(tripleSize);
        this.cacheStorage.push(triple);
        this.memoryUsage += tripleSize;
    }
    delete(index) {
        this.cacheStorage.splice(index, 1);
        this.memoryUsage -= getObjectSize(this.cacheStorage[index]);
    }
}
