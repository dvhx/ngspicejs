// Assert that value is array of real numbers
// linter: ngspicejs-lint --internal
"use strict";

function assert_array_of_numbers(aValue, aVariableName, aFunctionName, aConvertEngToNumber) {
    // Assert that value is array of real numbers
    assert_arguments_length(arguments, 4, 4, 'assert_array_of_numbers(value,variable_name,function_name,convert_eng_to_number)');
    assert_array(aValue, aVariableName, aFunctionName);
    var t;
    for (var i = 0; i < aValue.length; i++) {
        t = typeof aValue[i];
        if (t === 'number') {
            continue;
        }
        if (aConvertEngToNumber && (t === 'string')) {
            aValue[i] = eng(aValue[i]);
            continue;
        }
        if (Array.isArray(aValue[i]) && aValue[i].length === 2) {
            hint('use array_real(data), array_imag(data), array_modulus(data) or array_phase(data)');
            throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be array of numbers but item #' + i + ' is complex number');
        }
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be array of numbers but item #' + i + ' is ' + typeof aValue[i]);
    }
}

globalThis.exports = {assert_array_of_numbers};
Internal.assert_array_of_numbers = assert_array_of_numbers;
