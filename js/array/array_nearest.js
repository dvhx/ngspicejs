// Find nearest value in array of numbers
// linter: ngspicejs-lint --internal
"use strict";

function array_nearest(aArray, aConstant) {
    // Find nearest value in array of numbers
    assert_arguments_length(arguments, 2, 2, 'array_nearest(array,constant)');
    assert_array(aArray, 'arr', 'array_nearest(arr,constant)');
    assert_number(aConstant, 'constant', 'array_nearest(arr,constant)');
    assert_array_of_numbers(aArray, 'arr', 'array_nearest(arr,constant)', false);
    return aArray.reduce((prev, curr) =>
        Math.abs(curr - aConstant) < Math.abs(prev - aConstant) ? curr : prev
    );
}

globalThis.exports = {array_nearest};
globalThis.array_nearest = array_nearest;
