import { Serializer } from "../stored-map-converter.js"
import { serializeFunction } from "./function.js"

// Retrieve the constructor for async generator function.
export let AsyncGeneratorFunction: AsyncGeneratorFunction = Object.getPrototypeOf(async function*(){}).constructor

export type AsyncGeneratorFunctionSerialized = [...string[], string]

export class AsyncGeneratorFunctionSerializer implements Serializer {
    public serialize(value: any): AsyncGeneratorFunctionSerialized | undefined {
        if (value instanceof AsyncGeneratorFunction) {
            return serializeFunction(value)
        }

    }

    public deserialize(args: AsyncGeneratorFunctionSerialized) {
        return new AsyncGeneratorFunction(...args)
    }
}