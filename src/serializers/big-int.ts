import { Serializer } from "../stored-map-converter"

export type BigIntSerialized = [string]

export class BigIntSerializer implements Serializer {

    public serialize(value: any): BigIntSerialized | undefined {
        // If value is a BigInt, return an array containing the value converted to a string.
        if (typeof value == 'bigint') {
            return [value.toString()]
        }

    }

    public deserialize(args: BigIntSerialized) {
        // Convert the string back to BigInt and return it.
        return BigInt(args[0])

    }

}