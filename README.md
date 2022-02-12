# StoredMap

An asynchronously iterable map object that holds key-value pairs stored as JSON files on the disk.

## Demonstration

```TypeScript
// Initialize the map object.
let map = new StoredMap('dist/work_dir')

// Set some values.
await map.set('foo', 'bar')
await map.set([new Date()], 'baz')
await map.set('f' + 'o'.repeat(500), ['gar'])

/** The following files will appear in your work_dir folder:
 * 1. foo.json
 * 2. 9d9b0239-50f9-4cbd-a1e5-35d415d42417.json
 * 3. WyJEYXRlKDE2NDQ2NjEwMjcwNzcpIl0.json
 * 4. key-uuid-pairs.json
*/

// Iterate through the object.
for await (let [key, value] of map) {
    console.log('Key:', key, 'Value:', value)
}

// Delete every pair.
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