// Return sum of 2 arrays as a new array
// linter: ngspicejs-lint --internal
"use strict";

function array_add(a, b) {
    // Return sum of 2 arrays as a new array
    assert_arguments_length(arguments, 2, 2, 'array_add(array1, array2)');
    assert_array(a, 'a', 'array_add(a, b)');
    assert_array(b, 'b', 'array_add(a, b)');
    assert_array_same_length(a, b, 'array_add(a, b)');
    var c = a.slice(), i, complex = (a[0].length === 2) && (b[0].length === 2);
    for (i = 0; i < c.length; i++) {
        if (complex) {
            c[i][0] += b[i][0];
            c[i][1] += b[i][1];
        } else {
            c[i] += b[i];
        }
    }
    return c;
}

globalThis.exports = {array_add};
globalThis.array_add = array_add;
