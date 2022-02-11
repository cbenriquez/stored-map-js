export var InfinitySerializer;
(function (InfinitySerializer) {
    function serialize(value) {
        // If the value is an Infinity, return an empty array.
        if (typeof value == 'number' && value == Infinity) {
            return [];
        }
    }
    InfinitySerializer.serialize = serialize;
    function deserialize() {
        // Return infinity.
        return Infinity;
    }
    InfinitySerializer.deserialize = deserialize;
})(InfinitySerializer || (InfinitySerializer = {}));
