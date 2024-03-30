// Add scalar to each item of the array, returns new array
// linter: ngspicejs-lint --internal
"use strict";

function array_add_scalar(a, s) {
    // Add scalar to each item of the array, returns new array
    assert_arguments_length(arguments, 2, 2, 'array_add_scalar(array, scalar)');
    assert_array(a, 'a', 'array_add_scalar(a, s)');
    if (!Array.isArray(s)) {
        assert_number(s, 's', 'array_add_scalar(a, s)');
    }
    var c = a.slice(), i, complex = (a[0].length === 2) && (s.length === 2);
    for (i = 0; i < c.length; i++) {
        if (complex) {
            c[i][0] += s[0];
            c[i][1] += s[1];
        } else {
            c[i] += s;
        }
    }
    return c;
}

globalThis.exports = {array_add_scalar};
globalThis.array_add_scalar = array_add_scalar;
