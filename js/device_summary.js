// Return short human readable summary of device that will help user identify which devices is causing error
// linter: ngspicejs-lint --internal
"use strict";

function device_summary(aDevice) {
    // Return short human readable summary of device that will help user identify which devices is causing error
    var a = [];
    if (aDevice.type) {
        a.push(aDevice.type);
    } else {
        a.push('<untyped device>');
    }
    if (aDevice.attr.name) {
        a.push(aDevice.attr.name);
    } else {
        a.push('<unnamed>');
    }
    if (aDevice.attr && aDevice.attr.model) {
        a.push('model ' + aDevice.attr.model);
    }
    var i = aDevice.netlist_devices && aDevice.netlist_devices.indexOf(aDevice);
    if (i >= 0) {
        a.push('(device #' + i + ')');
    }
    return a.join(' ');
}

globalThis.device_summary = device_summary;
globalThis.exports = {device_summary};

