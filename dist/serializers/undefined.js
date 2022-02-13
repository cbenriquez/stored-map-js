export class UndefinedSerializer {
    serialize(value) {
        if (value == undefined) {
            return [];
        }
    }
    deserialize() {
        return undefined;
    }
}
