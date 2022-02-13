export class BigIntSerializer {
    serialize(value) {
        if (typeof value == 'bigint') {
            return [value.toString()];
        }
    }
    deserialize(args) {
        return BigInt(args[0]);
    }
}
