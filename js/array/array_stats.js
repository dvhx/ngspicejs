// Return all available array stats (min, max, avg, range, std)
// linter: ngspicejs-lint --internal
"use strict";

function array_stats(aArray) {
    // Return all available array stats (min, max, avg, range, std)
    assert_arguments_length(arguments, 1, 1, 'array_stats(array)');
    assert_array(aArray, 'array', 'array_stats(array)');
    return {
        length: aArray.length,
        min: array_min(aArray),
        max: array_max(aArray),
        avg: array_avg(aArray),
        std: array_std(aArray),
        rms: array_rms(aArray),
        range: array_range(aArray)
    };
}

globalThis.exports = {array_stats};
globalThis.array_stats = array_stats;
