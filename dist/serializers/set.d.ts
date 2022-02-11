import { Serializer } from "../stored-map-converter";
export declare type SetSerialized = [any[]];
export declare class SetSerializer implements Serializer {
    serialize(value: any): SetSerialized | undefined;
    deserialize(args: SetSerialized): Set<any>;
}
