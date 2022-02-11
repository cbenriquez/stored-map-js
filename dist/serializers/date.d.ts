export declare type DateSerialized = [number];
export declare namespace DateSerializer {
    function serialize(value: any): DateSerialized | undefined;
    function deserialize(args: DateSerialized): Date;
}
