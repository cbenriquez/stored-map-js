import { isValidStoreKey } from "./store-key-validator.js"
import { StoredMap } from "./stored-map.js"

/**
 * A class that provides the functions for StoredMap objects to convert values to and from the Javascript Object Notation format.
 */
export class StoredMapConverter {
    
    public parsers = new Map<string, (args: any[]) => any>()
    public stringifiers = new Map<string, (value: any) => string[] | false>()

    constructor() {
        // Construct default parsers and stringifiers.

        // Implement "Infinity()" <=> Infinity.
        this.parsers.set('Infinity', () => Infinity)
        this.stringifiers.set('Infinity', (value) => typeof value == 'number' && value == Infinity && [])

        // Implement "-Infinity()" <=> Infinity.
        this.parsers.set('-Infinity', () => -Infinity)
        this.stringifiers.set('-Infinity', (value) => typeof value == 'number' && value == -Infinity && [])

        // Implement "NaN()" <=> NaN.
        this.parsers.set('NaN', () => NaN)
        this.stringifiers.set('NaN', (value) => typeof value == 'number' && isNaN(value) && [])

        // Implement "undefined()" <=> undefined.
        this.parsers.set('undefined', () => undefined)
        this.stringifiers.set('undefined', (value) => value == undefined && [])

        // Implement "BigInt()" <=> BigInt.
        this.parsers.set('BigInt', (args: string[]) => BigInt(args[0]))
        this.stringifiers.set('BigInt', (value) => typeof value == 'bigint' && [])

        // Implement "Date()" <=> Date.
        this.parsers.set('Date', (args: string[]) => new Date(Number(args[0])))
        this.stringifiers.set('Date', (value) => value instanceof Date && [value.getTime().toString()])

        // Implement "StoredMap()" <=> StoredMap.
        this.parsers.set('StoredMap', (args: string[]) => new StoredMap(args[0]))
        this.stringifiers.set('StoredMap', (value) => value instanceof StoredMap && [value.path])

        // Implement "Map()" <=> Map.
        this.parsers.set('Map', (args: any[]) => new Map(args[0]))
        this.stringifiers.set('Map', (value) => value instanceof Map && [this.stringify(Array.from(value))])

    }

    public parse<V>(json: string): V {
        // Convert the Javascript Object Notation string into an object.
        let jsonObject = JSON.parse(json)

        // Handle the JSON object if it is of type "string".
        if (typeof jsonObject == 'string') {
            // Get the name of the parser in the string
            let parserName = jsonObject.slice(0, jsonObject.indexOf('('))

            // Try to get the function using the parser name.
            let runParser = this.parsers.get(parserName)

            // Handle the string if a parser function exists.
            if (runParser != undefined) {
                // Get the argument section of the string e.g. "Date(<this>)".
                let parserArgumentSection = jsonObject.slice(
                    jsonObject.indexOf('(') + 1,
                    jsonObject.lastIndexOf(')')
                )

                // Keep removing backslashes from the argument section until the start of the argument section has none.
                while (parserArgumentSection.startsWith('\\')) {
                    parserArgumentSection = parserArgumentSection.replaceAll('\\"', '"')
                }

                // If exists, remove quotation marks between the start and end of the argument section
                if (parserArgumentSection.startsWith('"') && parserArgumentSection.endsWith('"')) {
                    parserArgumentSection = parserArgumentSection.slice(1, parserArgumentSection.length - 1)
                }
                
                // Parser parameters will be passed to the parser.
                let parserParameters: string[] = []

                try {
                    // Try to parse the argument section into an array.
                    parserParameters = this.parse(`[${parserArgumentSection}]`)

                } catch(e) {
                    // It may fail if the resultant string from the earlier removal of backslashes caused a SyntaxError.
                    if (e instanceof SyntaxError) {
                        // If true, then add an extra backslash to every quotation mark in the argument section.
                        parserArgumentSection = parserArgumentSection.replaceAll('\\"', '\\\\"')
                        
                        // Then parse it again.
                        parserParameters = this.parse(`[${parserArgumentSection}]`)
                    }

                } finally {
                    // Pass the parameters to the parser and re-assign the JSON object.
                    jsonObject = runParser(parserParameters)

                }

            }

        }

        // Handle the JSON object if it is of type "object".
        else if (typeof jsonObject == 'object') {
            // Parse and re-assign every value of they object.
            for (let key of Object.keys(jsonObject)) {
                // If the value of the key is a string, then add quotation marks around it.
                if (typeof jsonObject[key] == 'string') {
                    jsonObject[key] = `"${jsonObject[key]}"`
                }

                // If the value of the key is a object, then stringify the value.
                else if (typeof jsonObject[key] == 'object') {
                    jsonObject[key] = this.stringify(jsonObject[key])
                }

                // Parse the value and re-assign.
                jsonObject[key] = this.parse(jsonObject[key])
            }

        }

        // Return the object.
        return jsonObject

    }

    public stringify(value: any): string {
        // Store a copy of the value for modification.
        let modificationValue = value

        // Loop every stringifier and pass the modification value onto them so it may return a string array.
        for (let [stringifierName, stringify] of this.stringifiers) {
            // Pass the modification value to the stringifier.
            let stringArray = stringify(modificationValue)

            // If arguments are returned, then re-assign the modification value and break the loop.
            if (stringArray) {
                // Format the arguments into a string.
                let argumentsText = stringArray.map((stringArray) => `"${stringArray}"`).join(',')

                // Re-assign the modification value.
                modificationValue = `${stringifierName}(${argumentsText})`
                
                // Break the loop.
                break

            }

        }

        // Handle the modification value if it is of type "object".
        if (typeof modificationValue == 'object') {
            // Clone the object.
            modificationValue = Object.assign({}, [value])[0]

            // Stringify every value of the object.
            for (let key of Object.keys(modificationValue)) {      
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
