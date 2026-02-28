// Convert array of engineering strings ["22k","4u7"] to numbers [22000,4.7e-6]
// linter: ngspicejs-lint --internal
"use strict";

function array_from_eng(aStringArray) {
    // Convert array of engineering strings ["22k","4u7"] to numbers [22000,4.7e-6]
    assert_arguments_length(arguments, 1, 1, 'array_from_eng(string_array)');
    assert_array(aStringArray, 'array', 'array_from_eng(string_array)');
    return aStringArray.map(eng);
}

globalThis.exports = {array_from_eng};
globalThis.array_from_eng = array_from_eng;
