// Return unique values of an array
// linter: ngspicejs-lint --internal
"use strict";

function array_unique(a) {
    // Return unique values of an array
    assert_arguments_length(arguments, 1, 1, 'array_unique(array)');
    assert_array(a, 'array', 'array_unique(array)');
    return a.filter((value, index, arr) => arr.indexOf(value) === index);
}

globalThis.exports = {array_unique};
globalThis.array_unique = array_unique;
