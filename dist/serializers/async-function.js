import { serializeFunction } from "./function.js";
// Retrieve the constructor for async function.
export let AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
export var AsyncFunctionSerializer;
(function (AsyncFunctionSerializer) {
    function serialize(value) {
        // If the value is an instance of Async Funciton, return the serialized function body.
        if (value instanceof AsyncFunction) {
            return serializeFunction(value);
        }
    }
    AsyncFunctionSerializer.serialize = serialize;
    function deserialize(args) {
        // Construct a async function from the arguments.
        return new AsyncFunction(...args);
    }
    AsyncFunctionSerializer.deserialize = deserialize;
})(AsyncFunctionSerializer || (AsyncFunctionSerializer = {}));
