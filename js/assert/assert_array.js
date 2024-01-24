// Assert that value is an array
// linter: ngspicejs-lint --internal
"use strict";

function assert_array(aValue, aVariableName, aFunctionName) {
    // Assert that value is an array
    assert_arguments_length(arguments, 3, 3, 'assert_array(array,variable_name,function_name)');
    if (!Array.isArray(aValue)) {
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be array but is ' + typeof aValue);
    }
}

globalThis.exports = {assert_array};
Internal.assert_array = assert_array;
