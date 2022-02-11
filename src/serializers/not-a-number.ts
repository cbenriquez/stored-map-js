import { Serializer } from "../stored-map-converter"

export class NotANumberSerializer implements Serializer {

    public serialize(value: any) {
        // If the value's type is number and it's not a number, return an empty array.
        if (typeof value == 'number' && isNaN(value)) {
            return []
        }

    }

    public deserialize() {
        // Return a not a number value.
        return NaN

    }

}