// Assert that value is array of nets
// linter: ngspicejs-lint --internal
"use strict";

function assert_array_of_nets(aValue, aVariableName, aFunctionName) {
    // Assert that value is array of nets
    assert_arguments_length(arguments, 3, 3, 'assert_array_of_nets(array,variable_name,function_name)');
    assert_array(aValue, aVariableName, aFunctionName);
    for (var i = 0; i < aValue.length; i++) {
        assert_net(aValue[i], aVariableName, aFunctionName);
    }
}

globalThis.exports = {assert_array_of_nets};
Internal.assert_array_of_nets = assert_array_of_nets;
