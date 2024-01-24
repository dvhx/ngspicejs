// Convert array of complex values to array of absolute values (length of a vector)
// linter: ngspicejs-lint --internal
"use strict";

function array_modulus(aComplexArray) {
    // Convert array of complex values to array of absolute values (length of a vector)
    assert_arguments_length(arguments, 1, 1, 'array_modulus(complex_array)');
    assert_array(aComplexArray, 'arr', 'array_modulus(arr)');
    assert_array_of_complex(aComplexArray, 'arr', 'array_modulus(arr)');
    return aComplexArray.map((a) => Math.sqrt(a[0] * a[0] + a[1] * a[1]));
}

globalThis.exports = {array_modulus};
globalThis.array_modulus = array_modulus;
