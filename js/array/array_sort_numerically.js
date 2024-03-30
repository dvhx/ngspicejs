// Return array of numbers sorted by numbers ascending
// linter: ngspicejs-lint --internal
"use strict";

function array_sort_numerically(aRealArray) {
    // Return array of numbers sorted by numbers ascending
    assert_arguments_length(arguments, 1, 1, 'array_sort_numerically(real_array)');
    assert_array(aRealArray, 'array', 'array_sort_numerically(real_array)');
    return aRealArray.sort((a, b) => a - b);
}

globalThis.exports = {array_sort_numerically};
globalThis.array_sort_numerically = array_sort_numerically;

