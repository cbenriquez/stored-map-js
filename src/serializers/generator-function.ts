import { serializeFunction } from "./function.js"

// Retrieve the constructor for generator function.
export let GeneratorFunction: GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor

export type GeneratorFunctionSerialized = [...string[], string]

export namespace GeneratorFunctionSerializer {

    export function serialize(value: any): GeneratorFunctionSerialized | undefined {
        // If the value is an instance of Generator Function, return the serialized function body.
        if (value instanceof GeneratorFunction) {
            return serializeFunction(value)
        }

    }

    export function deserialize(args: GeneratorFunctionSerialized) {
        // Construct a generator function from the arguments.
        return new GeneratorFunction(...args)

    }

}