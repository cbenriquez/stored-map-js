# StoredMap
An asynchronously iterable map object that holds key-value pairs stored as JSON files on the disk.

The map object is on its alpha phase. It is not yet tested on a large scale and should not be used for production by the time being. The current formatting is subject to change.

## Installation

### Github
```bash
npm install github:cbenriquez/stored-map-js
```

## Features
### Key Files
The map object stores your key-value pairs as files. The key as its identifier.

If your key is a string, the value of the string will be used. Otherwise, it will convert the key into Base64-encoded JSON.

If the key exceeds the maximum length for a file, the pair will be identified by a UUID.

### Javascript Object Serialization
The map object depends on a converter object that utilizes JSON strings to preserve certain data types unsupported by JSON.

For example, an Infinity assigned to a key in the object will return Infinity when retrieved, even when the program is restarted.

The converter object can preserve the following instances and data types by default:
1. Infinity
2. -Infinity
3. NaN
4. undefined
5. BigInt
6. Date
7. StoredMap
8. Map
9. Set
10. Function
11. Generator Function
12. Async Function
13. Async Generator Function

The list may be updated in the future, but you may inspect the converter object's constructor if you wish to create your own serialization methods.

### Caching System
The map object utilizes a caching system to aid the value retrieval process.

The object is assigned a cache memory limit. The default setting is 100,000,000 bytes, or 100 megabytes, and can be be specified in the constructor or altered in the properties.
