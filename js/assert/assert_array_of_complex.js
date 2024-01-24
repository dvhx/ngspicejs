// Assert that value is array and contains only complex numbers
// linter: ngspicejs-lint --internal
"use strict";

function assert_array_of_complex(aValue, aVariableName, aFunctionName, aConvertEngToNumber) {
    // Assert that value is array and contains only complex numbers
    assert_arguments_length(arguments, 3, 4, 'assert_array_of_complex(value,variable_name,function_name,convert_eng_to_number)');
    assert_array(aValue, aVariableName, aFunctionName);
    for (var i = 0; i < aValue.length; i++) {
        if (Array.isArray(aValue[i]) && aValue[i].length === 2) {
            if (aConvertEngToNumber) {
                if (typeof aValue[i][0] === 'string') {
                    aValue[i][0] = eng(aValue[i][0]);
                }
                if (typeof aValue[i][1] === 'string') {
                    aValue[i][1] = eng(aValue[i][1]);
                }
            }
            if (typeof aValue[i][0] === 'number' && typeof aValue[i][1] === 'number') {
                continue;
            }
            throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be array of two numbers but item #' + i + ' is ' + typeof aValue[i]);
        }
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be array of two numbers but item #' + i + ' is ' + typeof aValue[i]);
    }
}

globalThis.exports = {assert_array_of_complex};
Internal.assert_array_of_complex = assert_array_of_complex;
