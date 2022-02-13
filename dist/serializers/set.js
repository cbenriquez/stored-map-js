export class SetSerializer {
    serialize(value) {
        if (value instanceof Set) {
            return [Array.from(value)];
        }
    }
    deserialize(args) {
        return new Set(args[0]);
    }
}
