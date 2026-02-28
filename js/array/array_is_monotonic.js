// Return true if array is monotonic
// linter: ngspicejs-lint --internal
"use strict";

function array_is_monotonic(aArray) {
    // Return true if array is monotonic
    assert_arguments_length(arguments, 1, 1, 'array_is_monotonic(array)');
    assert_array(aArray, 'array', 'array_is_monotonic(array)');
    // Return true if array is entirely non-decreasing or entirely non-increasing
    if (aArray.length <= 1) {
      return true;
    }
    let increasing = true;
    let decreasing = true;
    for (let i = 1; i < aArray.length; i++) {
        if (aArray[i] > aArray[i - 1]) decreasing = false;
        if (aArray[i] < aArray[i - 1]) increasing = false;
        if (!increasing && !decreasing) {
            return false;
        }
    }
    return true;
}

globalThis.exports = {array_is_monotonic};
globalThis.array_is_monotonic = array_is_monotonic;

