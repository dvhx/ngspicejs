// Convert current netlist to exportable object
// linter: ngspicejs-lint --internal
"use strict";

function netlist_export() {
    // Convert current netlist to exportable object
    assert_arguments_length(arguments, 0, 0, 'netlist_export()');
    return netlist_devices.map((d) => {
        return {type: d.type, attr: d.attr};
    });
}

globalThis.netlist_export = netlist_export;
globalThis.exports = {netlist_export};

