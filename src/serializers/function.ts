export type FunctionSerialized = [...string[], string]

export function serializeFunction(object: any): [...string[], string] {
    // Convert the function to a string.
    let source: string = object.toString()

    // Remove all line breaks from the string.
    source = source.replaceAll('\n', '')

    // Retrieve all parameter names of the function.
    let parameters = source.slice(source.indexOf('(') + 1, source.indexOf(')'))
    .replaceAll('\\n', '')
    .replaceAll('\\', '')
    .replaceAll(' ', '')
    .split(',')

    // Filter empty parameter names.
    parameters = parameters.filter((parameter) => parameter)

    // Retrieve the code from the string.
    let code = source.slice(source.indexOf('{') + 1, source.lastIndexOf('}'))

    // Return the parameters and the code in an array.
    return [...parameters, code]

}

export namespace FunctionSerializer {

    export function serialize(value: any): FunctionSerialized | undefined {
        // If the value is an instance of Function, return the serialized function body.
        if (value instanceof Function) {
            return serializeFunction(value)
        }
        
    }

    export function deserialize(args: FunctionSerialized) {
        // Construct a generator function from the arguments.
        return new Function(...args)
        
    }

}