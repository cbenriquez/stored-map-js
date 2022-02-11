export class DateSerializer {
    serialize(value) {
        // If the value is a Date object, return an array containing the time value in milliseconds.
        if (value instanceof Date) {
            return [value.getTime()];
        }
    }
    deserialize(args) {
        // Convert the time value back to a Date object and return it.
        return new Date(args[0]);
    }
}
