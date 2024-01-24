// Return maximal value in array
// linter: ngspicejs-lint --internal
"use strict";

function array_max(a) {
    // Return maximal value in array
    assert_arguments_length(arguments, 1, 1, 'array_max(array)');
    assert_array(a, 'a', 'array_max(a)');
    if (Array.isArray(a[0]) && a[0].length === 2) {
        a = a.modulus();
    }
    var i, l = a.length, m = -Number.MAX_VALUE;
    for (i = 0; i < l; i++) {
        if (a[i] > m) {
            m = a[i];
        }
    }
    return m;
    // return Math.max(...a); not enough stack
}

globalThis.exports = {array_max};
globalThis.array_max = array_max;
