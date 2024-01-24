// Assert that value is a string
// linter: ngspicejs-lint --internal
"use strict";

function assert_string(aValue, aVariableName, aFunctionName, aCustomMessage) {
    // Assert that value is a string
    assert_arguments_length(arguments, 1, 4, 'assert_string(string,variable_name,function_name,custom_message)');
    if (typeof aValue !== 'string') {
        if (aCustomMessage) {
            throw new Exception(aCustomMessage);
        }
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be string but is ' + typeof aValue + ' (' + aValue +')');
    }
}

globalThis.exports = {assert_string};
Internal.assert_string = assert_string;
