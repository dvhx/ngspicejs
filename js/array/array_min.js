// Return minimal value in array
// linter: ngspicejs-lint --internal
"use strict";

function array_min(a) {
    // Return minimal value in array
    assert_arguments_length(arguments, 1, 1, 'array_min(array)');
    assert_array(a, 'a', 'array_min(array)');
    if (Array.isArray(a[0]) && a[0].length === 2) {
        a = a.modulus();
    }
    var i, l = a.length, m = Number.MAX_VALUE;
    for (i = 0; i < l; i++) {
        if (a[i] < m) {
            m = a[i];
        }
    }
    return m;
    //return Math.min(...a); stack overflow
}

globalThis.exports = {array_min};
globalThis.array_min = array_min;
