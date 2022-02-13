export class MapSerializer {
    serialize(value) {
        if (value instanceof Map) {
            return [Array.from(value)];
        }
    }
    deserialize(args) {
        return new Map(args[0]);
    }
}
