import { Serializer } from "../stored-map-converter"

export type DateSerialized = [number]

export class DateSerializer implements Serializer {
    public serialize(value: any): DateSerialized | undefined {
        if (value instanceof Date) {
            return [value.getTime()]
        }
    }

    public deserialize(args: DateSerialized) {
        return new Date(args[0])
    }
}