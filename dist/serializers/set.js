export class SetSerializer {
    serialize(value) {
        // If the value is an instance of Set, return the array from the set.
        if (value instanceof Set) {
            return [Array.from(value)];
        }
    }
    deserialize(args) {
        // Construct a new Set from the array.
        return new Set(args[0]);
    }
}
