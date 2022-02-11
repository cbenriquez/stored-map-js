export class InfinitySerializer {
    serialize(value) {
        // If the value is an Infinity, return an empty array.
        if (typeof value == 'number' && value == Infinity) {
            return [];
        }
    }
    deserialize() {
        // Return infinity.
        return Infinity;
    }
}
