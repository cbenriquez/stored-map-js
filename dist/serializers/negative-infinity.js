export var NegativeInfinitySerializer;
(function (NegativeInfinitySerializer) {
    function serialize(value) {
        // If the value is a negative infinity, return an empty array.
        if (typeof value == 'number' && value == -Infinity) {
            return [];
        }
    }
    NegativeInfinitySerializer.serialize = serialize;
    function deserialize() {
        return -Infinity;
    }
    NegativeInfinitySerializer.deserialize = deserialize;
})(NegativeInfinitySerializer || (NegativeInfinitySerializer = {}));
