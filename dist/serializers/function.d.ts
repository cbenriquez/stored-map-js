import { Serializer } from "../stored-map-converter";
export declare type FunctionSerialized = [...string[], string];
export declare function serializeFunction(object: any): [...string[], string];
export declare class FunctionSerializer implements Serializer {
    serialize(value: any): FunctionSerialized | undefined;
    deserialize(args: FunctionSerialized): Function;
}
