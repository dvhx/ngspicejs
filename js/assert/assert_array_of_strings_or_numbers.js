// Assert that value is array of strings or numbers
// linter: ngspicejs-lint --internal
"use strict";

function assert_array_of_strings_or_numbers(aValue, aVariableName, aFunctionName) {
    // Assert that value is array of strings or numbers
    assert_arguments_length(arguments, 3, 3, 'assert_array_of_strings_or_numbers(array,variable_name,function_name)');
    assert_array(aValue, aVariableName, aFunctionName);
    for (var i = 0; i < aValue.length; i++) {
        if (typeof aValue[i] === 'number') {
            continue;
        }
        if (typeof aValue[i] !== 'string') {
            throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be array of string but item #' + i + ' is ' + typeof aValue[i]);
        }
    }
}

globalThis.exports = {assert_array_of_strings_or_numbers};
Internal.assert_array_of_strings_or_numbers = assert_array_of_strings_or_numbers;
