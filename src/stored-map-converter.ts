import { copy } from "copy-anything"
import { AsyncFunctionSerializer } from "./serializers/async-function.js"
import { AsyncGeneratorFunctionSerializer } from "./serializers/async-generator-function.js"
import { BigIntSerializer } from "./serializers/big-int.js"
import { DateSerializer } from "./serializers/date.js"
import { FunctionSerializer } from "./serializers/function.js"
import { GeneratorFunctionSerializer } from "./serializers/generator-function.js"
import { InfinitySerializer } from "./serializers/infinity.js"
import { MapSerializer } from "./serializers/map.js"
import { NegativeInfinitySerializer } from "./serializers/negative-infinity.js"
import { NotANumberSerializer } from "./serializers/not-a-number.js"
import { SetSerializer } from "./serializers/set.js"
import { StoredMapSerializer } from "./serializers/stored-map.js"
import { UndefinedSerializer } from "./serializers/undefined.js"
import { isValidStoreKey } from "./store-key-validator.js"

export interface Serializer {
    serialize: (value: any) => any | undefined
    deserialize: (args: any) => any
}

/**
 * A class that provides the functions for StoredMap objects to convert values to and from the Javascript Object Notation format.
 */
export class StoredMapConverter {

    public serializers: {[serializerName: string]: Serializer} = {}

    constructor() {
        // Implement serializers.
        this.serializers['Infinity'] = new InfinitySerializer()
        this.serializers['-Infinity'] = new NegativeInfinitySerializer()
        this.serializers['NaN'] = new NotANumberSerializer()
        this.serializers['undefined'] = new UndefinedSerializer()
        this.serializers['BigInt'] = new BigIntSerializer()
        this.serializers['Date'] = new DateSerializer()
        this.serializers['StoredMap'] = new StoredMapSerializer()
        this.serializers['Map'] = new MapSerializer()
        this.serializers['Set'] = new SetSerializer()
        this.serializers['AsyncFunction'] = new AsyncFunctionSerializer()
        this.serializers['AsyncGeneratorFunction'] = new AsyncGeneratorFunctionSerializer()
        this.serializers['GeneratorFunction'] = new GeneratorFunctionSerializer()
        this.serializers['Function'] = new FunctionSerializer()

    }

    public parse<V>(json: string): V {
        // Convert the Javascript Object Notation string into an object.
        let jsonObject = JSON.parse(json)

        // Handle if the JSON object is of type "string".
        if (typeof jsonObject == 'string') {
            // Get the name of the deserializer in the string
            let deserializerName = jsonObject.slice(0, jsonObject.indexOf('('))

            // Try to get the function using the deserializer name.
            let serializer = this.serializers[deserializerName]

            // Handle if a deserializer function exists.
            if (serializer != undefined) {
                // Get the arguments of the string e.g. "Date(<this>)".
                let deserializerArgumentsText = jsonObject.slice(
                    jsonObject.indexOf('(') + 1,
                    jsonObject.lastIndexOf(')')
                )

                // Declare a variable for the arguments.
                let deserializerArguments

                // Handle while the arguments are undefined.
                while (deserializerArguments == undefined) {
                    // Try to parse the text for the arguments.
                    try {
                        deserializerArguments = this.parse<any[]>('[' + deserializerArgumentsText + ']')
                    } catch(e) {
                        // Handle if a unexpected token error occured
                        // and the arguments includes a quotation mark with a backslash. 
                        if (
                            e instanceof SyntaxError
                            && e.message.includes('Unexpected token')
                            && deserializerArgumentsText.includes('\\"')
                        ) {
                            // Remove one backslash from every quotation mark.
                            deserializerArgumentsText = deserializerArgumentsText.replaceAll('\\"', '"')

                        } 

                        // Otherwise, throw the error.
                        else throw e

                    }

                }

                // Pass them to the deserializer.
                jsonObject = serializer.deserialize(deserializerArguments)

            }

        }

        // Handle if the JSON object is of type "object".
        else if (typeof jsonObject == 'object') {
            // Parse and re-assign every value of they object.
            for (let key of Object.keys(jsonObject)) {
                // Parse the value and re-assign.
                jsonObject[key] = this.parse(this.stringify(jsonObject[key]))
            }

        }

        // Return the object.
        return jsonObject

    }

    public stringify(value: any): string {
        // Create a copy of the value for modification.
        let modificationValue = copy(value)

        // Loop every serializer and pass the modification value onto them so it may return a string array.
        for (let [serializerName, serializer] of Object.entries(this.serializers)) {
            // Pass the modification value to the serializer.
            let stringArray = serializer.serialize(modificationValue)

            // If arguments are returned, then re-assign the modification value and break the loop.
            if (stringArray) {
                // Format the arguments into a string.
                let argumentsText = stringArray.map((string: any) => this.stringify(string)).join(',')

                // Re-assign the modification value.
                modificationValue = `${serializerName}(${argumentsText})`
                
                // Break the loop.
                break

            }

        }

        // Handle if the modification value is of type "object".
        if (typeof modificationValue == 'object') {
            // Stringify every value of the object.
            for (let key in modificationValue) {      
                // Stringify the value.
                let stringifyValue = this.stringify(value[key])

                // Handle the stringified value if there are quotation marks around it.
                if (stringifyValue.startsWith('"') && stringifyValue.endsWith('"')) {
                    // Remove the quotation marks and re-assign.
                    modificationValue[key] = stringifyValue.slice(1, stringifyValue.length - 1)

                }

            }

        }

        // Convert the modification value into a Javascript Object Notation string and return it.
        return JSON.stringify(modificationValue)

    }

    public convertKeyToStoreKey(key: any) {
        // If the key is of type "string" and is a valid store key return the key.
        if (typeof key == 'string') if (isValidStoreKey(key) == true) return key

        // Convert the key into a JSON string.
        let json = this.stringify(key)

        // Format the JSON string as a Base64 URL
        let base64 = Buffer.from(json).toString('base64url')
        
        // If the Base64 string is not a valid store key, throw an error. Otherwise, return it.
        let validStoreKeyCheck = isValidStoreKey(base64)
        if (validStoreKeyCheck != true) throw new Error(`Failed to convert key to store key (${validStoreKeyCheck.message}).`)
        return base64

    }

    public convertStoreKeyToKey(storeKey: string) {
        // If the file is an invalid filename, then throw an error.
        let validStoreKeyCheck = isValidStoreKey(storeKey)
        if (validStoreKeyCheck != true) throw new Error(`Failed to convert store key to key (${validStoreKeyCheck.message}).`)

        // A copy of the store key and if it includes ".json" then it is removed.
        let key = storeKey.includes('.json') && storeKey.slice(0, storeKey.lastIndexOf('.json')) || storeKey

        try {
            // Try to return the key decoded back to ASCII format and parsed.
            return this.parse<any>(Buffer.from(key, 'base64url').toString('ascii'))

        } catch(e) {
            // It may fail if the store key was not a valid JSON Base64. In that case, return the key as the store key.
            return key
        }
        
    }
}
