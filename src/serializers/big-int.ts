export type BigIntSerialized = [string]

export namespace BigIntSerializer {

    export function serialize(value: any): BigIntSerialized | undefined {
        // If value is a BigInt, return an array containing the value converted to a string.
        if (typeof value == 'bigint') {
            return [value.toString()]
        }

    }

    export function deserialize(args: BigIntSerialized) {
        // Convert the string back to BigInt and return it.
        return BigInt(args[0])

    }

}