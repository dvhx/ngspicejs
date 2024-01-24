// Assert that value is object
// linter: ngspicejs-lint --internal
"use strict";

function assert_object(aValue, aVariableName, aFunctionName, aCustomMessage) {
    // Assert that value is object
    assert_arguments_length(arguments, 3, 4, 'assert_object(value,variable_name,function_name,custom_message)');
    var t = Array.isArray(aValue) ? 'array' : typeof aValue;
    if (t !== 'object' || t === 'array' || aValue === null || aValue === undefined) {
        if (aCustomMessage) {
            throw new Exception(aCustomMessage);
        }
        throw new Exception('In function ' + aFunctionName + ' argument "' + aVariableName + '" should be object but is ' + t + ' (' + aValue +')');
    }
}

globalThis.exports = {assert_object};
Internal.assert_object = assert_object;
