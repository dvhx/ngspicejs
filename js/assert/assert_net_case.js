// Assert that value is not net that differs from existing net only by case (e.g. vcc vs. VCC vs Vcc, just pick one!)
// linter: ngspicejs-lint --internal
"use strict";

function assert_net_case(aValue, aVariableName, aFunctionName) {
    // Assert that value is not net that differs from existing net only by case (e.g. vcc vs. VCC vs Vcc, just pick one!)
    assert_arguments_length(arguments, 1, 3, 'assert_net_case(net,variable_name,function_name)');
    var k = aValue.toString().toLowerCase();
    if (typeof aValue === 'string' && (aValue !== aValue.toLowerCase())) {
        throw new Exception('Use only lowercase for net names, variable "' + aVariableName + '" value "' + aValue + '" contains uppercase letters in function ' + aFunctionName);
    }
    if (assert_net_case.nets[k] && (assert_net_case.nets[k].toString() !== aValue.toString())) {
        throw new Exception('Mixing case in net names is not allowed, you used both "' + aValue + '" and "' + assert_net_case.nets[k] + '" in function ' + aFunctionName);
    }
    assert_net_case.nets[k] = aValue;
}
assert_net_case.nets = {};

globalThis.exports = {assert_net_case};
Internal.assert_net_case = assert_net_case;
