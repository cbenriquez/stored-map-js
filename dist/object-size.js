import { arch } from "os";
let multipliers = {
    'string': 4
};
let architecture = arch();
if (architecture == 'x64') {
    multipliers.string = 8;
}
export function getObjectSize(object) {
    let bytes = 0;
    if (typeof object == 'boolean') {
        bytes = 4;
    }
    else if (typeof object == 'string') {
        bytes = object.length * multipliers.string;
    }
    else if (typeof object == 'number') {
        bytes = 8;
    }
    else if (typeof object == 'object') {
        for (let [key, value] of Object.entries(object)) {
            bytes += getObjectSize(key);
            bytes += getObjectSize(value);
        }
    }
    return bytes;
}
