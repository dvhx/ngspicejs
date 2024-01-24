// Return sum of all items in array
// linter: ngspicejs-lint --internal
"use strict";

function array_sum(a) {
    // Return sum of all items in array
    assert_arguments_length(arguments, 1, 1, 'array_sum(array)');
    assert_array(a, 'a', 'array_sum(a)');
    return a.reduce(function(a, b) { return a + b; });
}

globalThis.exports = {array_sum};
globalThis.array_sum = array_sum;
