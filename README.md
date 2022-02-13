# StoredMap

An asynchronously iterable map object that holds key-value pairs stored as JSON files on the disk.

## Demonstration

```TypeScript
let map = new StoredMap('dist/work_dir')

/** StoredMap can store key-value pairs similarly to Map. */
// A primitive key with a Date object value.
await map.set('foo', new Date())
// A Date object key contained in an array with a primitive value.
await map.set([new Date()], 'baz')
// A primitive key more than 256 characters with a primitive value.
await map.set('f' + 'o'.repeat(500), 'gar')

/** The files in your work_dir folder will look like this:
 * 1. foo.json
 * 2. WyJEYXRlKDE2NDQ3Njc1OTUwODQpIl0.json
 * 3. 9cbe324c-ff38-4db5-ae3a-053fb9ca6b04.json
 * 4. uuid-dictionary.json
*/

// Iterate through the object.
for await (let [key, value] of map) {
    console.log('Key:', key, 'Value:', value)
}

// Delete all pairs.
await map.clear()
```

## Installation

### Node
Install the production version in the npm Registry.
```bash
npm install stored-map
```

## Features

### Key-Value Pairs
The map object stores your key-value pairs as files. The working directory of the object will automatically be created upon access.

The key is used as the file name. If your key is a string, the value of the string will be used. Otherwise, it will convert the key into Base64 JSON.

If the key exceeds the maximum length for a file, the pair will be identified by a UUID.

### Javascript Object Serialization
The map object depends on a converter class that utilizes JSON strings to serialize objects unsupported by JSON.

A value of Infinity assigned to a key will return Infinity when retrieved, even when the program is restarted.

The converter can serialize the following objects and special values:
- Infinity
- -Infinity
- NaN
- undefined
- BigInt
- Date
- StoredMap
- Map
- Set
- Function
- Generator Function
- Async Function
- Async Generator Function

Function parameters and source code are serialized, but the name of the function aren't. This is due to the limitations of JavaScript.

The list may be updated in the future, but you may inspect the converter object's constructor if you wish to create your own serialization methods.

### Caching
The map object utilizes caching to enhance the value retrieval process.

The object is assigned a cache memory limit. The default setting is 100,000,000 bytes, or 100 megabytes, and can be specified in the constructor or altered in the properties.

When a value is retrieved or assigned to a key, it is saved into the cache. If the memory limit is exceeded, it will free the first cached entries to make space.