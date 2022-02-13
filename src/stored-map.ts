import { copy } from "copy-anything"
import { randomUUID } from "crypto"
import { mkdir, readdir, readFile, stat, Stats, unlink, writeFile } from "fs"
import { join } from "path"
import validate from "uuid-validate"
import { getObjectSize } from "./object-size.js"
import { StoredMapConverter } from "./stored-map-converter.js"

export interface StoredMapOptions {
    /** Indicate the maximum amount of RAM in bytes that the object can use at one time. */
    memoryLimit?: number

     /** Contain the conversion functions. */
    converter?: StoredMapConverter

}

/** An asynchronously iterable map object that holds key-value pairs stored as JSON files on the disk. */
export class StoredMap {
    /** Indicate the working directory.*/
    public path: string

    /** Contain the conversion functions. */
    public converter: StoredMapConverter

    /** Indicate the maximum amount of RAM in bytes that the cache storage can use at a time. */
    public memoryLimit: number

    /** Indicate the amount of RAM in bytes occupying the cache storage. */
    public memoryUsage: number = 0

    /** Contain cached items. */
    public cacheStorage: {[filename: string]: [any, number]} = {}

    /** Indicate the filename of the UUID dictionary. */
    public uuidDictionary = 'uuid-dictionary'

    /** Return an iterator for key-value pairs. */
    public [Symbol.asyncIterator] = this.entries

    /** Construct `StoredMap` object.
     * @param path Indicate the working directory.
     * @param options Contain the options.
    */
    public constructor(path: string, options: StoredMapOptions = {}) {
        this.path = path
        this.memoryLimit = options.memoryLimit || 100000000
        this.converter = options.converter || new StoredMapConverter()
    }

    /** Get the value of the key. If failed, return `undefined`. */
    public async get<V>(key: any): Promise<V | undefined> {
        let value
        let filename = this.converter.convertKeyToFilename(key)
        if (filename.length > 255) {
            let uuidDictionary = await this.get<{[storeKey: string]: string}>(this.uuidDictionary)
            if (uuidDictionary == undefined) return
            let uuid = uuidDictionary[filename]
            if (uuid == undefined) {
                return
            }
            filename = uuid
        }
        let filePath = join(this.path, filename)
        let fileStatistics = await this.getFileStatistics(filename)
        if (fileStatistics != undefined) {
            let fileLastModified = fileStatistics.mtimeMs
            let cacheItem = this.cacheStorage[filename]
            if (cacheItem != undefined) {
                let cacheLastModified = cacheItem[1]
                if (fileLastModified == cacheLastModified) {
                    let cacheValue = cacheItem[0]
                    value = copy(cacheValue)
                }
            }
            if (value == undefined) {
                value = await new Promise<V | undefined>((resolve) => {
                    readFile(filePath, 'utf-8', (err, data) => {
                        if (err) return resolve(undefined)
                        try {
                            resolve(this.converter.parse(data))
                        } catch(e) {
                            resolve(undefined)
                        }
                    })
                })
                if (value != undefined) {
                    this.cache(filename, [value, fileLastModified])
                }
            }
        }
        return value
    }

    /** Assign a value to a key. If failed, throw `Error`. */
    public async set(key: any, value: any) {
        let filename = this.converter.convertKeyToFilename(key)
        if (filename.length > 255) {
            let uuidDictionary = await this.get<{[storeKey: string]: string}>(this.uuidDictionary) || {}
            let uuid = uuidDictionary[filename]
            if (uuid == undefined) {
                uuid = randomUUID() + '.json'
                uuidDictionary[filename] = uuid
                await this.set(this.uuidDictionary, uuidDictionary)
            }
            filename = uuid
        }
        let filePath = join(this.path, filename)
        let fileStatistics = await this.getFileStatistics(filename)
        if (fileStatistics == undefined) {
            await new Promise<void>((resolve, reject) => {
                mkdir(this.path, { 'recursive': true }, (err) => {
                    if (err != undefined) reject(err)
                    else resolve()
                })
            })
        }
        await new Promise<void>((resolve, reject) => {
            writeFile(filePath, this.converter.stringify(value), 'utf-8', (err) => {
                if (err != undefined) reject(err)
                else resolve()
            })
        })
        if (fileStatistics == undefined) {
            fileStatistics = await this.getFileStatistics(filename)
        }
        if (fileStatistics != undefined) {
            let fileLastModified = fileStatistics.mtimeMs
            this.cache(filename, [value, fileLastModified])
        }
    }

    /** Delete a key-value pair. Return `true` if successful, otherwise return `false`. */
    public async delete(key: any) {
        let filename = this.converter.convertKeyToFilename(key)
        let uuidDictionary
        let uuid: string | undefined
        if (filename.length > 255) {
            uuidDictionary = await this.get<{[storeKey: string]: string}>(this.uuidDictionary)
            if (uuidDictionary == undefined) return false
            uuid = uuidDictionary[filename]
            if (uuid == undefined) return false
            filename = uuid
        }
        let deleted = await new Promise<boolean>((resolve, reject) => {
            unlink(join(this.path, filename), (err) => {
                if(err) {
                    return reject(false)
                }
                else {
                    return resolve(true)
                }
            })
        })
        if (deleted == true) {
            let cacheItem = this.cacheStorage[filename]
            if (cacheItem != undefined) {
                this.deleteCache(filename)
            }
            if (uuidDictionary != undefined) {
                delete uuidDictionary[filename]
                if (Object.keys(uuidDictionary).length > 0) {
                    await this.set(this.uuidDictionary, uuidDictionary)
                } else {
                    await this.delete(this.uuidDictionary)
                }
            }
        }
        return deleted
    }

    /** Return how many key-value pairs exist. */
    public async size() {
        let size = 0
        for await (let file of this.keyValueFiles()) {
            if (file != this.uuidDictionary) {
                size++
            }
        }
        return size
    }

    /** Return an iterator for every key. */
    public async* keys() {
        let keyUuidPairs = await this.get<{[key: string]: string}>('key-uuid-pairs')
        for await (let file of this.keyValueFiles()) {
            let isValidUuid = validate(file)
            if (keyUuidPairs && isValidUuid) {
                for (let [key, uuid] of Object.entries(keyUuidPairs)) {
                    if (file == uuid) {
                        yield key
                    }
                }
            } else if (!isValidUuid) {
                let key = this.converter.convertFilenameToKey(file)
                if (file != this.uuidDictionary) {
                    yield key
                }
            }
        }
    }

    /** Return `true` if the key exists, otherwise return `false`. */
    public async has(key: any) {
        for await (let key2 of this.keys()) {
            if (key == key2) {
                return true
            }
        }
        return false
    }

    /** Delete every key-value pair. */
    public async clear() {
        for await (let key of this.keys()) {
            this.delete(key)
        }
    }

    /** Return an iterator for every value. */
    public async* values(): AsyncGenerator<any> {
        for await (let key of this.keys()) {
            yield this.get(key)
        }
    }

    /** Return an iterator for every key-value pair. */
    public async* entries(): AsyncGenerator<[any, any]> {
        for await (let key of this.keys()) {
            yield [key, await this.get(key)]
        }
    }

    /** Return a promise to retrieve statistics for a file in the path. */
    private async getFileStatistics(filename: string) {
        return new Promise<Stats | undefined>((resolve) => {
            stat(join(this.path, filename), (error, statistics) => {
                if (error) {
                    return resolve(undefined)
                } else {
                    return resolve(statistics)
                }
            })
        })
    }

    /** Delete an item from the cache storage. */
    private deleteCache(key: string) {
        this.memoryUsage -= getObjectSize(this.cacheStorage[key])
        delete this.cacheStorage[key]
    }

    /** Insert an item into cache storage. Return `true` if successful, otherwise return `false`. */
    private cache(key: string, item: any) {
        let memory = getObjectSize(item)
        let cacheKeys = Object.keys(this.cacheStorage)
        while (memory + this.memoryUsage > this.memoryLimit) {
            let cacheKey = cacheKeys.shift()
            if (cacheKey == undefined) {
                return false
            }
            this.deleteCache(cacheKey)
        }
        if (key in this.cacheStorage) {
            this.deleteCache(key)
        }
        this.cacheStorage[key] = item
        this.memoryUsage += memory
        return true
    }

    /** Return an array of files and folders in the path. */
    private async getFiles() {
        return new Promise<string[] | undefined>((resolve) => { 
            readdir(this.path, (error, entities) => {
                if (error) {
                    return resolve(undefined)
                } else {
                    return resolve(entities)
                }
            })
        })
    }
    
    /** Return an iterator for every key value files */
    private async* keyValueFiles() {
        let files = await this.getFiles()
        if (files != undefined) {
            for (let file of files) {
                if (file.endsWith('.json')) {
                    let statistics = await this.getFileStatistics(file)
                    if (statistics && statistics.isFile()) {
                        yield file.slice(0, file.indexOf('.json'))
                    }
                }
            }
        }
    }
}