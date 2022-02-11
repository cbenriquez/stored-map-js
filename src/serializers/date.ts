import { Serializer } from "../stored-map-converter"

export type DateSerialized = [number]

export class DateSerializer implements Serializer {

    public serialize(value: any): DateSerialized | undefined {
        // If the value is a Date object, return an array containing the time value in milliseconds.
        if (value instanceof Date) {
            return [value.getTime()]
        }

    }

    public deserialize(args: DateSerialized) {
        // Convert the time value back to a Date object and return it.
        return new Date(args[0])
        
    }

}