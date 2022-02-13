import { Serializer } from "../stored-map-converter.js"
import { serializeFunction } from "./function.js"

export let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

export type AsyncFunctionSerialized = [...string[], string]

export class AsyncFunctionSerializer implements Serializer {
    public serialize(value: any): AsyncFunctionSerialized | undefined {
        if (value instanceof AsyncFunction) {
            return serializeFunction(value)
        }
    }

    public deserialize(args: AsyncFunctionSerialized) {
        return new AsyncFunction(...args)
    }
}