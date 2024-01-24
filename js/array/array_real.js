// Return only real part of array of complex values
// linter: ngspicejs-lint --internal
"use strict";

function array_real(aComplexArray) {
    // Return only real part of array of complex values
    assert_arguments_length(arguments, 1, 1, 'array_real(complex_array)');
    assert_array(aComplexArray, 'complex_array', 'array_real(complex_array)');
    return aComplexArray.map((a) => a[0]);
}

globalThis.exports = {array_real};
globalThis.array_real = array_real;
