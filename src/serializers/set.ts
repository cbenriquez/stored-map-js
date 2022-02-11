import { Serializer } from "../stored-map-converter"

export type SetSerialized = [any[]]

export class SetSerializer implements Serializer {

    public serialize(value: any): SetSerialized | undefined {
        // If the value is an instance of Set, return the array from the set.
        if (value instanceof Set) {
            return [Array.from(value)]
        }

    }

    public deserialize(args: SetSerialized) {
        // Construct a new Set from the array.
        return new Set(args[0])
        
    }

}