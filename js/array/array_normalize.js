// Normalize array for lowest value to be aMin a largest to be aMax
// linter: ngspicejs-lint --internal
"use strict";

function array_normalize(aArray, aMin, aMax) {
    // Normalize array for lowest value to be aMin a largest to be aMax
    // example: array_normalize([1,2,3,4], 0, 10) returns [0, 3.33.., 6.66.., 10]
    assert_arguments_length(arguments, 3, 3, 'array_normalize(array,min,max)');
    assert_array(aArray, 'array', 'array_normalize(array,min,max)');
    var min = array_min(aArray),
        max = array_max(aArray);
    return aArray.map((v) => (aMax - aMin) * (v - min) / (max - min) + aMin);
}

globalThis.exports = {array_normalize};
globalThis.array_normalize = array_normalize;
