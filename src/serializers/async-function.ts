import { serializeFunction } from "./function.js"

// Retrieve the constructor for async function.
export let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

export type AsyncFunctionSerialized = [...string[], string]

export namespace AsyncFunctionSerializer {

    export function serialize(value: any): AsyncFunctionSerialized | undefined {
        // If the value is an instance of Async Funciton, return the serialized function body.
        if (value instanceof AsyncFunction) {
            return serializeFunction(value)
        }

    }

    export function deserialize(args: AsyncFunctionSerialized) {
        // Construct a async function from the arguments.
        return new AsyncFunction(...args)

    }

}