let symbols = ['<', '>', ':', '"', '/', '\\', '|', '?', '*'];
let dosNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM0', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT0', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
export function isValidKeyValueFile(filename) {
    for (let symbol of symbols) {
        if (filename.includes(symbol)) {
            return false;
        }
    }
    let filenameIsAllPeriods = true;
    for (let index = 0; index < filename.length; index++) {
        let charCode = filename.charCodeAt(index);
        if (charCode < 32) {
            return false;
        }
        if (filenameIsAllPeriods == true && charCode != 46) {
            filenameIsAllPeriods = false;
        }
    }
    if (filenameIsAllPeriods == true || dosNames.includes(filename)) {
        return false;
    }
    return true;
}
