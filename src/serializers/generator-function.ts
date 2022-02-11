import { Serializer } from "../stored-map-converter.js"
import { serializeFunction } from "./function.js"

// Retrieve the constructor for generator function.
export let GeneratorFunction: GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor

export type GeneratorFunctionSerialized = [...string[], string]

export class GeneratorFunctionSerializer implements Serializer {

    public serialize(value: any): GeneratorFunctionSerialized | undefined {
        // If the value is an instance of Generator Function, return the serialized function body.
        if (value instanceof GeneratorFunction) {
            return serializeFunction(value)
        }

    }

    public deserialize(args: GeneratorFunctionSerialized) {
        // Construct a generator function from the arguments.
        return new GeneratorFunction(...args)

    }

}