import { Serializer } from "../stored-map-converter"

export class NegativeInfinitySerializer implements Serializer {

    public serialize(value: any) {
        // If the value is a negative infinity, return an empty array.
        if (typeof value == 'number' && value == -Infinity) {
            return []
        }
    }

    public deserialize() {
        return -Infinity
    }

}