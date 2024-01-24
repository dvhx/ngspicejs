// Return random item of array
// linter: ngspicejs-lint --internal
"use strict";

function array_random_item(aArray) {
    // Return random item of array
    assert_arguments_length(arguments, 1, 1, 'array_random_item(array)');
    assert_array(aArray, 'array', 'array_random_item(array)');
    return aArray[Math.floor(aArray.length * Math.random())];
}

globalThis.exports = {array_random_item};
globalThis.array_random_item = array_random_item;


