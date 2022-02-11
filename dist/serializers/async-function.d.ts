import { Serializer } from "../stored-map-converter.js";
export declare let AsyncFunction: any;
export declare type AsyncFunctionSerialized = [...string[], string];
export declare class AsyncFunctionSerializer implements Serializer {
    serialize(value: any): AsyncFunctionSerialized | undefined;
    deserialize(args: AsyncFunctionSerialized): any;
}
