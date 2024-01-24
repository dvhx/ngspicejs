// Assert that value is a number
// linter: ngspicejs-lint --internal
"use strict";

function assert_number(aValue, aVariableName, aFunctionName, oMin, oMax) {
    // Assert that value is a number
    assert_arguments_length(arguments, 3, 5, 'assert_number(number,variable_name,function_name,min,max)');
    if (is_equation(aValue) || is_compiled_equation(aValue)) {
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be number but is equation ' + JSON.stringify(aValue));
    }
    if (typeof aValue !== 'number') {
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be number but is ' + aValue + ' (' + typeof aValue + ')');
    }
    if (oMin !== undefined && aValue < oMin) {
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be higher than ' + oMin + ' but is ' + aValue);
    }
    if (oMax !== undefined && aValue > oMax) {
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be lower than ' + oMax + ' but is ' + aValue);
    }
}

globalThis.exports = {assert_number};
Internal.assert_number = assert_number;
