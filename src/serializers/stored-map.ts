import { Serializer } from "../stored-map-converter.js";
import { StoredMap } from "../stored-map.js";

export type StoredMapSerialized = [string]

export class StoredMapSerializer implements Serializer {
    public serialize(value: any): StoredMapSerialized | undefined {
        if (value instanceof StoredMap) {
            return [value.path]
        }

    }

    public deserialize(args: StoredMapSerialized) {
        return new StoredMap(args[0])
    }
}