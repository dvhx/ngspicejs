// Show what devices are connected to given net to let user better diagnose the error message
// linter: ngspicejs-lint --internal
"use strict";

function hint_devices_on_net(aNetlistDevices, aNet) {
    // Show what devices are connected to given net to let user better diagnose the error message
    assert_arguments_length(arguments, 2, 2, 'hint_devices_on_net(netlist_devices, net)');
    assert_array(aNetlistDevices, 'netlist_devices', 'hint_devices_on_net(netlist_devices, net)');
    var on_net = [], types = {}, names = {};
    aNetlistDevices.map((d) => {
        if (!d.is_net_device) {
            return;
        }
        var o = d.get_nets();
        for (var [k,v] of Object.entries(o)) {
            if (v.toString() === aNet.toString()) {
                on_net.push(d.type + ' ' + d.attr.name + ' ' + k);
                names[d.attr.name] = 1;
                types[d.type] = 1;
            }
        }
    });
    var only_caps = !Object.keys(types).find(a => a !== 'capacitor');
    return {
        names: Object.keys(names),
        types: Object.keys(types),
        only_caps: only_caps,
        hint: "Net " + aNet + " contains: " + on_net.sort().join(', ')
    };
}

globalThis.exports = {hint_devices_on_net};
globalThis.hint_devices_on_net = hint_devices_on_net;
