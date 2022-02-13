export class DateSerializer {
    serialize(value) {
        if (value instanceof Date) {
            return [value.getTime()];
        }
    }
    deserialize(args) {
        return new Date(args[0]);
    }
}
