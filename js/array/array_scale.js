// Return new array multiplied by a constant
// linter: ngspicejs-lint --internal
"use strict";

function array_scale(aArray, aConstant) {
    // Return new array multiplied by a constant
    assert_arguments_length(arguments, 2, 2, 'array_scale(array,constant)');
    assert_array(aArray, 'arr', 'array_scale(arr,constant)');
    assert_number(aConstant, 'constant', 'array_scale(arr,constant)');
    if (typeof aArray[0] === 'number') {
        assert_array_of_numbers(aArray, 'arr', 'array_scale(arr,constant)', false);
        return aArray.map((a) => a * aConstant);
    }
    assert_array_of_complex(aArray, 'arr', 'array_scale(arr,constant)');
    return aArray.map((a) => [a[0] * aConstant, a[1] * aConstant]);
}

globalThis.exports = {array_scale};
globalThis.array_scale = array_scale;
