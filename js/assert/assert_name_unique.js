// Assert that value is valid device name and that it is unique
// linter: ngspicejs-lint --internal
"use strict";

function assert_name_unique(aValue, aDevice, aNetlistDevices) {
    // Assert that value is valid device name and that it is unique
    assert_arguments_length(arguments, 3, 3, 'assert_name_unique(value,device,netlist_devices)');
    var i, j = aNetlistDevices.indexOf(aDevice);
    for (i = 0; i < aNetlistDevices.length; i++) {
        if (aNetlistDevices[i] !== aDevice) {
            if (aNetlistDevices[i].attr.name === aValue) {
                hint('Current device: ' + device_summary(aDevice));
                hint('Existing device #' + i + ': ' + device_summary(aNetlistDevices[i]));
                hint('Given NetlistDevices(' + aNetlistDevices.length + '):');
                for (var d = 0; d < aNetlistDevices.length; d++) {
                    hint('  #' + d + ': ' + device_summary(aNetlistDevices[d]));
                }
                //echo_json(aNetlistDevices);
                throw new Exception("Device #" + j + " " + aDevice.type + " " + aValue + " has duplicate name with device #" + i + " " + aNetlistDevices[i].type + " " + aNetlistDevices[i].attr.name);
            }
        }
    }
    assert_name(aValue, aDevice.type);
}

globalThis.exports = {assert_name_unique};
Internal.assert_name_unique = assert_name_unique;
