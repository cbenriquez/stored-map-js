import { Serializer } from "../stored-map-converter"

export class NotANumberSerializer implements Serializer {
    public serialize(value: any) {
        if (typeof value == 'number' && isNaN(value)) {
            return []
        }

    }

    public deserialize() {
        return NaN
    }
}