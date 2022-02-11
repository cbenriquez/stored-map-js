export declare type SetSerialized = [any[]];
export declare namespace SetSerializer {
    function serialize(value: any): SetSerialized | undefined;
    function deserialize(args: SetSerialized): Set<any>;
}
