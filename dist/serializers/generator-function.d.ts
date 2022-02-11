import { Serializer } from "../stored-map-converter.js";
export declare let GeneratorFunction: GeneratorFunction;
export declare type GeneratorFunctionSerialized = [...string[], string];
export declare class GeneratorFunctionSerializer implements Serializer {
    serialize(value: any): GeneratorFunctionSerialized | undefined;
    deserialize(args: GeneratorFunctionSerialized): Generator<unknown, any, unknown>;
}
