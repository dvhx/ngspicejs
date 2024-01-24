// Singlecoil pickup
// linter: ngspicejs-lint --internal
"use strict";

function device_attr_assign(aDevice, aDeviceAttr, aKeysToSkip) {
    // Assign attr of a device from object using setter functions of the device, e.g. device.model(device.attr.model);
    assert_arguments_length(arguments, 2, 3, 'device_attr_assign(device,attr,keys_to_skip)');
    error.happened = false;
    for (const [key, val] of Object.entries(aDevice.attr)) {
        if (aKeysToSkip && aKeysToSkip.includes(key)) {
            continue;
        }
        if (typeof aDevice[key] !== 'function') {
            error("Cannot assign " + key + " to " + aDevice.constructor.name + " device " + (aDevice.attr && aDeviceAttr.name) + ", no such setter function " + key + "()");
            continue;
        }
        //echo('key', key, 'val', val, 'f', typeof aDevice[key]);
        aDevice[key](val);
        //echo('key', key, 'val', val, 'f', typeof aDevice[key]);
    }
    if (error.happened) {
        throw new Exception("Failed to re-assign all device attributes");
    }
}

globalThis.exports = {device_attr_assign};
//globalThis.device_attr_assign = device_attr_assign;
