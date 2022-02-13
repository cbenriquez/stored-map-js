import { Serializer } from "../stored-map-converter"

export type BigIntSerialized = [string]

export class BigIntSerializer implements Serializer {
    public serialize(value: any): BigIntSerialized | undefined {
        if (typeof value == 'bigint') {
            return [value.toString()]
        }
    }

    public deserialize(args: BigIntSerialized) {
        return BigInt(args[0])
    }
}