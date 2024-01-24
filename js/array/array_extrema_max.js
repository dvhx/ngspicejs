// Returns item with largest value from array_extrema()
// linter: ngspicejs-lint --internal
"use strict";

function array_extrema_max(a) {
    // Returns item with largest value from array_extrema()
    assert_arguments_length(arguments, 1, 1, 'array_extrema_max(array)');
    assert_array(a, 'a', 'array_extrema_max(a)');
    return array_extrema(a).sort((b, c) => c.value - b.value)[0];
}

globalThis.exports = {array_extrema_max};
globalThis.array_extrema_max = array_extrema_max;
