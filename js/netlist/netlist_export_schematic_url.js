// Format netlist as url that can be opened in stripboard2schematic
// linter: ngspicejs-lint --internal
"use strict";

function netlist_export_schematic_url(aOmmitNames) {
    // Format netlist as url that can be opened in stripboard2schematic
    assert_arguments_length(arguments, 0, 1, 'netlist_export_schematic_url(ommit_names_array)');
    var ret = [];
    var t = {
        jfet_n: "transistor_n_jfet",
        jfet_p: "transistor_p_jfet",
        npn: "transistor_npn",
        pnp: "transistor_pnp"
    };
    aOmmitNames = aOmmitNames || [];
    netlist_devices.filter((d) => (d.is_net_device || d.get_value) && !aOmmitNames.includes(d.attr.name)).map((d) => {
        if (typeof d.get_value !== 'function') {
            throw new Exception('Device ' + d.type + ' ' + d.attr.name + ' does not implement function get_value() needed in function netlist_export_schematic_url()');
        }
        d.validate();
        ret.push((t[d.type] || d.type) + ',' + d.attr.name + ',' + d.get_value() + ',' + Object.values(d.get_nets ? d.get_nets() : {}).join(','));
    });
    return 'https://dvhx.github.io/stripboard2schematic/schematic.html?share=' + ret.join('|');
}

globalThis.netlist_export_schematic_url = netlist_export_schematic_url;
globalThis.exports = {netlist_export_schematic_url};

