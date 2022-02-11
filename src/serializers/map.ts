import { Serializer } from "../stored-map-converter"

export type MapSerialized = [[any, any][]]

export class MapSerializer implements Serializer {

    public serialize(value: any): MapSerialized | undefined {
        // If the value is an instance of Map, return the array from the map.
        if (value instanceof Map) {
            return [Array.from(value)]
        }

    }

    public deserialize(args: MapSerialized) {
        // Construct a new map from the array.
        return new Map(args[0])

    }

}