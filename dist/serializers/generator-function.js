import { serializeFunction } from "./function.js";
// Retrieve the constructor for generator function.
export let GeneratorFunction = Object.getPrototypeOf(function* () { }).constructor;
export var GeneratorFunctionSerializer;
(function (GeneratorFunctionSerializer) {
    function serialize(value) {
        // If the value is an instance of Generator Function, return the serialized function body.
        if (value instanceof GeneratorFunction) {
            return serializeFunction(value);
        }
    }
    GeneratorFunctionSerializer.serialize = serialize;
    function deserialize(args) {
        // Construct a generator function from the arguments.
        return new GeneratorFunction(...args);
    }
    GeneratorFunctionSerializer.deserialize = deserialize;
})(GeneratorFunctionSerializer || (GeneratorFunctionSerializer = {}));
