// Return absolute values of array of numbers
// linter: ngspicejs-lint --internal
"use strict";

function array_abs(aRealArray) {
    // Return absolute values of array of numbers
    assert_arguments_length(arguments, 1, 1, 'array_abs(real_array)');
    assert_array(aRealArray, 'array', 'array_abs(real_array)');
    return aRealArray.map((a) => Math.abs(a));
}

globalThis.exports = {array_abs};
globalThis.array_abs = array_abs;
