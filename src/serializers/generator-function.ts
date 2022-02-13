import { Serializer } from "../stored-map-converter.js"
import { serializeFunction } from "./function.js"

// Retrieve the constructor for generator function.
export let GeneratorFunction: GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor

export type GeneratorFunctionSerialized = [...string[], string]

export class GeneratorFunctionSerializer implements Serializer {
    public serialize(value: any): GeneratorFunctionSerialized | undefined {
        if (value instanceof GeneratorFunction) {
            return serializeFunction(value)
        }
    }

    public deserialize(args: GeneratorFunctionSerialized) {
        return new GeneratorFunction(...args)
    }
}