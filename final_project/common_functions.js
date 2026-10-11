function isNumeric(value) {
    // Reject null, undefined, booleans, and empty/whitespace strings
    if (value === null || value === undefined || typeof value === 'boolean' || String(value).trim() === '') {
        return false;
    }

    // Confirms it converts to a valid, usable mathematical number
    return !isNaN(Number(value)) && isFinite(Number(value));
}

function isIntegerEnhanced(value) {
    // If it's not a valid number to begin with, it can't be an integer
    if (!isNumeric(value)) {
        return false;
    }

    return Number.isInteger(Number(value));
}

module.exports = {isNumeric, isIntegerEnhanced};