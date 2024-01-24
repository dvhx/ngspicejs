// Round to specified number of digits
// linter: ngspicejs-lint --internal
"use strict";

function round_to(aValue, aDigits) {
    // Round to specified number of digits
    var p = Math.pow(10, aDigits || 0);
    return Math.round((aValue + Number.EPSILON) * p) / p;
}

globalThis.exports = {round_to};
globalThis.round_to = round_to;
