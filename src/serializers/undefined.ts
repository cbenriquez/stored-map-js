import { Serializer } from "../stored-map-converter"

export class UndefinedSerializer implements Serializer {

    public serialize(value: any) {
        // If the value is an undefined, return an empty array.
        if (value == undefined) {
            return []
        }

    }

    public deserialize() {
        // Return an undefined value.
        return undefined
        
    }

}
