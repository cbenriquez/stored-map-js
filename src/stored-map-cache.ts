import { getObjectSize } from "./object-size.js"

export class StoredMapCacher {

    public memoryLimit: number

    public cacheStorage: [string, any, number][] = []

    public memoryUsage = 0

    constructor(memoryLimit: number) {
        this.memoryLimit = memoryLimit
    }

    public find(storeKey: string) {
        let cacheStorageLength = this.cacheStorage.length
        for (let index = 0; index < cacheStorageLength; index++) {
            if (this.cacheStorage[index][0] == storeKey) return index
        }

    }

    public free(memorySize: number) {
        let sumTotalMemoryUsage = this.memoryUsage + memorySize
        while (sumTotalMemoryUsage > this.memoryLimit) {
            let removedTriple = this.cacheStorage.shift()
            if (!removedTriple) break
            let removedTripleSize = getObjectSize(removedTriple)
            this.memoryUsage -= removedTripleSize
        }
    }

    public push(storeKey: string, value: any, lastModified: number) {
        let triple: [string, any, number] = [storeKey, value, lastModified]
        let tripleSize = getObjectSize(triple)
        this.free(tripleSize)
        this.cacheStorage.push(triple)
        this.memoryUsage += tripleSize

    }

    public delete(index: number) {
        this.cacheStorage.splice(index, 1)
        this.memoryUsage -= getObjectSize(this.cacheStorage[index])
    }

}