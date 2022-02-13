var _a;
import { copy } from "copy-anything";
import { randomUUID } from "crypto";
import { mkdir, readdir, readFile, stat, unlink, writeFile } from "fs";
import { join } from "path";
import validate from "uuid-validate";
import { getObjectSize } from "./object-size.js";
import { StoredMapConverter } from "./stored-map-converter.js";
/** An asynchronously iterable map object that holds key-value pairs stored as JSON files on the disk. */
export class StoredMap {
    /** Construct `StoredMap` object.
     * @param path Indicate the working directory.
     * @param options Contain the options.
    */
    constructor(path, options = {}) {
        /** Indicate the amount of RAM in bytes occupying the cache storage. */
        this.memoryUsage = 0;
        /** Contain cached items. */
        this.cacheStorage = {};
        /** Indicate the filename of the UUID dictionary. */
        this.uuidDictionary = 'uuid-dictionary';
        /** Return an iterator for key-value pairs. */
        this[_a] = this.entries;
        this.path = path;
        this.memoryLimit = options.memoryLimit || 100000000;
        this.converter = options.converter || new StoredMapConverter();
    }
    /** Get the value of the key. If failed, return `undefined`. */
    async get(key) {
        let value;
        let filename = this.converter.convertKeyToFilename(key);
        if (filename.length > 255) {
            let uuidDictionary = await this.get(this.uuidDictionary);
            if (uuidDictionary == undefined)
                return;
            let uuid = uuidDictionary[filename];
            if (uuid == undefined) {
                return;
            }
            filename = uuid;
        }
        let filePath = join(this.path, filename);
        let fileStatistics = await this.getFileStatistics(filename);
        if (fileStatistics != undefined) {
            let fileLastModified = fileStatistics.mtimeMs;
            let cacheItem = this.cacheStorage[filename];
            if (cacheItem != undefined) {
                let cacheLastModified = cacheItem[1];
                if (fileLastModified == cacheLastModified) {
                    let cacheValue = cacheItem[0];
                    value = copy(cacheValue);
                }
            }
            if (value == undefined) {
                value = await new Promise((resolve) => {
                    readFile(filePath, 'utf-8', (err, data) => {
                        if (err)
                            return resolve(undefined);
                        try {
                            resolve(this.converter.parse(data));
                        }
                        catch (e) {
                            resolve(undefined);
                        }
                    });
                });
                if (value != undefined) {
                    this.cache(filename, [value, fileLastModified]);
                }
            }
        }
        return value;
    }
    /** Assign a value to a key. If failed, throw `Error`. */
    async set(key, value) {
        let filename = this.converter.convertKeyToFilename(key);
        if (filename.length > 255) {
            let uuidDictionary = await this.get(this.uuidDictionary) || {};
            let uuid = uuidDictionary[filename];
            if (uuid == undefined) {
                uuid = randomUUID() + '.json';
                uuidDictionary[filename] = uuid;
                await this.set(this.uuidDictionary, uuidDictionary);
            }
            filename = uuid;
        }
        let filePath = join(this.path, filename);
        let fileStatistics = await this.getFileStatistics(filename);
        if (fileStatistics == undefined) {
            await new Promise((resolve, reject) => {
                mkdir(this.path, { 'recursive': true }, (err) => {
                    if (err != undefined)
                        reject(err);
                    else
                        resolve();
                });
            });
        }
        await new Promise((resolve, reject) => {
            writeFile(filePath, this.converter.stringify(value), 'utf-8', (err) => {
                if (err != undefined)
                    reject(err);
                else
                    resolve();
            });
        });
        if (fileStatistics == undefined) {
            fileStatistics = await this.getFileStatistics(filename);
        }
        if (fileStatistics != undefined) {
            let fileLastModified = fileStatistics.mtimeMs;
            this.cache(filename, [value, fileLastModified]);
        }
    }
    /** Delete a key-value pair. Return `true` if successful, otherwise return `false`. */
    async delete(key) {
        let filename = this.converter.convertKeyToFilename(key);
        let uuidDictionary;
        let uuid;
        if (filename.length > 255) {
            uuidDictionary = await this.get(this.uuidDictionary);
            if (uuidDictionary == undefined)
                return false;
            uuid = uuidDictionary[filename];
            if (uuid == undefined)
                return false;
            filename = uuid;
        }
        let deleted = await new Promise((resolve, reject) => {
            unlink(join(this.path, filename), (err) => {
                if (err) {
                    return reject(false);
                }
                else {
                    return resolve(true);
                }
            });
        });
        if (deleted == true) {
            let cacheItem = this.cacheStorage[filename];
            if (cacheItem != undefined) {
                this.deleteCache(filename);
            }
            if (uuidDictionary != undefined) {
                delete uuidDictionary[filename];
                if (Object.keys(uuidDictionary).length > 0) {
                    await this.set(this.uuidDictionary, uuidDictionary);
                }
                else {
                    await this.delete(this.uuidDictionary);
                }
            }
        }
        return deleted;
    }
    /** Return how many key-value pairs exist. */
    async size() {
        let size = 0;
        let iterator = this.keyValueFiles();
        while ((await iterator.next()).done != true) {
            size++;
        }
        return size;
    }
    /** Return an iterator for every key. */
    async *keys() {
        let uuidDictionary = await this.get(this.uuidDictionary);
        for await (let filename of this.keyValueFiles()) {
            let isValidUuid = validate(filename.slice(0, filename.lastIndexOf('.json')));
            if (uuidDictionary && isValidUuid) {
                for (let key in uuidDictionary) {
                    if (uuidDictionary[key] == filename) {
                        yield key.slice(0, key.lastIndexOf('.json'));
                    }
                }
            }
            else if (!isValidUuid) {
                yield this.converter.convertFilenameToKey(filename);
            }
        }
    }
    /** Return `true` if the key exists, otherwise return `false`. */
    async has(key) {
        let filename = this.converter.convertKeyToFilename(key);
        if (filename.length > 255) {
            let uuidDictionary = await this.get(this.uuidDictionary);
            if (uuidDictionary == undefined)
                return;
            let uuid = uuidDictionary[filename];
            if (uuid == undefined) {
                return;
            }
            filename = uuid;
        }
        return await this.getFileStatistics(filename) != undefined;
    }
    /** Delete every key-value pair. */
    async clear() {
        for await (let key of this.keys()) {
            this.delete(key);
        }
    }
    /** Return an iterator for every value. */
    async *values() {
        for await (let key of this.keys()) {
            yield this.get(key);
        }
    }
    /** Return an iterator for every key-value pair. */
    async *entries() {
        for await (let key of this.keys()) {
            yield [key, await this.get(key)];
        }
    }
    /** Return a promise to retrieve statistics for a file in the path. */
    async getFileStatistics(filename) {
        return new Promise((resolve) => {
            stat(join(this.path, filename), (error, statistics) => {
                if (error) {
                    return resolve(undefined);
                }
                else {
                    return resolve(statistics);
                }
            });
        });
    }
    /** Delete an item from the cache storage. */
    deleteCache(key) {
        this.memoryUsage -= getObjectSize(this.cacheStorage[key]);
        delete this.cacheStorage[key];
    }
    /** Insert an item into cache storage. Return `true` if successful, otherwise return `false`. */
    cache(key, item) {
        let memory = getObjectSize(item);
        let cacheKeys = Object.keys(this.cacheStorage);
        while (memory + this.memoryUsage > this.memoryLimit) {
            let cacheKey = cacheKeys.shift();
            if (cacheKey == undefined) {
                return false;
            }
            this.deleteCache(cacheKey);
        }
        if (key in this.cacheStorage) {
            this.deleteCache(key);
        }
        this.cacheStorage[key] = item;
        this.memoryUsage += memory;
        return true;
    }
    /** Return an array of files and folders in the path. */
    async getFiles() {
        return new Promise((resolve) => {
            readdir(this.path, (error, entities) => {
                if (error) {
                    return resolve(undefined);
                }
                else {
                    return resolve(entities);
                }
            });
        });
    }
    /** Return an iterator for every key value files */
    async *keyValueFiles() {
        let files = await this.getFiles();
        if (files != undefined) {
            for (let file of files) {
                if (file.endsWith('.json')) {
                    let statistics = await this.getFileStatistics(file);
                    if (statistics && statistics.isFile()) {
                        yield file;
                    }
                }
            }
        }
    }
}
_a = Symbol.asyncIterator;
