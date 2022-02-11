export class NotANumberSerializer {
    serialize(value) {
        // If the value's type is number and it's not a number, return an empty array.
        if (typeof value == 'number' && isNaN(value)) {
            return [];
        }
    }
    deserialize() {
        // Return a not a number value.
        return NaN;
    }
}
