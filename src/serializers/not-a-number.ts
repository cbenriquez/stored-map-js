export namespace NotANumberSerializer {

    export function serialize(value: any) {
        // If the value's type is number and it's not a number, return an empty array.
        if (typeof value == 'number' && isNaN(value)) {
            return []
        }

    }

    export function deserialize() {
        // Return a not a number value.
        return NaN

    }

}