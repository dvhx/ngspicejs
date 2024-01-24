// Convert current netlist to object importable by stripboard2schematic
// linter: ngspicejs-lint --internal
"use strict";

function netlist_export_schematic(aOmmitNames) {
    // Convert current netlist to object importable by stripboard2schematic
    assert_arguments_length(arguments, 0, 1, 'netlist_export_schematic(ommit_names_array)');
    aOmmitNames = aOmmitNames || [];
    var ret = netlist_devices.filter((d) => d.is_net_device && !aOmmitNames.includes(d.attr.name)).map((d) => {
        assert_function(d.get_value, d.type + '.get_value()', 'netlist_export_schematic');
        d.validate();
        return {
            type: d.type,
            name: d.attr.name,
            value: d.get_value(),
            nets: Object.values(d.get_nets ? d.get_nets() : {})
        };
    });
    ret.push({type: "ground", name: "Ground", value: '', nets: [0]});
    return ret;
}

globalThis.netlist_export_schematic = netlist_export_schematic;
globalThis.exports = {netlist_export_schematic};

