import { Serializer } from "../stored-map-converter"

export class InfinitySerializer implements Serializer {

    public serialize(value: any) {
        // If the value is an Infinity, return an empty array.
        if (typeof value == 'number' && value == Infinity) {
            return []
        }

    }

    public deserialize() {
        // Return infinity.
        return Infinity
        
    }

}