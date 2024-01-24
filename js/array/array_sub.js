// Subtract 2 arrays, only works for numbers and complex numbers
// linter: ngspicejs-lint --internal
"use strict";

function array_sub(a, b) {
    // Subtract 2 arrays, only works for numbers and complex numbers
    assert_arguments_length(arguments, 2, 2, 'array_sub(array1,array2)');
    assert_array(a, 'a', 'array_sub(a, b)');
    assert_array(b, 'b', 'array_sub(a, b)');
    assert_array_same_length(a, b, 'array_sub(a, b)');
    var c = a.slice(), i, complex = (a[0].length === 2) && (b[0].length === 2);
    for (i = 0; i < c.length; i++) {
        if (complex) {
            c[i][0] -= b[i][0];
            c[i][1] -= b[i][1];
        } else {
            c[i] -= b[i];
        }
    }
    return c;
}

globalThis.exports = {array_sub};
globalThis.array_sub = array_sub;
