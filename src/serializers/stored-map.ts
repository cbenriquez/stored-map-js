import { Serializer } from "../stored-map-converter.js";
import { StoredMap } from "../stored-map.js";

export type StoredMapSerialized = [string]

export class StoredMapSerializer implements Serializer {

    public serialize(value: any): StoredMapSerialized | undefined {
        // If the value is an instance of StoredMap, return the path of the object.
        if (value instanceof StoredMap) {
            return [value.path]
        }

    }

    public deserialize(args: StoredMapSerialized) {
        // Construct a new StoredMap object from the path.
        return new StoredMap(args[0])

    }
}