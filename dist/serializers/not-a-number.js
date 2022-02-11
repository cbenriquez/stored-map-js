export var NotANumberSerializer;
(function (NotANumberSerializer) {
    function serialize(value) {
        // If the value's type is number and it's not a number, return an empty array.
        if (typeof value == 'number' && isNaN(value)) {
            return [];
        }
    }
    NotANumberSerializer.serialize = serialize;
    function deserialize() {
        // Return a not a number value.
        return NaN;
    }
    NotANumberSerializer.deserialize = deserialize;
})(NotANumberSerializer || (NotANumberSerializer = {}));
