export namespace NegativeInfinitySerializer {

    export function serialize(value: any) {
        // If the value is a negative infinity, return an empty array.
        if (typeof value == 'number' && value == -Infinity) {
            return []
        }
    }

    export function deserialize() {
        return -Infinity
    }

}