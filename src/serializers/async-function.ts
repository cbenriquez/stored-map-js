import { Serializer } from "../stored-map-converter.js"
import { serializeFunction } from "./function.js"

// Retrieve the constructor for async function.
export let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

export type AsyncFunctionSerialized = [...string[], string]

export class AsyncFunctionSerializer implements Serializer {

    public serialize(value: any): AsyncFunctionSerialized | undefined {
        // If the value is an instance of Async Function, return the serialized function body.
        if (value instanceof AsyncFunction) {
            return serializeFunction(value)
        }

    }

    public deserialize(args: AsyncFunctionSerialized) {
        // Construct a async function from the arguments.
        return new AsyncFunction(...args)

    }

}