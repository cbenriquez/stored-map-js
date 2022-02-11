import { arch } from "os";
// Default multipliers subject to change based on architecture.
let multipliers = {
    'string': 4
};
// The architecture the NodeJs binary is run on.
let architecture = arch();
// Handle it if the architecture is x64.
if (architecture == 'x64') {
    // Set the multiplier to 8 bytes for every character.
    multipliers.string = 8;
}
export function getObjectSize(object) {
    // Declare a variable to count the size of the object.
    let bytes = 0;
    // If the object is a boolean, then count 4 bytes.
    if (typeof object == 'boolean') {
        bytes = 4;
    }
    // If the object is a string, then count every character multiplied by the value of the string multiplier.
    else if (typeof object == 'string') {
        bytes = object.length * multipliers.string;
    }
    // If the object is a number, then count 8 bytes.
    else if (typeof object == 'number') {
        bytes = 8;
    }
    // If the object is a object, then invoke this function and count the result.
    else if (typeof object == 'object') {
        for (let [key, value] of Object.entries(object)) {
            bytes += getObjectSize(key);
            bytes += getObjectSize(value);
        }
    }
    // Return the size of the object.
    return bytes;
}
