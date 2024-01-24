// Assert that two values are exactly the same
// linter: ngspicejs-lint --internal
"use strict";

function assert_equal(aValue, aExpectedValue, aVariableName, aFunctionName, aCustomMessage) {
    // Assert that two values are exactly the same
    assert_arguments_length(arguments, 3, 5, 'assert_equal(value,expected_value,variable_name,function_name,custom_message)');
    if (aValue !== aExpectedValue) {
        hint('Expected: ' + aExpectedValue);
        hint('     Got: ' + aValue);
        if (aCustomMessage) {
            throw new Exception(aCustomMessage);
        }
        throw new Exception('variable ' + aVariableName + (aFunctionName ? ' in function ' + aFunctionName : '') + ' has unexpected value');
    }
}

globalThis.exports = {assert_equal};
Internal.assert_equal = assert_equal;
