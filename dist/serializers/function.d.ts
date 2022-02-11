export declare type FunctionSerialized = [...string[], string];
export declare function serializeFunction(object: any): [...string[], string];
export declare namespace FunctionSerializer {
    function serialize(value: any): FunctionSerialized | undefined;
    function deserialize(args: FunctionSerialized): Function;
}
