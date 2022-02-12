import { serializeFunction } from "./function.js";
// Retrieve the constructor for async function.
export let AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
export class AsyncFunctionSerializer {
    serialize(value) {
        // If the value is an instance of Async Function, return the serialized function body.
        if (value instanceof AsyncFunction) {
            return serializeFunction(value);
        }
    }
    deserialize(args) {
        // Construct a async function from the arguments.
        return new AsyncFunction(...args);
    }
}
