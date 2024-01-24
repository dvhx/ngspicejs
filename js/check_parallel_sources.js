// Check presence of parallel sources (including ammeters), it can cause issues
// linter: ngspicejs-lint --internal
"use strict";

function check_parallel_sources(aNetlistDevices) {
    // Check presence of parallel sources (including ammeters), it can cause issues
    assert_arguments_length(arguments, 1, 1, 'check_parallel_sources(netlist_devices)');
    assert_array(aNetlistDevices, 'netlist_devices', 'check_parallel_sources(netlist_devices)');
    var s = aNetlistDevices.filter((a) => a.is_voltage_source || a.type === 'ammeter');
    var ab = {};
    s.filter((v) => v.is_voltage_source).forEach((v) => {
        var n = v.get_nets();
        var key = Object.keys(n).sort().map((a) => a +' ' + n[a]).join(',');
        if (ab[key]) {
            var msg = 'Device ' + v.type + ' ' + v.attr.name + ' is parallel to device ' + ab[key].type + ' ' + ab[key].attr.name + ' (anode ' + v.attr.anode + ', cathode ' + v.attr.cathode + '), this may cause problems!';
            if (v.attr.rs || ab[key].attr.rs) {
                // If either device has series resistance, e.g. battery, it is not strictly parallel and error may not happen, so it will be only hint (if error does occur)
                hint(msg);
            } else {
                warn(msg);
            }
        }
        ab[key] = v;
    });
}

globalThis.exports = {check_parallel_sources};
// globalThis.check_parallel_sources = check_parallel_sources;
