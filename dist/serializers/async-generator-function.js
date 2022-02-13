import { serializeFunction } from "./function.js";
// Retrieve the constructor for async generator function.
export let AsyncGeneratorFunction = Object.getPrototypeOf(async function* () { }).constructor;
export class AsyncGeneratorFunctionSerializer {
    serialize(value) {
        if (value instanceof AsyncGeneratorFunction) {
            return serializeFunction(value);
        }
    }
    deserialize(args) {
        return new AsyncGeneratorFunction(...args);
    }
}
