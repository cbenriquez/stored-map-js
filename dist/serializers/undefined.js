export var UndefinedSerializer;
(function (UndefinedSerializer) {
    function serialize(value) {
        // If the value is an undefined, return an empty array.
        if (value == undefined) {
            return [];
        }
    }
    UndefinedSerializer.serialize = serialize;
    function deserialize() {
        // Return an undefined value.
        return undefined;
    }
    UndefinedSerializer.deserialize = deserialize;
})(UndefinedSerializer || (UndefinedSerializer = {}));
