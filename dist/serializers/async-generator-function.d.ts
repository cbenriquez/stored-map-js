import { Serializer } from "../stored-map-converter.js";
export declare let AsyncGeneratorFunction: AsyncGeneratorFunction;
export declare type AsyncGeneratorFunctionSerialized = [...string[], string];
export declare class AsyncGeneratorFunctionSerializer implements Serializer {
    serialize(value: any): AsyncGeneratorFunctionSerialized | undefined;
    deserialize(args: AsyncGeneratorFunctionSerialized): AsyncGenerator<unknown, any, unknown>;
}
