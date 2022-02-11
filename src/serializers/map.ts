export type MapSerialized = [[any, any][]]

export namespace MapSerializer {

    export function serializer(value: any): MapSerialized | undefined {
        // If the value is an instance of Map, return the array from the map.
        if (value instanceof Map) {
            return [Array.from(value)]
        }

    }

    export function deserialize(args: MapSerialized) {
        // Construct a new map from the array.
        return new Map(args[0])

    }

}