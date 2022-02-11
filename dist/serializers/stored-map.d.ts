import { StoredMap } from "../stored-map.js";
export declare type StoredMapSerialized = [string];
export declare namespace StoredMapSerializer {
    function serialize(value: any): StoredMapSerialized | undefined;
    function deserialize(args: StoredMapSerialized): StoredMap;
}
