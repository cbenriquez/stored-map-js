import { serializeFunction } from "./function.js";
export let AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
export class AsyncFunctionSerializer {
    serialize(value) {
        if (value instanceof AsyncFunction) {
            return serializeFunction(value);
        }
    }
    deserialize(args) {
        return new AsyncFunction(...args);
    }
}
