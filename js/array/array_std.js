// Return standard deviation of an array
// linter: ngspicejs-lint --internal
"use strict";

function array_std (array) {
    // Return standard deviation of an array
    assert_arguments_length(arguments, 1, 1, 'array_std(array)');
    assert_array(array, 'array', 'array_std(array)');
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

globalThis.exports = {array_std};
globalThis.array_std = array_std;
