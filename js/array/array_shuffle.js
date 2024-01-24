// Return randomized shallow copy of array
// linter: ngspicejs-lint --internal
"use strict";

function array_shuffle(aArray) {
    // Return randomized shallow copy of array
    assert_arguments_length(arguments, 1, 1, 'array_shuffle(array)');
    assert_array(aArray, 'array', 'array_shuffle(array)');
    var i, j, temp, r = aArray.slice(); // slice is shallow
    for (i = r.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = r[i];
        r[i] = r[j];
        r[j] = temp;
    }
    return r;
}

globalThis.exports = {array_shuffle};
globalThis.array_shuffle = array_shuffle;




