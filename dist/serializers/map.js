export var MapSerializer;
(function (MapSerializer) {
    function serializer(value) {
        // If the value is an instance of Map, return the array from the map.
        if (value instanceof Map) {
            return [Array.from(value)];
        }
    }
    MapSerializer.serializer = serializer;
    function deserialize(args) {
        // Construct a new map from the array.
        return new Map(args[0]);
    }
    MapSerializer.deserialize = deserialize;
})(MapSerializer || (MapSerializer = {}));
