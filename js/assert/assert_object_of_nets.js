// Assert that value is object containing nets as values, e.g. {anode: 1, cathode: 'vcc'}
// linter: ngspicejs-lint --internal
"use strict";

function assert_object_of_nets(aValue, aVariableName, aFunctionName) {
    // Assert that value is object containing nets as values, e.g. {anode: 1, cathode: 'vcc'}
    assert_arguments_length(arguments, 3, 3, 'assert_object_of_nets(object,variable_name,function_name)');
    if (typeof aValue !== 'object') {
        throw new Exception('Variable ' + aVariableName + ' is ' + typeof aValue + ' in ' + aFunctionName + ' but should be object');
    }
    for (var k in aValue) {
        if (aValue.hasOwnProperty(k)) {
            assert_net(aValue[k], aVariableName + '.' + k, aFunctionName);
        }
    }
}

globalThis.exports = {assert_object_of_nets};
Internal.assert_object_of_nets = assert_object_of_nets;
