// Assert that value is array of strings
// linter: ngspicejs-lint --internal
"use strict";

function assert_array_of_strings(aValue, aVariableName, aFunctionName) {
    // Assert that value is array of strings
    assert_arguments_length(arguments, 3, 3, 'assert_array_of_strings(array,variable_name,function_name)');
    assert_array(aValue, aVariableName, aFunctionName);
    for (var i = 0; i < aValue.length; i++) {
        if (typeof aValue[i] !== 'string') {
            throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be array of string but item #' + i + ' is ' + typeof aValue[i]);
        }
    }
}

globalThis.exports = {assert_array_of_strings};
Internal.assert_array_of_strings = assert_array_of_strings;
