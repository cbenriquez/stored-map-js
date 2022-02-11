export declare let GeneratorFunction: GeneratorFunction;
export declare type GeneratorFunctionSerialized = [...string[], string];
export declare namespace GeneratorFunctionSerializer {
    function serialize(value: any): GeneratorFunctionSerialized | undefined;
    function deserialize(args: GeneratorFunctionSerialized): Generator<unknown, any, unknown>;
}
