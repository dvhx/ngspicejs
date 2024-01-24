// Return difference between largest and smallest value in array
// linter: ngspicejs-lint --internal
"use strict";

function array_range(a) {
    // Return difference between largest and smallest value in array
    assert_arguments_length(arguments, 1, 1, 'array_range(array)');
    assert_array(a, 'array', 'array_range(array)');
    var i, l = a.length, v, min = Number.MAX_VALUE, max = -Number.MAX_VALUE;
    for (i = 0; i < l; i++) {
        v = a[i];
        if (v < min) {
            min = v;
        }
        if (v > max) {
            max = v;
        }
    }
    return max - min;
    //return array_max(a) - array_min(a); too slow
}

function array_amplitude(a) {
    // Return half of the range
    return array_range(a) / 2;
}

globalThis.exports = {array_range};
globalThis.array_range = array_range;
globalThis.array_amplitude = array_amplitude;
