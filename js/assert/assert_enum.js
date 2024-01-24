// Assert that value contains only allowed values
// linter: ngspicejs-lint --internal
"use strict";

function assert_enum(aValue, aAllowed, aVariableName, aFunctionName) {
    // Assert that value contains only allowed values
    assert_arguments_length(arguments, 4, 4, 'assert_enum(value,allowed,variable_name,function_name)');
    if (!aAllowed.includes(aValue)) {
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be one of [' + aAllowed.join(',') + '] but is ' + aValue);
    }
}

globalThis.exports = {assert_enum};
Internal.assert_enum = assert_enum;
