// Convert array ['foo',true,3.14] to [0,1,2], useful in chart_xy for data without x-axis
// linter: ngspicejs-lint --internal
"use strict";

function array_indices(aArray) {
    // Convert array ['foo',true,3.14] to [0,1,2], useful in chart_xy for data without x-axis
    assert_arguments_length(arguments, 1, 1, 'array_indices(arr)');
    assert_array(aArray, 'arr', 'array_indices(arr)');
    return aArray.map((_, index) => index);
}

globalThis.exports = {array_indices};
globalThis.array_indices = array_indices;
