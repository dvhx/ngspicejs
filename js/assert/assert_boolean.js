// Assert that value is boolean
// linter: ngspicejs-lint --internal
"use strict";

function assert_boolean(aValue, aVariableName, aFunctionName, aCustomMessage) {
    // Assert that value is boolean
    assert_arguments_length(arguments, 3, 4, 'assert_boolean(value,variable_name,function_name,custom_message)');
    if (typeof aValue !== 'boolean') {
        if (aCustomMessage) {
            throw new Exception(aCustomMessage);
        }
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be boolean but is ' + typeof aValue + ' (' + aValue +')');
    }
}

globalThis.exports = {assert_boolean};
Internal.assert_boolean = assert_boolean;
