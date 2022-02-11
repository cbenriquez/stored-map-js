import { isValidStoreKey } from "./store-key-validator.js";
import { StoredMap } from "./stored-map.js";
/**
 * A class that provides the functions for StoredMap objects to convert values to and from the Javascript Object Notation format.
 */
export class StoredMapConverter {
    constructor() {
        this.deserializer = {};
        this.serializer = {};
        // Implement serializer and deserializer for Infinity.
        this.deserializer['Infinity'] = () => {
            return Infinity;
        };
        this.serializer['Infinity'] = (value) => {
            if (typeof value == 'number' && value == Infinity) {
                return [];
            }
        };
        // Implement serializer and deserializer for -Infinity.
        this.deserializer['-Infinity'] = () => {
            return -Infinity;
        };
        this.serializer['Infinity'] = (value) => {
            if (typeof value == 'number' && value == -Infinity) {
                return [];
            }
        };
        // Implement serializer and deserializer for NaN.
        this.deserializer['NaN'] = () => {
            return NaN;
        };
        this.serializer['NaN'] = (value) => {
            if (typeof value == 'number' && isNaN(value)) {
                return [];
            }
        };
        // Implement serializer and deserializer for undefined.
        this.deserializer['undefined'] = () => {
            return undefined;
        };
        this.serializer['undefined'] = (value) => {
            if (value == undefined) {
                return [];
            }
        };
        // Implement serializer and deserializer for BigInt.
        this.deserializer['BigInt'] = (args) => {
            return BigInt(args[0]);
        };
        this.serializer['BigInt'] = (value) => {
            if (typeof value == 'bigint')
                return [];
        };
        // Implement serializer and deserializer for Date.
        this.deserializer['Date'] = (args) => {
            return new Date(args[0]);
        };
        this.serializer['Date'] = (value) => {
            if (value instanceof Date) {
                return [value.getTime()];
            }
        };
        // // Implement serializer and deserializer for StoredMap.
        this.deserializer['StoredMap'] = (args) => {
            return new StoredMap(args[0]);
        };
        this.serializer['StoredMap'] = (value) => {
            if (value instanceof StoredMap) {
                return [value.path];
            }
        };
        // Implement serializer and deserializer for Map.
        this.deserializer['Map'] = (args) => {
            return new Map(args[0]);
        };
        this.serializer['Map'] = (value) => {
            if (value instanceof Map) {
                return [Array.from(value)];
            }
        };
    }
    parse(json) {
        // Convert the Javascript Object Notation string into an object.
        let jsonObject = JSON.parse(json);
        // Handle if the JSON object is of type "string".
        if (typeof jsonObject == 'string') {
            // Get the name of the deserializer in the string
            let deserializerName = jsonObject.slice(0, jsonObject.indexOf('('));
            // Try to get the function using the deserializer name.
            let deserialize = this.deserializer[deserializerName];
            // Handle if a deserializer function exists.
            if (deserialize != undefined) {
                // Get the arguments of the string e.g. "Date(<this>)".
                let deserializerArgumentsText = jsonObject.slice(jsonObject.indexOf('(') + 1, jsonObject.lastIndexOf(')'));
                // Declare a variable for the arguments.
                let deserializerArguments;
                // Handle while the arguments are undefined.
                while (deserializerArguments == undefined) {
                    // Try to parse the text for the arguments.
                    try {
                        deserializerArguments = this.parse('[' + deserializerArgumentsText + ']');
                    }
                    catch (e) {
                        // Handle if a syntax error occured and the message states there is an unexpected token.
                        if (e instanceof SyntaxError && e.message.includes('Unexpected token')) {
                            // Remove one backslash from every quotation mark.
                            deserializerArgumentsText = deserializerArgumentsText.replaceAll('\\"', '"');
                        }
                        // Otherwise, throw the error.
                        else
                            throw e;
                    }
                }
                // Pass them to the deserializer.
                jsonObject = deserialize(deserializerArguments);
            }
        }
        // Handle if the JSON object is of type "object".
        else if (typeof jsonObject == 'object') {
            // Parse and re-assign every value of they object.
            for (let key of Object.keys(jsonObject)) {
                // If the value of the key is a string, then add quotation marks around it.
                if (typeof jsonObject[key] == 'string') {
                    jsonObject[key] = `"${jsonObject[key]}"`;
                }
                // If the value of the key is a object, then stringify the value.
                else if (typeof jsonObject[key] == 'object') {
                    jsonObject[key] = this.stringify(jsonObject[key]);
                }
                // Parse the value and re-assign.
                jsonObject[key] = this.parse(jsonObject[key]);
            }
        }
        // Return the object.
        return jsonObject;
    }
    stringify(value) {
        // Store a copy of the value for modification.
        let modificationValue = value;
        // Loop every serializer and pass the modification value onto them so it may return a string array.
        for (let [serializerName, serialize] of Object.entries(this.serializer)) {
            // Pass the modification value to the serializer.
            let stringArray = serialize(modificationValue);
            // If arguments are returned, then re-assign the modification value and break the loop.
            if (stringArray) {
                // Format the arguments into a string.
                let argumentsText = stringArray.map((string) => this.stringify(string)).join(',');
                // Re-assign the modification value.
                modificationValue = `${serializerName}(${argumentsText})`;
                // Break the loop.
                break;
            }
        }
        // Handle if the modification value is of type "object".
        if (typeof modificationValue == 'object') {
            // Clone the object.
            modificationValue = Object.assign({}, [value])[0];
            // Stringify every value of the object.
            for (let key of Object.keys(modificationValue)) {
                // Stringify the value.
                let stringifyValue = this.stringify(value[key]);
                // Handle the stringified value if there are quotation marks around it.
                if (stringifyValue.startsWith('"') && stringifyValue.endsWith('"')) {
                    // Remove the quotation marks and re-assign.
                    modificationValue[key] = stringifyValue.slice(1, stringifyValue.length - 1);
                }
            }
        }
        // Convert the modification value into a Javascript Object Notation string and return it.
        return JSON.stringify(modificationValue);
    }
    convertKeyToStoreKey(key) {
        // If the key is of type "string" and is a valid store key return the key.
        if (typeof key == 'string')
            if (isValidStoreKey(key) == true)
                return key;
        // Convert the key into a JSON string.
        let json = this.stringify(key);
        // Format the JSON string as a Base64 URL
        let base64 = Buffer.from(json).toString('base64url');
        // If the Base64 string is not a valid store key, throw an error. Otherwise, return it.
        let validStoreKeyCheck = isValidStoreKey(base64);
        if (validStoreKeyCheck != true)
            throw new Error(`Failed to convert key to store key (${validStoreKeyCheck.message}).`);
        return base64;
    }
    convertStoreKeyToKey(storeKey) {
        // If the file is an invalid filename, then throw an error.
        let validStoreKeyCheck = isValidStoreKey(storeKey);
        if (validStoreKeyCheck != true)
            throw new Error(`Failed to convert store key to key (${validStoreKeyCheck.message}).`);
        // A copy of the store key and if it includes ".json" then it is removed.
        let key = storeKey.includes('.json') && storeKey.slice(0, storeKey.lastIndexOf('.json')) || storeKey;
        try {
            // Try to return the key decoded back to ASCII format and parsed.
            return this.parse(Buffer.from(key, 'base64url').toString('ascii'));
        }
        catch (e) {
            // It may fail if the store key was not a valid JSON Base64. In that case, return the key as the store key.
            return key;
        }
    }
}
