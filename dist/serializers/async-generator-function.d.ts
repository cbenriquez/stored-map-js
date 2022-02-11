export declare let AsyncGeneratorFunction: AsyncGeneratorFunction;
export declare type AsyncGeneratorFunctionSerialized = [...string[], string];
export declare namespace AsyncGeneratorFunctionSerializer {
    function serialize(value: any): AsyncGeneratorFunctionSerialized | undefined;
    function deserialize(args: AsyncGeneratorFunctionSerialized): AsyncGenerator<unknown, any, unknown>;
}
