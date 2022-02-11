import { randomUUID } from "crypto"
import { mkdir, readdir, readFile, stat, unlink, writeFile } from "fs"
import { join } from "path"
import validate from "uuid-validate"
import { StoredMapCacher } from "./stored-map-cache.js"
import { StoredMapConverter } from "./stored-map-converter.js"

/**
 * An asynchronously iterable map object that stores key-value pairs on the disk.
 */
export class StoredMap {
    /**
     * The working directory of the object.
     */
    public path: string

    /**
     * The object containing the conversion functions of the object.
     */
    public converter: StoredMapConverter

    /**
     * The object containing the caching functions of the object.
     */
    public cacher: StoredMapCacher

    /**
     * An asynchronously iterable map object that stores key-value pairs on the disk.
     * @param path The working directory of the object.
     * @param memoryLimit The amount of memory in bytes budgeted to the object for caching.
     * @param converter The object containing the conversion functions of the object.
     */
    public constructor(
        path: string,
        memoryLimit = 100000000,
        converter: StoredMapConverter = new StoredMapConverter()
        ) {
        // Initialize the objects.
        this.path = path
        this.cacher = new StoredMapCacher(memoryLimit)
        this.converter = converter
        
    }

    /**
     * Joins the working directory of the object and the JSON file.
     */
    public getFilePath(storeKey: string) {
        // Return path and the store key with the JSON extension.
        return join(this.path, storeKey + '.json')

    }

    /**
     * Retrieves the value of the store key in the object.
     */
    public async getValueFromStoreKey<V>(storeKey: string): Promise<V | undefined> {
        // Get the file path from the store key.
        let filePath = this.getFilePath(storeKey)

        // Try to get the last modified time of the file.
        let fileLastModified = await new Promise<number | undefined>((resolve) => {
            stat(filePath, (err, stats) => {
                if (err != undefined) resolve(undefined)
                else resolve (stats.mtimeMs)
            })
        })
        

        // Try to get the index of the store key in the cache.
        let cacheIndex = this.cacher.find(storeKey)

        // Name the return value.
        let value

        // Handle if the index exists.
        if (cacheIndex != undefined) {
            // Get the cache triple from the index.
            let cacheTriple = this.cacher.cacheStorage[cacheIndex]

            // Name the cache's last modified time.
            let cacheLastModified = cacheTriple[2]

            // Handle if the last modified time of the file matches the last modified time in the cache.
            if (fileLastModified == cacheLastModified) {
                // Name the cache value of the triple.
                let cacheValue = cacheTriple[1]

                // If the cache value is an object, copy it to the return value. Otherwise, assign it.
                if (typeof cacheValue == 'object') {
                    value = Object.assign({}, [cacheValue])[0]
                } else {
                    value = cacheValue
                }
                
            }

        }

        // Handle if the value is undefined and the last modified time of the file was accessible.
        if (value == undefined && fileLastModified != undefined) {
            // Await a promise to retrieve the value from the file.
            value = await new Promise<V | undefined>((resolve) => {
                // Read the file in UTF-8 encoded string.
                readFile(filePath, 'utf-8', (err, data) => {
                    // Return undefined on read error, or try to parse the data and return. On error, return undefined.
                    if (err) return resolve(undefined)
                    try {
                        resolve(this.converter.parse(data))
                    } catch(e) {
                        resolve(undefined)
                    }
    
                })
    
            })

            // If the value is defined, push it into the cache.
            if (value != undefined) {
                if (cacheIndex) this.cacher.delete(cacheIndex)
                this.cacher.push(storeKey, value, fileLastModified)
            }

        }

        // Return the value.
        return value

    }

    /**
     * Retrieves the value of the key in the object.
     * If failed, returns undefined.
     */
    public async get<V>(key: any): Promise<V | undefined> {
        // Convert key to store key.
        let storeKey = this.converter.convertKeyToStoreKey(key)

        // Handle if the key exceeds the 250 characters limit.
        if (storeKey.length > 250) {
            // Get all key-UUID pairs. If it doesn't exist, return undefined.
            let keyUuidPairs = await this.get<{[storeKey: string]: string}>('key-uuid-pairs')
            if (keyUuidPairs == undefined) return undefined

            // Get the UUID of the store key. If it doesn't exist, return undefined.
            let uuid = keyUuidPairs[storeKey]
            if (uuid == undefined) return undefined

            // Re-assign the store key with its UUID.
            storeKey = uuid

        }

        // Return a promise to retrieve the value from the store key.
        return this.getValueFromStoreKey<V | undefined>(storeKey)

    }

    /**
     * Assigns a value to a key in the object.
     * If failed, throws an Error.
     */
    public async set(key: any, value: any) {
        // Convert key to store key.
        let storeKey = this.converter.convertKeyToStoreKey(key)

        // If the key exceeds the 250 characters limit, get the UUID of the store key.
        if (storeKey.length > 250) {
            // Get all key-UUID pairs in a Map. If it doesn't exist, create the map.
            let keyUuidPairs = await this.get<{[storeKey: string]: string}>('key-uuid-pairs') || {}

            // Try to get the UUID of the store key.
            let uuid = keyUuidPairs[storeKey]

            // Handle it if the UUID does not exist.
            if (uuid == undefined) {
                // Generate a random UUID for the UUID.
                uuid = randomUUID()

                // Add the store key and UUID to the pairs
                keyUuidPairs[storeKey] = uuid

                // Save the pairs.
                await this.set('key-uuid-pairs', keyUuidPairs)

            }

            // Re-assign the store key with its UUID.
            storeKey = uuid

        }

        // Get the file path from the store key.
        let filePath = this.getFilePath(storeKey)

        // Await a promise to get the file's last modified time.
        let lastModified = await new Promise<number | undefined>((resolve) => {
            stat(this.path, (err, stats) => {
                if (err != undefined) resolve(undefined)
                else resolve(stats.mtimeMs)
            })
        })

        // If the last modified time doesn't exist, then try to recursively create the directory.
        if (lastModified == undefined) {
            await new Promise<void>((resolve, reject) => {
                mkdir(this.path, { 'recursive': true }, (err) => {
                    if (err != undefined) reject(err)
                    else resolve()
                })
            })
        }

        // Await a promise to write to the file.
        await new Promise<void>((resolve, reject) => {
            // Write to the file path a stringified value in UTF-8 format. Throw an error on write error or resolve.
            writeFile(filePath, this.converter.stringify(value), 'utf-8', (err) => {
                if (err != undefined) reject(err)
                else resolve()
            })
        })

        // If file statistics are defined, get its last modified time. Otherwise, await a promise to retrieve it.
        lastModified = lastModified || await new Promise<number | undefined>((resolve) => {
            stat(filePath, (err, stats) => {
                if (err != undefined) resolve(undefined)
                else resolve(stats.mtimeMs)
            })
        })
        
        // If it failed, return.
        if (lastModified == undefined) return

        // If a cache of this key is found, delete it.
        let cacheIndex = this.cacher.find(storeKey)
        if (cacheIndex != undefined) this.cacher.delete(cacheIndex)

        // Push the store key, value, and last modified time into the cache storage.
        this.cacher.push(storeKey, value, lastModified)

    }

    /**
     * Deletes the key-value pair associated with the given key from the object.
     * If successful, returns true, false if otherwise.
     */
    public async delete(key: any) {
        // Convert the key to a store key.
        let storeKey = this.converter.convertKeyToStoreKey(key)

        // If the key exceeds the 250 characters limit, get the UUID of the the store key.
        let keyUuidPairs
        let uuid: string | undefined
        if (storeKey.length > 255) {
            // Get all key-UUID pairs. If it doesn't exist, return false.
            keyUuidPairs = await this.get<{[storeKey: string]: string}>('key-uuid-pairs')
            if (keyUuidPairs == undefined) return false
            
            // Get the UUID of the key. If it doesn't exist, return false.
            uuid = keyUuidPairs[storeKey]
            if (uuid == undefined) return false

        }

        // Await a promise to delete the file.
        let deleted = await new Promise<boolean>((resolve, reject) => {
            // Delete the file from existence. Return false if failed to delete. Otherwise, return true.
            unlink(this.getFilePath(uuid || storeKey), (err) => {
                if(err) reject(false)
                else resolve(true)
            })

        })

        // Handle it if the file was deleted.
        if (deleted) {
            // If the cache of this key is found, delete it.
            let cacheIndex = this.cacher.find(storeKey)
            if (cacheIndex != undefined) this.cacher.delete(cacheIndex)

            // Handle it if key UUID pairs is defined.
            if (keyUuidPairs != undefined) {
                // Delete the store key and UUID.
                delete keyUuidPairs[storeKey]

                // Save the pairs if it still has contents.
                if (Object.keys(keyUuidPairs).length > 0) {
                    await this.set('key-uuid-pairs', keyUuidPairs)
                }

                // Delete the pairs object if it's empty.
                else {
                    await this.delete('key-uuid-pairs')
                }

            }

        }

        // Return whether or not it is deleted.
        return deleted

    }

    /**
     * Returns every entity in the current working directory.
     */
    public async entities() {
        return new Promise<string[]>((resolve) => { 
            readdir(this.path, (err, entities) => {
                if (err) resolve([])
                else resolve(entities)
            })
        })
    }

    /**
     * An asynchronous generator for iterating through every store keys in the object.
     */
    public async* storeKeys() {
        // Loop through every folder and file.
        for (let entity of await this.entities()) {
            // Handle the entity if its name ends with '.json'
            if (entity.endsWith('.json')) {
                // If the entity's statistics shows that it is a file, yield the file with no extension as the store key.
                if (await new Promise<boolean>((resolve) => {
                    stat(join(this.path, entity), (err, stats) => {
                        if (err || stats.isDirectory()) resolve(false)
                        else resolve(true)
                    })
                })) {
                    yield entity.slice(0, entity.indexOf('.json'))
                }
    
            }

        }

    }

    /**
     * Counts the amount of keys in the object.
     */
    public async size() {
        // Create a counter variable.
        let size = 0
        // Iterate through every store keys. If the store key isn't essential to Store Map, add to the counter.
        for await (let storeKey of this.storeKeys()) {
            if (storeKey != 'key-uuid-pairs') size++
        }

        return size
    }

    /**
     * An asynchronous generator for iterating through every keys in the object.
     */
    public async* keys() {
        // Try to retrieve every key-UUID pair.
        let keyUuidPairs = await this.get<Map<string, string>>('key-uuid-pairs')

        // Iterate through every store key and try to get their key.
        for await (let storeKey of this.storeKeys()) {
            let isValidUuid = validate(storeKey)

            // If the key-UUID pairs exists and the store key is a valid UUID, loop through every pair.
            if (keyUuidPairs && isValidUuid) {
                for (let [key, uuid] of keyUuidPairs) {
                    // If the store key and UUID is the same, yield the key.
                    if (storeKey == uuid) yield key

                }
            }

            // Otherwise, if it is not a valid UUID, try to convert the store key in hand to a key.
            else if (!isValidUuid) {
                // Only convert if the store key isn't essential to Store Map.
                if (storeKey != 'key-uuid-pairs') yield this.converter.convertStoreKeyToKey(storeKey)
                
            }

        }

    }

    /**
     * Checks whether or not the key exists in the object.
     */
    public async has(key: any) {
        // Iterate through every key. If the parameter key matches the iterate key, return true. Return false when finished.
        for await (let key2 of this.keys()) {
            if (key == key2) return true
        }
        return false

    }

    /**
     * Deletes every key-value pair in the object.
     */
    public async clear() {
        // Iterate through every key and delete them.
        for await (let key of this.keys()) {
            this.delete(key)
        }

    }

    /**
     * An asynchronous generator for iterating through every value in the object.
     */
    public async* values(): AsyncGenerator<any> {
        // Iterate through every key and yield their values.
        for await (let key of this.keys()) {
            yield this.get(key)
        }

    }

    /**
     * An asynchronous generator for iterating through every key-value pair in the object.
     */
    public async* entries(): AsyncGenerator<[any, any]> {
        // Iterate through every key and yield them and their value.
        for await (let key of this.keys()) {
            yield [key, await this.get(key)]
        }

    }

    // Connect this object's async iterator to the entries function.
    public [Symbol.asyncIterator] = this.entries

    /**
     * Dumps as many small files as possible into the cache.
     */
    public async initializeCache() {
        // Initialize the array of store keys and sizes.
        let storeKeysWithSizes: [string, number][] = []

        // Iterate through every entity.
        for (let entity of await this.entities()) {
            // Handle if the entity ends with '.json'.
            if (entity.endsWith('.json')) {
                // Await a promise to perform a check on the entity's statistics.
                await new Promise<void>((resolve) => {
                    stat(join(this.path, entity), (err, stats) => {
                        // If the entity is a file, push the file and its size to the array.
                        if (err == undefined && stats.isFile()) {
                            storeKeysWithSizes.push([entity, stats.size])
                        }

                        resolve()
                    })
                })

            }

        }

        // Sort the pairs in the array from lowest size to highest.
        storeKeysWithSizes = storeKeysWithSizes.sort((a, b) => a[1] - b[1])

        // Iterate through the store keys.
        for (let [storeKey, size] of storeKeysWithSizes) {
            // Handle if the sum of the memory usage and the size is less than the memory limit.
            if (this.cacher.memoryUsage + size < this.cacher.memoryLimit) {
                // Retrieve their value to store them into cache.
                await this.getValueFromStoreKey(storeKey)
            }
            
            // Otherwise, if the sum exceeds the limit, break the iteration.
            else break

        }

    }

}