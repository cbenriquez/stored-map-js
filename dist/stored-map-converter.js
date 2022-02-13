import { copy } from "copy-anything";
import { AsyncFunctionSerializer } from "./serializers/async-function.js";
import { AsyncGeneratorFunctionSerializer } from "./serializers/async-generator-function.js";
import { BigIntSerializer } from "./serializers/big-int.js";
import { DateSerializer } from "./serializers/date.js";
import { FunctionSerializer } from "./serializers/function.js";
import { GeneratorFunctionSerializer } from "./serializers/generator-function.js";
import { InfinitySerializer } from "./serializers/infinity.js";
import { MapSerializer } from "./serializers/map.js";
import { NegativeInfinitySerializer } from "./serializers/negative-infinity.js";
import { NotANumberSerializer } from "./serializers/not-a-number.js";
import { SetSerializer } from "./serializers/set.js";
import { StoredMapSerializer } from "./serializers/stored-map.js";
import { UndefinedSerializer } from "./serializers/undefined.js";
import { isValidKeyValueFile } from "./key-value-file-validator.js";
/** A class that provides the functions for StoredMap objects to convert values to and from the Javascript Object Notation format. */
export class StoredMapConverter {
    constructor() {
        this.serializers = {};
        this.failedToConvertMessage = 'Failed to convert key to store key.';
        this.serializers['Infinity'] = new InfinitySerializer();
        this.serializers['-Infinity'] = new NegativeInfinitySerializer();
        this.serializers['NaN'] = new NotANumberSerializer();
        this.serializers['undefined'] = new UndefinedSerializer();
        this.serializers['BigInt'] = new BigIntSerializer();
        this.serializers['Date'] = new DateSerializer();
        this.serializers['StoredMap'] = new StoredMapSerializer();
        this.serializers['Map'] = new MapSerializer();
        this.serializers['Set'] = new SetSerializer();
        this.serializers['AsyncFunction'] = new AsyncFunctionSerializer();
        this.serializers['AsyncGeneratorFunction'] = new AsyncGeneratorFunctionSerializer();
        this.serializers['GeneratorFunction'] = new GeneratorFunctionSerializer();
        this.serializers['Function'] = new FunctionSerializer();
    }
    parse(json) {
        let jsonObject = JSON.parse(json);
        if (typeof jsonObject == 'string') {
            let deserializerName = jsonObject.slice(0, jsonObject.indexOf('('));
            let serializer = this.serializers[deserializerName];
            if (serializer != undefined) {
                let deserializerArguments;
                let deserializerArgumentsText = jsonObject.slice(jsonObject.indexOf('(') + 1, jsonObject.lastIndexOf(')'));
                while (deserializerArguments == undefined) {
                    try {
                        deserializerArguments = this.parse('[' + deserializerArgumentsText + ']');
                    }
                    catch (e) {
                        if (e instanceof SyntaxError
                            && e.message.includes('Unexpected token')
                            && deserializerArgumentsText.includes('\\"')) {
                            deserializerArgumentsText = deserializerArgumentsText.replaceAll('\\"', '"');
                        }
                        else {
                            throw e;
                        }
                    }
                }
                jsonObject = serializer.deserialize(deserializerArguments);
            }
        }
        else if (typeof jsonObject == 'object') {
            for (let key of Object.keys(jsonObject)) {
                jsonObject[key] = this.parse(this.stringify(jsonObject[key]));
            }
        }
        return jsonObject;
    }
    stringify(value) {
        let modificationValue = copy(value);
        for (let [serializerName, serializer] of Object.entries(this.serializers)) {
            let stringArray = serializer.serialize(modificationValue);
            if (stringArray) {
                let argumentsText = stringArray.map((string) => this.stringify(string)).join(',');
                modificationValue = `${serializerName}(${argumentsText})`;
                break;
            }
        }
        if (typeof modificationValue == 'object') {
            for (let key in modificationValue) {
                let stringifyValue = this.stringify(value[key]);
                if (stringifyValue.startsWith('"') && stringifyValue.endsWith('"')) {
                    modificationValue[key] = stringifyValue.slice(1, stringifyValue.length - 1);
                }
            }
        }
        return JSON.stringify(modificationValue);
    }
    convertKeyToFilename(key) {
        let filename;
        if (typeof key == 'string' && isValidKeyValueFile(key) == true) {
            filename = key;
        }
        else {
            filename = Buffer.from(this.stringify(key)).toString('base64url');
            if (isValidKeyValueFile(filename) == false) {
                throw new Error(this.failedToConvertMessage);
            }
        }
        return filename + '.json';
    }
    convertFilenameToKey(filename) {
        if (isValidKeyValueFile(filename) == false) {
            throw new Error(this.failedToConvertMessage);
        }
        if (filename.includes('.json')) {
            filename = filename.slice(0, filename.indexOf('.json'));
        }
        let key;
        try {
            key = this.parse(Buffer.from(filename, 'base64url').toString('ascii'));
        }
        catch (e) {
            key = filename;
        }
        return key;
    }
}
