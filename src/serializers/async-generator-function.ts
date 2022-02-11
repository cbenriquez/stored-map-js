import { serializeFunction } from "./function.js"

// Retrieve the constructor for async generator function.
export let AsyncGeneratorFunction: AsyncGeneratorFunction = Object.getPrototypeOf(async function*(){}).constructor

export type AsyncGeneratorFunctionSerialized = [...string[], string]

export namespace AsyncGeneratorFunctionSerializer {

    export function serialize(value: any): AsyncGeneratorFunctionSerialized | undefined {
        // If value is an instance of Async Generator Function, return the serialized function body.
        if (value instanceof AsyncGeneratorFunction) {
            return serializeFunction(value)
        }

    }

    export function deserialize(args: AsyncGeneratorFunctionSerialized) {
        // Construct a async generator function from the arguments.
        return new AsyncGeneratorFunction(...args)

    }

}