// Assert that value is a valid device name
// linter: ngspicejs-lint --internal
"use strict";

function assert_name(aValue, aDeviceType) {
    // Assert that value is a valid device name
    assert_arguments_length(arguments, 2, 2, 'assert_name(value,device_type)');
    if (aValue === undefined) {
        throw new Exception('Device "' + aDeviceType + '" has undefined name, allowed chars are a-zA-Z0-9_, max length 100');
    }
    var msg = 'Device "' + aDeviceType + '" has invalid name "' + aValue + '" (' + typeof aValue +'), allowed chars are a-zA-Z0-9_, max length 100';
    if (typeof aValue === 'string') {
        if (aValue.match(/vdmos/i)) {
            hint('For more information see https://sourceforge.net/p/ngspice/bugs/642/');
            throw new Exception("Due to bug #642 in ngspice model name cannot contain string 'VDMOS' so change name '" + aValue + "' to something else");
        }
        var s = aValue.match(/^[a-zA-Z0-9_]{1,100}$/);
        if (s) {
            s = s[0];
        }
        if (aValue !== s) {
            throw new Exception(msg);
        }
        return;
    }
    throw new Exception(msg);
}

globalThis.exports = {assert_name};
Internal.assert_name = assert_name;
