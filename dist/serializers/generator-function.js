import { serializeFunction } from "./function.js";
// Retrieve the constructor for generator function.
export let GeneratorFunction = Object.getPrototypeOf(function* () { }).constructor;
export class GeneratorFunctionSerializer {
    serialize(value) {
        if (value instanceof GeneratorFunction) {
            return serializeFunction(value);
        }
    }
    deserialize(args) {
        return new GeneratorFunction(...args);
    }
}
