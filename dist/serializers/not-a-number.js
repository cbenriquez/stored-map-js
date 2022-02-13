export class NotANumberSerializer {
    serialize(value) {
        if (typeof value == 'number' && isNaN(value)) {
            return [];
        }
    }
    deserialize() {
        return NaN;
    }
}
