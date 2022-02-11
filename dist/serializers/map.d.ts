import { Serializer } from "../stored-map-converter";
export declare type MapSerialized = [[any, any][]];
export declare class MapSerializer implements Serializer {
    serialize(value: any): MapSerialized | undefined;
    deserialize(args: MapSerialized): Map<any, any>;
}
