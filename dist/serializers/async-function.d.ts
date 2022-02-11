export declare let AsyncFunction: any;
export declare type AsyncFunctionSerialized = [...string[], string];
export declare namespace AsyncFunctionSerializer {
    function serialize(value: any): AsyncFunctionSerialized | undefined;
    function deserialize(args: AsyncFunctionSerialized): any;
}
