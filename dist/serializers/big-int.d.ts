export declare type BigIntSerialized = [string];
export declare namespace BigIntSerializer {
    function serialize(value: any): BigIntSerialized | undefined;
    function deserialize(args: BigIntSerialized): bigint;
}
