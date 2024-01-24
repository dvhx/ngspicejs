// Assert that value is poly (NOTE: currently disabled)
// linter: ngspicejs-lint --internal
"use strict";

function assert_poly(aValue, aVariableName, aFunctionName, aCustomMessage) {
    // Assert that value is poly (NOTE: currently disabled)
    ignore(aValue, aVariableName, aFunctionName, aCustomMessage);
    return;
    /*
    assert_arguments_length(arguments, 3, 4, 'assert_poly(poly,variable_name,function_name,custom_message)');
    assert_object(aValue, aVariableName, aFunctionName, aCustomMessage);
    assert_object_keys(aValue, ['type', 'dimension', 'names', 'coef', 'code'], aVariableName, aFunctionName);
    if (aValue.type !== 'poly') {
        throw new Exception('object should have type="poly" but is "' + aValue.type + '" instead' + (aCustomMessage ? '(' + aCustomMessage + ')' : ''));
    }
    assert_integer(aValue.dimension, 'poly.dimension');
    if (aValue.dimension <= 0) {
        throw new Exception('poly.dimension should be positive but is ' + aValue.dimension + ' instead' + (aCustomMessage ? '(' + aCustomMessage + ')' : ''));
    }
    assert_array(aValue.names, 'poly.names');
    assert_array(aValue.coef, 'poly.coef');
    assert_string(aValue.code, 'poly.code');
    */
}

globalThis.exports = {assert_poly};
Internal.assert_poly = assert_poly;
