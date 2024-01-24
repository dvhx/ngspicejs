// Returns item with lowest value from array_extrema()
// linter: ngspicejs-lint --internal
"use strict";

function array_extrema_min(a) {
    // Returns item with lowest value from array_extrema()
    assert_arguments_length(arguments, 1, 1, 'array_extrema_min(array)');
    assert_array(a, 'a', 'array_extrema_min(array)');
    return array_extrema(a).sort((b, c) => b.value - c.value)[0];
}

globalThis.exports = {array_extrema_min};
globalThis.array_extrema_min = array_extrema_min;
