export class InfinitySerializer {
    serialize(value) {
        if (typeof value == 'number' && value == Infinity) {
            return [];
        }
    }
    deserialize() {
        return Infinity;
    }
}
