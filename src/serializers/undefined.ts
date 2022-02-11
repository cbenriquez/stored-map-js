export namespace UndefinedSerializer {

    export function serialize(value: any) {
        // If the value is an undefined, return an empty array.
        if (value == undefined) {
            return []
        }

    }

    export function deserialize() {
        // Return an undefined value.
        return undefined
        
    }
}