// Assert that value is integer
// linter: ngspicejs-lint --internal
"use strict";

function assert_integer(aValue, aVariableName, aFunctionName, oMin, oMax) {
    // Assert that value is integer
    assert_arguments_length(arguments, 3, 5, 'assert_integer(value,variable_name,function_name,min,max)');
    if (!Number.isInteger(aValue)) {
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be integer but is ' + aValue + ' (' + typeof aValue + ')');
    }
    if (oMin !== undefined && aValue < oMin) {
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be higher than ' + oMin + ' but is ' + aValue);
    }
    if (oMax !== undefined && aValue > oMax) {
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be lower than ' + oMax + ' but is ' + aValue);
    }
}

//globalThis.exports = {assert_integer};
Internal.assert_integer = assert_integer;
