// Return only imaginary part of array of complex values
// linter: ngspicejs-lint --internal
"use strict";

function array_imag(aComplexArray) {
    // Return only imaginary part of array of complex values
    assert_arguments_length(arguments, 1, 1, 'array_imag(complex_array)');
    assert_array_of_complex(aComplexArray, 'complex_array', 'array_imag(complex_array)');
    return aComplexArray.map((a) => a[1]);
}

globalThis.exports = {array_imag};
globalThis.array_imag = array_imag;
