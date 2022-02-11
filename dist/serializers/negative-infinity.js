export class NegativeInfinitySerializer {
    serialize(value) {
        // If the value is a negative infinity, return an empty array.
        if (typeof value == 'number' && value == -Infinity) {
            return [];
        }
    }
    deserialize() {
        return -Infinity;
    }
}
