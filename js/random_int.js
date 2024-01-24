// Generate random integer from min to max (included), e.g. from 3 to 5 will return 3,4 or 5
// linter: ngspicejs-lint --internal
"use strict";

function random_int(aMin, aMax) {
    // Generate random integer from min to max (included), e.g. from 3 to 5 will return 3,4 or 5
    assert_arguments_length(arguments, 2, 2, 'random_int(min,max)');
    assert_integer(aMin, 'min', 'random_int(min,max)');
    assert_integer(aMax, 'max', 'random_int(min,max)');
    if (aMin > aMax) {
        throw new Exception('random_int(min=' + aMin + ',max=' + aMax + ') - min must be lower or equal to max');
    }
    return aMin + Math.round((aMax - aMin) * Math.random());
}

globalThis.exports = {random_int};
globalThis.random_int = random_int;
