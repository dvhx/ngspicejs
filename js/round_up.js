// Round up to specified number of digits
// linter: ngspicejs-lint --internal
"use strict";

function round_up(aValue, aDigits) {
    // Round up to specified number of digits
    var p = Math.pow(10, aDigits || 0);
    return Math.ceil((aValue + Number.EPSILON) * p) / p;
}

globalThis.exports = {round_up};
globalThis.round_up = round_up;
