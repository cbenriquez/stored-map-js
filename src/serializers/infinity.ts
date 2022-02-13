import { Serializer } from "../stored-map-converter"

export class InfinitySerializer implements Serializer {
    public serialize(value: any) {
        if (typeof value == 'number' && value == Infinity) {
            return []
        }
    }

    public deserialize() {
        return Infinity
    }
}