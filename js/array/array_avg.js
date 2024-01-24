// Return average value of array of numbers
// linter: ngspicejs-lint --internal
"use strict";

function array_avg(a) {
    // Return average value of array of numbers
    assert_arguments_length(arguments, 1, 1, 'array_avg(array)');
    assert_array(a, 'a', 'array_avg(array)');
    return array_sum(a) / a.length;
}

globalThis.exports = {array_avg};
globalThis.array_avg = array_avg;
