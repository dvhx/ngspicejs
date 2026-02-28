// Divide 2 arrays by items, only works for numbers and complex numbers
// linter: ngspicejs-lint --internal
"use strict";

function array_div(a, b) {
    // Divide 2 arrays by items, only works for numbers and complex numbers
    assert_arguments_length(arguments, 2, 2, 'array_div(array1,array2)');
    assert_array(a, 'a', 'array_div(a, b)');
    assert_array(b, 'b', 'array_div(a, b)');
    assert_array_same_length(a, b, 'array_div(a, b)');
    var i, complex = (a[0].length === 2) && (b[0].length === 2);
    var c = new Array(a.length).fill(complex ? [0,0] : 0);
    for (i = 0; i < c.length; i++) {
        if (complex) {
            var A = a[i][0];
            var B = a[i][1];
            var C = b[i][0];
            var D = b[i][1];
            var Q = C * C + D * D;
            c[i][0] = (A * C + B * D) / Q;
            c[i][1] = (B * C - A * D) / Q;
        } else {
            c[i] = a[i] / b[i];
        }
    }
    return c;
}

globalThis.exports = {array_div};
globalThis.array_div = array_div;
