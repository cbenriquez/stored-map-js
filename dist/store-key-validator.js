let symbols = ['<', '>', ':', '"', '/', '\\', '|', '?', '*'];
let dosNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM0', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT0', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
export function isValidStoreKey(storeKey) {
    // Iterate through every symbols and return an Error if store key includes the symbol.
    for (let symbol of symbols)
        if (storeKey.includes(symbol))
            return Error(`Cannot contain the symbol "${symbol}"`);
    // Assume that the store key is all periods and iterate through every index of the store key.
    let storekeyIsAllPeriods = true;
    for (let index = 0; index < storeKey.length; index++) {
        // Get the character code at the index.
        let charCode = storeKey.charCodeAt(index);
        // If the character code is less than 32, return an Error.
        if (charCode < 32)
            return Error(`Cannot contain a character code less than 32.`);
        // If store key is all periods is true and the character is not a period, set it to false.
        if (storekeyIsAllPeriods && charCode != 46)
            storekeyIsAllPeriods = false;
    }
    // If the store key is all periods, return an Error.
    if (storekeyIsAllPeriods)
        return Error('Cannot contain only periods');
    // If the array of DOS names includes the store key, return an Error.
    if (dosNames.includes(storeKey))
        return Error('Cannot be a DOS name');
    return true;
}
