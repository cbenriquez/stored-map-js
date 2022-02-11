export type DateSerialized = [number]

export namespace DateSerializer {

    export function serialize(value: any): DateSerialized | undefined {
        // If the value is a Date object, return an array containing the time value in milliseconds.
        if (value instanceof Date) {
            return [value.getTime()]
        }

    }

    export function deserialize(args: DateSerialized) {
        // Convert the time value back to a Date object and return it.
        return new Date(args[0])
        
    }

}