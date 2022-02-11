export namespace InfinitySerializer {

    export function serialize(value: any) {
        // If the value is an Infinity, return an empty array.
        if (typeof value == 'number' && value == Infinity) {
            return []
        }

    }

    export function deserialize() {
        // Return infinity.
        return Infinity
        
    }

}