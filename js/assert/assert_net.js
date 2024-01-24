// Assert that value is valid net name
// linter: ngspicejs-lint --internal
"use strict";

function assert_net(aValue, aVariableName, aFunctionName) {
    // Assert that value is valid net name
    if (aValue === undefined) {
        throw new Exception('Variable "' + aVariableName + '" in function ' + aFunctionName + ' is undefined, nets should be integer or string');
    }
    assert_arguments_length(arguments, 1, 3, 'assert_net(value,variable_name,function_name)');
    //echo(typeof assert_net_case);
    //echo(Object.keys(globalThis).sort().join('\n'));
    assert_net_case(aValue, aVariableName, aFunctionName);
    if (Number.isInteger(aValue)) {
        return;
    }
    if (typeof aValue === 'string') {
        aValue = aValue.replace('#branch', '');
        /*
        if (aValue.match(/^[0-9\.]{1,100}$/)) {
            throw new Exception('Variable "' + aVariableName + '" in function ' + aFunctionName + ' has invalid value "' + aValue + '", don\'t use strings that only contains numbers, if you want net 123 use number, not string "123"');
        }
        */
        var s = aValue.match(/^[a-z0-9_]{1,100}$/);
        if (s) {
            s = s[0];
        }
        if (aValue !== s) {
            throw new Exception('Variable "' + aVariableName + '" in function ' + aFunctionName + ' has invalid value "' + aValue + '", nets should use a-z0-9_ no longer than 100 characters');
        }
        if (aValue.match('__')) {
            hint('Use at most one consecutive underscore in net "' + aValue + '"');
            throw new Exception('Net "' + aVariableName + '" in function ' + aFunctionName + ' contains two underscores, this may cause issues, don\'t use two underscores in net names!');
        }
        return;
    }
    throw new Exception('Variable "' + aVariableName + '" in function ' + aFunctionName + ', nets should be integer (e.g. 1 not "1") or string ("VCC") but is ' + aValue + ' (' + typeof aVariable + ')');
}

globalThis.exports = {assert_net};
Internal.assert_net = assert_net;
