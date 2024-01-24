// Clamp values of array to interval <min,max>
// linter: ngspicejs-lint --internal
"use strict";

function array_clamp(aArray, aMin, aMax) {
    // Clamp values of array to interval <min,max>
    assert_arguments_length(arguments, 3, 3, 'array_clamp(array,min,max)');
    assert_array(aArray, 'array', 'array_clamp(array,min,max)');
    return aArray.map((a) => {
        if (a < aMin) {
            return aMin;
        }
        if (a > aMax) {
            return aMax;
        }
        return a;
    });
}

globalThis.exports = {array_clamp};
globalThis.array_clamp = array_clamp;
