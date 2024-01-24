// Assert that two values are array of same length
// linter: ngspicejs-lint --internal
"use strict";

function assert_array_same_length(a, b, aFunctionName) {
    // Assert that two values are array of same length
    assert_arguments_length(arguments, 3, 3, 'assert_array_same_length(a,b,function_name)');
    assert_array(a, 'a', 'assert_array_same_length(a, b) in function ' + aFunctionName);
    assert_array(b, 'b', 'assert_array_same_length(a, b) in function ' + aFunctionName);
    if (a.length !== b.length) {
        throw new Exception('Arrays should be same length but lenths are ' + a.length + ' and ' + b.length + ' in function ' + aFunctionName);
    }
}

globalThis.exports = {assert_array_same_length};
Internal.assert_array_same_length = assert_array_same_length;
