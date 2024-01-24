// Assert that value is a function
// linter: ngspicejs-lint --internal
"use strict";

function assert_function(aValue, aVariableName, aFunctionName, aCustomMessage) {
    // Assert that value is a function
    assert_arguments_length(arguments, 3, 4, 'assert_function(function,variable_name,function_name)');
    if (typeof aValue !== 'function') {
        if (aCustomMessage) {
            throw new Exception(aCustomMessage);
        }
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be function but is ' + typeof aValue + ' (' + aValue +')');
    }
}

globalThis.exports = {assert_function};
Internal.assert_function = assert_function;

