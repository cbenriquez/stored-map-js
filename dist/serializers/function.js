export function serializeFunction(object) {
    // Convert the function to a string.
    let source = object.toString();
    // Remove all line breaks from the string.
    source = source.replaceAll('\n', '');
    // Retrieve all parameter names of the function.
    let parameters = source.slice(source.indexOf('(') + 1, source.indexOf(')'))
        .replaceAll('\\n', '')
        .replaceAll('\\', '')
        .replaceAll(' ', '')
        .split(',');
    // Filter empty parameter names.
    parameters = parameters.filter((parameter) => parameter);
    // Retrieve the code from the string.
    let code = source.slice(source.indexOf('{') + 1, source.lastIndexOf('}'));
    // Return the parameters and the code in an array.
    return [...parameters, code];
}
export var FunctionSerializer;
(function (FunctionSerializer) {
    function serialize(value) {
        // If the value is an instance of Function, return the serialized function body.
        if (value instanceof Function) {
            return serializeFunction(value);
        }
    }
    FunctionSerializer.serialize = serialize;
    function deserialize(args) {
        // Construct a generator function from the arguments.
        return new Function(...args);
    }
    FunctionSerializer.deserialize = deserialize;
})(FunctionSerializer || (FunctionSerializer = {}));
