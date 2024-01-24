// Assert that netlist has at least one device that connects to a net
// linter: ngspicejs-lint --internal
"use strict";

function assert_netlist_has_net_devices(aFunctionName) {
    // Assert that netlist has at least one device that connects to a net
    assert_arguments_length(arguments, 1, 1, 'assert_netlist_has_net_devices(function_name)');
    var i, hints = [];
    for (i = 0; i < netlist_devices.length; i++) {
        if (netlist_devices[i].is_net_device) {
            return;
        }
        hints.push('netlist has only non-net device ' + netlist_devices[i].type + ' ' + (netlist_devices[i].attr.name || ''));
    }
    for (i = 0; i < hints.length; i++) {
        hint(hints[i]);
    }
    throw new Exception('function ' + aFunctionName + ' should only be used after you add some net devices to netlist');
}

globalThis.exports = {assert_netlist_has_net_devices};
Internal.assert_netlist_has_net_devices = assert_netlist_has_net_devices;
