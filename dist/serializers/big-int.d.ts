import { Serializer } from "../stored-map-converter";
export declare type BigIntSerialized = [string];
export declare class BigIntSerializer implements Serializer {
    serialize(value: any): BigIntSerialized | undefined;
    deserialize(args: BigIntSerialized): bigint;
}
