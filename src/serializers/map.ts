import { Serializer } from "../stored-map-converter"

export type MapSerialized = [[any, any][]]

export class MapSerializer implements Serializer {
    public serialize(value: any): MapSerialized | undefined {
        if (value instanceof Map) {
            return [Array.from(value)]
        }
    }

    public deserialize(args: MapSerialized) {
        return new Map(args[0])
    }
}