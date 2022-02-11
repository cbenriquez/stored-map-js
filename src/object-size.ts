import { arch } from "os"

// Default multipliers subject to change based on architecture.
let multipliers = {
    'string': 4
}

// The architecture the NodeJs binary is run on.
let architecture = arch()

// Handle it if the architecture is x64.
if (architecture == 'x64') {
    // Set the multiplier to 8 bytes for every character.
    multipliers.string = 8
}

export function getObjectSize(object: any[]) {
    let bytes = 0
    // Iterate through every element of the object and count their size.
    for (let element of object) {
        // If the element is a boolean, then count 4 bytes.
        if (typeof element == 'boolean') {
            bytes += 4
        }

        // If the element is a string, then count every character multiplied by the value of the string multiplier.
        else if (typeof element == 'string') {
            bytes += element.length * multipliers.string
        }

        // If the element is a number, then count 8 bytes.
        else if (typeof element == 'number') {
            bytes += 8
        }

        // If the elemet is a object, then invoke this function and count the result.
        else if (typeof element == 'object') {
            bytes += getObjectSize(element)
        }
    }

    // Return the size  of the object in bytes.
    return bytes

}
