// Return all nets (preserves numbered nets as numbers)
// linter: ngspicejs-lint --internal
"use strict";

function netlist_nets(aNetlistDevices) {
    // Return all nets (preserves numbered nets as numbers)
    assert_arguments_length(arguments, 1, 1, 'netlist_nets(netlist_devices)');
    assert_array(aNetlistDevices, 'netlist_devices', 'netlist_nets(netlist_devices)');
    const all = [];
    aNetlistDevices.map((d) => {
        if (typeof d.is_net_device !== 'boolean') {
            throw new Exception('Device ' + d.type + ' ' + (d.attr.name || '') + ' does not correctly specify if it is net device via .is_net_device boolean');
        }
        if (!d.is_net_device) {
            return;
        }
        if (typeof d.get_nets !== 'function') {
            throw new Exception('Device ' + d.type + ' ' + (d.attr.name || '') + ' does not have get_nets() method');
        }
        var o = d.get_nets();
        Object.values(o).forEach((v) => {
            if (!all.includes(v)) {
                all.push(v);
            }
        });
    });
    return all.filter((a) => a != 0);
}

globalThis.exports = {netlist_nets};
globalThis.netlist_nets = netlist_nets;
