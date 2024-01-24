// Return items of a not present in b
// linter: ngspicejs-lint --internal
"use strict";

function array_complement(a, b) {
    // Return items of a not present in b
    // Note: I'm not sure if order is ideal
    assert_arguments_length(arguments, 2, 2, 'array_complement(array)');
    assert_array(a, 'array1', 'array_complement(array1,array2)');
    assert_array(b, 'array2', 'array_complement(array1,array2)');
    return a.filter((o) => !b.includes(o));
}

globalThis.exports = {array_complement};
globalThis.array_complement = array_complement;
