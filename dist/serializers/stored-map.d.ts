import { Serializer } from "../stored-map-converter.js";
import { StoredMap } from "../stored-map.js";
export declare type StoredMapSerialized = [string];
export declare class StoredMapSerializer implements Serializer {
    serialize(value: any): StoredMapSerialized | undefined;
    deserialize(args: StoredMapSerialized): StoredMap;
}
