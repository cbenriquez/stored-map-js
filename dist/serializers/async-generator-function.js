import { serializeFunction } from "./function.js";
// Retrieve the constructor for async generator function.
export let AsyncGeneratorFunction = Object.getPrototypeOf(async function* () { }).constructor;
export class AsyncGeneratorFunctionSerializer {
    serialize(value) {
        // If value is an instance of Async Generator Function, return the serialized function body.
        if (value instanceof AsyncGeneratorFunction) {
            return serializeFunction(value);
        }
    }
    deserialize(args) {
        // Construct a async generator function from the arguments.
        return new AsyncGeneratorFunction(...args);
    }
}
