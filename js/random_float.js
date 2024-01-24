// Generate random float from min to max (included), e.g. from 0.5 to 1.5 will return 0.684 or 1.352
// linter: ngspicejs-lint --internal
"use strict";

function random_float(aMin, aMax) {
    // Generate random integer from min to max (included), e.g. from 3 to 5 will return 3,4 or 5
    assert_arguments_length(arguments, 2, 2, 'random_float(min,max)');
    assert_number(aMin, 'min', 'random_float(min,max)');
    assert_number(aMax, 'max', 'random_float(min,max)');
    if (aMin > aMax) {
        throw new Exception('random_float(min=' + aMin + ',max=' + aMax + ') - min must be lower or equal to max');
    }
    return aMin + (aMax - aMin) * Math.random();
}

globalThis.exports = {random_float};
globalThis.random_float = random_float;

