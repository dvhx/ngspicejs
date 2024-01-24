// Convert array of complex values to array of arguments (angle part of polar coords)
// linter: ngspicejs-lint --internal
"use strict";

function array_argument(aComplexArray) {
    // Convert array of complex values to array of arguments (angle part of polar coords)
    assert_arguments_length(arguments, 1, 1, 'array_argument(complex_array)');
    assert_array(aComplexArray, 'arr', 'array_argument(complex_array)');
    return aComplexArray.map((a) => Math.atan2(a[1], a[0]));
}

globalThis.exports = {array_argument};
globalThis.array_argument = array_argument;
