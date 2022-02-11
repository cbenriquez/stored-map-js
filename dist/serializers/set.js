export var SetSerializer;
(function (SetSerializer) {
    function serialize(value) {
        // If the value is an instance of Set, return the array from the set.
        if (value instanceof Set) {
            return [Array.from(value)];
        }
    }
    SetSerializer.serialize = serialize;
    function deserialize(args) {
        // Construct a new Set from the array.
        return new Set(args[0]);
    }
    SetSerializer.deserialize = deserialize;
})(SetSerializer || (SetSerializer = {}));
