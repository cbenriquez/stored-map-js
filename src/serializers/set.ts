export type SetSerialized = [any[]]

export namespace SetSerializer {

    export function serialize(value: any): SetSerialized | undefined {
        // If the value is an instance of Set, return the array from the set.
        if (value instanceof Set) {
            return [Array.from(value)]
        }

    }

    export function deserialize(args: SetSerialized) {
        // Construct a new Set from the array.
        return new Set(args[0])
        
    }

}