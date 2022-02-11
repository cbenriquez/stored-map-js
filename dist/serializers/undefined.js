export class UndefinedSerializer {
    serialize(value) {
        // If the value is an undefined, return an empty array.
        if (value == undefined) {
            return [];
        }
    }
    deserialize() {
        // Return an undefined value.
        return undefined;
    }
}
