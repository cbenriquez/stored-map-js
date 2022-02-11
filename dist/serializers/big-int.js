export var BigIntSerializer;
(function (BigIntSerializer) {
    function serialize(value) {
        // If value is a BigInt, return an array containing the value converted to a string.
        if (typeof value == 'bigint') {
            return [value.toString()];
        }
    }
    BigIntSerializer.serialize = serialize;
    function deserialize(args) {
        // Convert the string back to BigInt and return it.
        return BigInt(args[0]);
    }
    BigIntSerializer.deserialize = deserialize;
})(BigIntSerializer || (BigIntSerializer = {}));
