import { Serializer } from "../stored-map-converter"

export type SetSerialized = [any[]]

export class SetSerializer implements Serializer {
    public serialize(value: any): SetSerialized | undefined {
        if (value instanceof Set) {
            return [Array.from(value)]
        }
    }

    public deserialize(args: SetSerialized) {
        return new Set(args[0])
    }
}