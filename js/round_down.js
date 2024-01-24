// Round down to specified number of digits
// linter: ngspicejs-lint --internal
"use strict";

function round_down(aValue, aDigits) {
    // Round down to specified number of digits
    var p = Math.pow(10, aDigits || 0);
    return Math.floor((aValue - Number.EPSILON) * p) / p;
}

globalThis.exports = {round_down};
globalThis.round_down = round_down;
