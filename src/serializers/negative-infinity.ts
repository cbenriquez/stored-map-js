import { Serializer } from "../stored-map-converter"

export class NegativeInfinitySerializer implements Serializer {
    public serialize(value: any) {
        if (typeof value == 'number' && value == -Infinity) {
            return []
        }
    }

    public deserialize() {
        return -Infinity
    }

}