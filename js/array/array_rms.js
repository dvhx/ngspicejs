// Return root mean square value of array of numbers
// linter: ngspicejs-lint --internal
"use strict";

function array_rms(a) {
    // Return root mean square value of array of numbers
    assert_arguments_length(arguments, 1, 1, 'array_rms(array)');
    assert_array(a, 'array', 'array_rms(array)');
    return Math.sqrt(array_sum(a.map((v) => v * v)) / a.length);
}

globalThis.exports = {array_rms};
globalThis.array_rms = array_rms;

