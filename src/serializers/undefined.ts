import { Serializer } from "../stored-map-converter"

export class UndefinedSerializer implements Serializer {
    public serialize(value: any) {
        if (value == undefined) {
            return []
        }
    }

    public deserialize() {
        return undefined 
    }
}
